# AGENTS.md

## Cursor Cloud specific instructions

This is "The Klara Project" — a single full-stack app (one service): an Express backend that also serves the React + Vite frontend on the **same port**. Data is stored in PostgreSQL via Drizzle ORM. Stripe, SendGrid, HubSpot, and reCAPTCHA are optional integrations.

### Running the app
- Dev: `npm run dev` (serves API + Vite frontend together on `http://localhost:$PORT`).
- Build: `npm run build` (Vite client build + esbuild server bundle to `dist/`). Prod: `npm run start`.
- Type-check: `npm run check` (see caveat below).
- The port comes from `PORT` (defaults to `3000` in dev). The `.replit` legacy note about "port 5000" is outdated — dev listens on `PORT`/`3000`.

### Environment (`.env`, gitignored)
- Startup **hard-requires** `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` — the process calls `process.exit(1)` if any are missing (`server/index.ts` `validateEnvironment`). `server/db.ts` loads `.env` via `dotenv` at import time.
- For local dev, placeholder Stripe keys (e.g. `sk_test_placeholder` / `pk_test_placeholder`) are enough to boot and to exercise non-Stripe flows (donor send-code, newsletter, volunteer, experience, inquiry). Any flow that actually calls Stripe (checkout creation, donor verify-code, donations dashboard, portal) needs **real Stripe test keys**.
- Optional keys (`STRIPE_WEBHOOK_SECRET`, `SENDGRID_*`, `HUBSPOT_ACCESS_TOKEN`, `RECAPTCHA_*`) are absent by default; the code wraps these integrations in try/catch and logs a warning, so requests still return success without them. `.env.example` documents all of them.

### PostgreSQL (must be running before `npm run dev`)
- Local server used during setup: DB `klara`, role `klara` / password `klara`, so `DATABASE_URL=postgresql://klara:klara@127.0.0.1:5432/klara`.
- Start the cluster with `sudo pg_ctlcluster 16 main start` (the update script does NOT start Postgres). Table creation is automatic: `initializeDatabase()` runs `CREATE TABLE IF NOT EXISTS` on boot, so `npm run db:push` (drizzle-kit) is optional.

### Caveats / gotchas
- `npm run check` (`tsc`) currently reports **pre-existing** type errors (missing type declarations for image imports, `import.meta.env`, and null types in `server/webhookHandlers.ts`). These do NOT affect running or building — dev uses `tsx` and the build uses Vite + esbuild, neither of which type-checks. Do not treat these as regressions from setup.
- Reinstalling deps / editing server files hot-reloads via `tsx`; changing `.env` requires restarting `npm run dev`.
