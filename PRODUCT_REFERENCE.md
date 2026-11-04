# NovaPay Salary Advance — Product Reference

A one-page reference so you can focus on design, not on inventing a lending model. Treat these as the rules of the product. Where something isn't specified, make a reasonable assumption and state it.

> NovaPay is a fictional digital wallet used for this exercise. The numbers below are illustrative but internally consistent — design as if they're real.

## What it is

A short-term **salary advance**: a small amount of cash to help a salaried user bridge to their next payday. Short tenor, fixed fee, single repayment pulled on payday.

## Loan tiers

| Tier | Amount (PKR) |
|------|--------------|
| 1 | 5,000 |
| 2 | 10,000 |
| 3 | 15,000 |

A user's offered limit is the highest tier they qualify for. They can take any amount up to that limit (in the tiers above). Requesting more than the offered limit is **not allowed** — that's one of the hard moments you'll design for.

## Cost & repayment

- **Fixed fee** per advance: **3% of the amount disbursed**, charged once (not monthly interest). Example: a Rs 10,000 advance costs Rs 300, so the user repays **Rs 10,300**.
- **Tenor:** repaid in full on the user's **next payday** (assume ~2–4 weeks out; the exact date is known at offer time).
- **Total cost of credit** (amount + fee) and the **repayment date** must be clear at the moment of decision. (See "Trust rules.")
- A "haircut" can apply: the amount actually disbursed may be lower than requested if risk checks warrant it.

## Decisions

- **Approved** — an offer is available; the user can accept.
- **Declined** — no offer. Reasons we surface internally: `credit_score`, `income_unverified`, `other`. How (and how honestly) a decline is communicated to the user is a design decision.
- Income may or may not be **verified** at application (bank statement / payslip). Unverified income is a common decline reason.

## Repayment outcomes (post-disbursement)

- **on_time** — repaid on or before the due date.
- **late** — repaid after the due date (we track days late).
- **default** — 30+ days past due. A user with an active late/overdue advance is a sensitive state to design for (reminders, what they see, tone).

## Trust matters most here

NovaPay operates in a market where predatory digital-lending apps have harmed users and drawn regulatory action — and lending is the highest-trust moment in the whole app. How you earn (or lose) that trust is the heart of this exercise: what you show, when you show it, and how you handle the moments that don't go well. We're deliberately not giving you a checklist — those calls are yours to make and defend.

## Glossary (mirrors the dataset fields, for context)

`applied_amount` · `disbursed_amount` (may be < applied) · `decision` (approved/denied) · `denial_reason` · `repayment_status` (on_time/late/default) · `days_late` · `income_verified` · `income_source` (salaried/freelance).
