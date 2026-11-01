// Audit (and optionally repair) fixed-term monthly donations in Stripe.
//
// Background: donors who chose a 3-, 6- or 12-month gift were supposed to get
// an end date (`cancel_at`) on their Stripe subscription. For a period that
// step never ran, so some of these donors kept being charged after their term.
//
// Usage:
//   npx tsx script/audit-fixed-term-donations.ts
//       Report only. Changes nothing.
//   npx tsx script/audit-fixed-term-donations.ts --apply
//       Also sets the missing end date on subscriptions whose term is still
//       running, so they stop on schedule.
//   npx tsx script/audit-fixed-term-donations.ts --apply --cancel-overdue
//       Also cancels, immediately, subscriptions whose term is already over.
//
// Refunds are never issued by this script. The report lists every extra
// charge so a person can decide on and issue refunds in the Stripe dashboard.
//
// Needs STRIPE_SECRET_KEY in the environment or in .env. A CSV copy of the
// report is written to fixed-term-donations-audit.csv (it contains donor
// names and emails; do not commit it).
import * as dotenv from "dotenv";
import { writeFileSync } from "fs";
import Stripe from "stripe";
import {
  computeFixedTermCancelAt,
  ensureFixedTermCancellation,
  getFixedTermMonths,
} from "../server/fixedTermDonations";

dotenv.config();

const APPLY = process.argv.includes("--apply");
const CANCEL_OVERDUE = process.argv.includes("--cancel-overdue");
const CSV_PATH = "fixed-term-donations-audit.csv";

type Finding =
  | "OK"
  | "MISSING_END_DATE"
  | "OVERCHARGED_STILL_BILLING"
  | "OVERCHARGED_ENDED"
  | "ENDS_LATER_THAN_TERM";

interface Row {
  finding: Finding;
  action: string;
  subscriptionId: string;
  status: string;
  donorName: string;
  donorEmail: string;
  termMonths: number;
  paidCharges: number;
  extraCharges: number;
  extraAmount: string;
  extraInvoiceIds: string;
  startedOn: string;
  shouldEndOn: string;
  scheduledEndOn: string;
}

const fmtDate = (unix?: number | null) =>
  unix ? new Date(unix * 1000).toISOString().slice(0, 10) : "";
const fmtMoney = (cents: number, currency = "usd") =>
  `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("Missing STRIPE_SECRET_KEY (set it in the environment or .env).");
    process.exit(1);
  }
  if (CANCEL_OVERDUE && !APPLY) {
    console.error("--cancel-overdue only works together with --apply.");
    process.exit(1);
  }

  const stripe = new Stripe(key, { apiVersion: "2025-11-17.clover" });
  const mode = key.startsWith("sk_live") ? "LIVE" : "TEST";
  console.log(
    `Stripe ${mode} mode. ${APPLY ? "APPLY: changes will be made." : "Report only: no changes."}\n`,
  );

  const rows: Row[] = [];

  for await (const sub of stripe.subscriptions.list({
    status: "all",
    limit: 100,
    expand: ["data.customer"],
  })) {
    const months = getFixedTermMonths(sub.metadata?.duration);
    if (!months) continue;

    const customer = sub.customer as Stripe.Customer | Stripe.DeletedCustomer;
    const donorEmail = ("email" in customer && customer.email) || "";
    const donorName =
      sub.metadata?.donor_name || ("name" in customer && customer.name) || "";

    const paid: Stripe.Invoice[] = [];
    for await (const inv of stripe.invoices.list({
      subscription: sub.id,
      status: "paid",
      limit: 100,
    })) {
      if (inv.amount_paid > 0) paid.push(inv);
    }
    paid.sort((a, b) => a.created - b.created);
    const extra = paid.slice(months);
    const extraCents = extra.reduce((s, i) => s + i.amount_paid, 0);
    const currency = paid[0]?.currency || "usd";

    const shouldEnd = computeFixedTermCancelAt(sub)!;
    const scheduledEnd = sub.cancel_at;
    const isLive = ["active", "trialing", "past_due"].includes(sub.status);

    let finding: Finding = "OK";
    if (extra.length > 0) {
      finding = isLive ? "OVERCHARGED_STILL_BILLING" : "OVERCHARGED_ENDED";
    } else if (isLive && !sub.cancel_at && !sub.cancel_at_period_end) {
      finding = "MISSING_END_DATE";
    } else if (isLive && sub.cancel_at && sub.cancel_at > shouldEnd) {
      finding = "ENDS_LATER_THAN_TERM";
    }

    let action = "none";
    if (APPLY && finding === "MISSING_END_DATE") {
      const result = await ensureFixedTermCancellation(stripe, sub);
      action =
        result.action === "set_cancel_at"
          ? `end date set to ${fmtDate(result.cancelAt)}`
          : `not changed (${result.action})`;
    } else if (finding === "OVERCHARGED_STILL_BILLING") {
      if (APPLY && CANCEL_OVERDUE) {
        await stripe.subscriptions.cancel(sub.id, { prorate: false });
        action = "cancelled now; refund still to decide";
      } else {
        action = "needs cancelling (run with --apply --cancel-overdue) and refund decision";
      }
    } else if (finding === "OVERCHARGED_ENDED") {
      action = "refund decision needed";
    } else if (finding === "ENDS_LATER_THAN_TERM") {
      action = "review by hand";
    }

    rows.push({
      finding,
      action,
      subscriptionId: sub.id,
      status: sub.status,
      donorName,
      donorEmail,
      termMonths: months,
      paidCharges: paid.length,
      extraCharges: extra.length,
      extraAmount: extra.length ? fmtMoney(extraCents, currency) : "",
      extraInvoiceIds: extra.map((i) => i.id).join(" "),
      startedOn: fmtDate(sub.start_date),
      shouldEndOn: fmtDate(shouldEnd),
      scheduledEndOn: fmtDate(scheduledEnd),
    });
  }

  // ── Report ────────────────────────────────────────────────────────────────
  const by = (f: Finding) => rows.filter((r) => r.finding === f);
  console.log(`Fixed-term subscriptions found: ${rows.length}`);
  console.log(`  OK:                         ${by("OK").length}`);
  console.log(`  Missing end date:           ${by("MISSING_END_DATE").length}`);
  console.log(`  Overcharged, still billing: ${by("OVERCHARGED_STILL_BILLING").length}`);
  console.log(`  Overcharged, already ended: ${by("OVERCHARGED_ENDED").length}`);
  console.log(`  Ends later than term:       ${by("ENDS_LATER_THAN_TERM").length}\n`);

  const problems = rows.filter((r) => r.finding !== "OK");
  for (const r of problems) {
    console.log(
      `${r.finding}  ${r.subscriptionId}  ${r.donorName} <${r.donorEmail}>  ` +
        `${r.termMonths}-month term, ${r.paidCharges} paid` +
        (r.extraCharges ? `, ${r.extraCharges} extra (${r.extraAmount})` : "") +
        `  -> ${r.action}`,
    );
  }

  const headers = Object.keys(rows[0] || { finding: "" }) as (keyof Row)[];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  writeFileSync(
    CSV_PATH,
    [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n"),
  );
  console.log(`\nFull report written to ${CSV_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
