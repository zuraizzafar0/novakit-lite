/**
 * Salary advance — product rules and prototype scenarios.
 * Rules come from PRODUCT_REFERENCE.md. Anything marked ASSUMPTION is not in
 * the reference and is listed in the written submission.
 */

export const TIERS = [5000, 10000, 15000];
export const FEE_RATE = 0.03; // flat, one-time, on the DISBURSED amount

export const feeFor = (amount) => Math.round(amount * FEE_RATE);
export const repayFor = (amount) => amount + feeFor(amount);
export const fmt = (n) => new Intl.NumberFormat("en-PK").format(n);

// The prototype's "today" is 5 Nov 2026. The next payday is known at offer time.
export const REPAYMENT_DATE = {
  long: "Tuesday, 1 December 2026",
  short: "1 Dec 2026",
  day: "Tue 1 Dec",
};

// ASSUMPTION: after a credit_score or "other" decline, the user can check again after 30 days.
export const RETRY_DATE = "5 Dec 2026";

// ASSUMPTION: a late borrower can move the date once, free, to any of these (all < 30 days late).
export const NEW_DATE_OPTIONS = ["7 Dec 2026", "14 Dec 2026", "21 Dec 2026"];

export const STARTING_BALANCE = 4250;

// The record of what the user agreed to, shown after accepting.
export const AGREEMENT = { date: "5 Nov 2026", smsTo: "0300 ••• 4567" };

/**
 * Eligibility checklist shown on a decline (benchmark: X "Check back later").
 * ASSUMPTION: these are the user-facing criteria; the real list needs Risk/Legal sign-off.
 */
export const CHECKLIST = {
  income_unverified: [
    { label: "NovaPay account in good standing", ok: true },
    { label: "No advance currently unpaid", ok: true },
    { label: "Regular salary confirmed", ok: false },
  ],
  credit_score: [
    { label: "NovaPay account in good standing", ok: true },
    { label: "Regular salary confirmed", ok: true },
    { label: "Credit history check", ok: false },
  ],
};

export const SCENARIOS = [
  // ---- Applying for a first advance
  {
    id: "approved",
    group: "Applying",
    label: "Approved",
    description: "Limit Rs 10,000. Rs 15,000 is locked, with what would unlock it.",
    limit: 10000,
  },
  {
    id: "income_unverified",
    group: "Applying",
    label: "Declined: income not verified",
    description: "Checklist shows what's missing, with a next step (upload a payslip).",
    decline: "income_unverified",
  },
  {
    id: "credit_score",
    group: "Applying",
    label: "Declined: credit history",
    description: "Reason given, a date to check again, and a reminder.",
    decline: "credit_score",
  },
  {
    id: "other",
    group: "Applying",
    label: "Declined: other",
    description: "The hard case: no specific reason can be shared.",
    decline: "other",
  },

  // ---- Repaying an active advance of Rs 10,000 (Rs 10,300 due)
  {
    id: "due_soon",
    group: "Repaying",
    label: "Reminder: due in 3 days",
    description: "Prototype date: 28 Nov. Calm reminder; nothing to do.",
    repayment: { state: "due_soon", wallet: 2650 },
  },
  {
    id: "due_today",
    group: "Repaying",
    label: "Reminder: due today",
    description: "Prototype date: 1 Dec. Collected once salary lands.",
    repayment: { state: "due_today", wallet: 2650 },
  },
  {
    id: "late",
    group: "Repaying",
    label: "Late: payment didn't go through",
    description: "Prototype date: 4 Dec. Wallet was short. Shows the ways forward.",
    repayment: { state: "late", wallet: 6200, daysLate: 3 },
  },
];

export const ADVANCE_AMOUNT_FOR_REPAY_SCENARIOS = 10000;

/**
 * Amount actually sent after the final check.
 * Risk checks run BEFORE amounts are shown (ASSUMPTION), so the offered tiers
 * are real and a reduction ("haircut") should be rare. If it does happen
 * (something changed between offer and accept), we drop to the next tier down
 * and the user decides again on AmountChangedScreen.
 */
export function disbursedFor(requested, haircut = false) {
  if (!haircut || requested == null) return requested;
  const lower = TIERS.filter((t) => t < requested);
  return lower.length ? lower[lower.length - 1] : requested;
}

/**
 * What unlocks a higher limit. ASSUMPTION: real criteria need Risk sign-off.
 * Shown as plain facts, never as a "boost" (benchmark: Cleo, what not to do).
 */
export const UNLOCK_CHECKLIST = [
  { label: "Regular salary confirmed", ok: true },
  { label: "Repay your first advance on time", ok: false, hint: "Limits are reviewed after each on-time repayment" },
  { label: "3 months of salary paid into NovaPay", ok: false, hint: "You have 1 month so far" },
];
