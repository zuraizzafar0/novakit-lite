/**
 * Salary advance — product rules and prototype scenarios.
 * Rules come from PRODUCT_REFERENCE.md. Anything marked ASSUMPTION is not in
 * the reference and is listed in the written submission.
 */

export const TIERS = [5000, 10000, 15000];
export const FEE_RATE = 0.03; // flat, one-time, on the DISBURSED amount

export const feeFor = (amount) => Math.round(amount * FEE_RATE);
export const repayFor = (amount) => amount + feeFor(amount);

// The prototype's "today" is 5 Nov 2026. The next payday is known at offer time.
export const REPAYMENT_DATE = {
  long: "Tuesday, 1 December 2026",
  short: "1 Dec 2026",
};

// ASSUMPTION: after a credit_score or "other" decline, the user can check again after 30 days.
export const RETRY_DATE = "5 Dec 2026";

export const STARTING_BALANCE = 4250;

export const SCENARIOS = [
  {
    id: "approved",
    label: "Approved",
    description: "Limit Rs 10,000. Rs 15,000 is shown as locked, so over-limit can't happen.",
    limit: 10000,
  },
  {
    id: "haircut",
    label: "Approved, amount reduced",
    description: "Limit Rs 15,000. Choose Rs 15,000: final checks reduce it to Rs 10,000.",
    limit: 15000,
    haircutCap: 10000,
  },
  {
    id: "income_unverified",
    label: "Declined: income not verified",
    description: "Honest reason with a clear next step (upload a payslip).",
    decline: "income_unverified",
  },
  {
    id: "credit_score",
    label: "Declined: credit history",
    description: "Reason given, with a date to check again.",
    decline: "credit_score",
  },
  {
    id: "other",
    label: "Declined: other",
    description: "The hard case: no specific reason can be shared.",
    decline: "other",
  },
];

/** Amount actually sent after final risk checks (the "haircut"). */
export function disbursedFor(scenario, requested) {
  return scenario.haircutCap ? Math.min(requested, scenario.haircutCap) : requested;
}
