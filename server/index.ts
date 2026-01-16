import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { WebhookHandlers } from "./webhookHandlers";
import { initializeDatabase } from "./db";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}
// Validate required environment variables at startup
function validateEnvironment() {
  const required = [
    "STRIPE_SECRET_KEY",
    "STRIPE_PUBLISHABLE_KEY",
    "DATABASE_URL",
  ];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      "Missing required environment variables:",
      missing.join(", ")
    );
    console.error("Please check your .env file or environment configuration.");
    process.exit(1);
  }

  // Warn about optional but recommended variables
  const optional = [
    "STRIPE_WEBHOOK_SECRET",
    "SENDGRID_API_KEY",
    "SENDGRID_SENDER_EMAIL",
  ];
  const missingOptional = optional.filter((key) => !process.env[key]);
  if (missingOptional.length > 0) {
    console.warn(
      "Optional environment variables not set:",
      missingOptional.join(", ")
    );
    console.warn("Some features may be disabled.");
  }

  console.log("Environment validation passed");
}

(async () => {
  // Validate environment before starting
  validateEnvironment();

  // Initialize database tables
  try {
    await initializeDatabase();
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }

  // Stripe webhook endpoint - must be registered BEFORE express.json() middleware
  // This endpoint handles webhook events from Stripe
  // Set up the webhook URL in Stripe Dashboard: https://yourdomain.com/api/stripe/webhook
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const signature = req.headers["stripe-signature"];

      if (!signature) {
        return res.status(400).json({ error: "Missing stripe-signature" });
      }

      // Check if webhook secret is configured
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.warn(
          "STRIPE_WEBHOOK_SECRET not configured - webhook signature verification skipped"
        );
        return res
          .status(200)
          .json({ received: true, warning: "Signature not verified" });
      }

      try {
        const sig = Array.isArray(signature) ? signature[0] : signature;

        if (!Buffer.isBuffer(req.body)) {
          console.error("STRIPE WEBHOOK ERROR: req.body is not a Buffer");
          return res.status(500).json({ error: "Webhook processing error" });
        }

        await WebhookHandlers.processWebhook(req.body as Buffer, sig);

        res.status(200).json({ received: true });
      } catch (error: any) {
        console.error("Webhook error:", error.message);
        res.status(400).json({ error: "Webhook processing error" });
      }
    }
  );

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );

  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        log(logLine);
      }
    });

    next();
  });

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Unhandled error:", err);
    res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  // httpServer.listen(
  //   {
  //     port,
  //     host: "0.0.0.0",
  //     reusePort: true,
  //   },
  //   () => {
  //     log(`serving on port ${port}`);
  //   },
  // );
  // const port = parseInt(process.env.PORT || "5000", 10);
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        log(`serving on port ${port} (production)`);
      }
    );
  } else {
    httpServer.listen(port, () => {
      log(`serving on http://localhost:${port} (development)`);
    });
  }
})();
