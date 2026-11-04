# NovaKit Lite: Salary Advance Case Study

A coded, clickable, mobile-viewport prototype of NovaPay's **first-time salary-advance experience**, built on top of NovaKit Lite (NovaPay's starter design system).

This branch (`salary-advance-trust-pass`) adds the salary-advance flow and makes the smallest set of changes to the design system that the flow needs. The untouched starter is preserved as the first commit on `main`, so the pull request diff shows exactly what changed.

> **Status: work in progress.** Sections marked _TBD_ get filled in as the work lands.

---

## Run it

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # start the local dev server, then open the URL it prints
npm run build      # production build (a quick check that nothing is broken)
npm run preview    # serve the production build locally
```

The app renders inside a ~390px mobile frame. Open it on desktop, or use your browser's device toolbar for a real phone viewport.

**Live link:** _TBD_

---

## What to review

The brief asks for depth over breadth. It covers three moments:

| Moment | Where to find it in the prototype | Code |
|---|---|---|
| 1. Terms and total-cost disclosure | _TBD_ | _TBD_ |
| 2. The accept decision | _TBD_ | _TBD_ |
| 3. A not-good path | _TBD_ | _TBD_ |

### Scenarios

_TBD._ This section will list how to get to each state (for example, an approved offer, a haircut, a decline, or a late repayment), so a reviewer can see every edge state without guessing.

---

## Product rules this prototype follows

From [PRODUCT_REFERENCE.md](PRODUCT_REFERENCE.md):

- **Tiers:** Rs 5,000 / 10,000 / 15,000. The offered limit is the highest tier the user qualifies for. They can take any tier up to that limit, and over-limit requests are not allowed.
- **Fee:** a flat 3% of the **disbursed** amount, charged once. It is not monthly interest. Example: Rs 10,000 → repay Rs 10,300.
- **Repayment:** in full on the next payday (about 2–4 weeks out). The exact date is known at offer time.
- **Disclosure:** the total cost (amount + fee) and the repayment date must be clear at the moment of decision.
- **Haircut:** the disbursed amount may be lower than the amount requested after risk checks.
- **Decline reasons (internal):** `credit_score`, `income_unverified`, `other`.
- **Repayment outcomes:** `on_time`, `late` (days late tracked), `default` (30+ days past due).

Assumptions beyond these rules are listed in the written submission.

---

## Changes to NovaKit Lite

Every token or component that was added or modified, with a one-line rationale.

| Change | Type | Why | File |
|---|---|---|---|
| _TBD_ | | | |

### Issues found in the starter system

Anything in NovaKit Lite that is wrong, inconsistent, or missing, and what was done about it.

_TBD_

---

## Project structure

```
src/
  novakit/            # the design system
    Button.jsx        # primary | secondary · md | lg · default/pressed/disabled
    TextField.jsx     # default · focused · disabled
    Card.jsx          # surface container
    Panel.jsx         # surface container
    ListRow.jsx       # icon · title/subtitle · trailing amount
    AppBar.jsx        # title + optional back
    BottomSheet.jsx   # modal sheet
    Toast.jsx         # transient confirmation
    AmountText.jsx    # formats PKR amounts
    index.js          # barrel export -> import { Button } from "./novakit"
  App.jsx             # app shell and home screen; the salary-advance flow starts from "See your offer"
  main.jsx            # React entry point
  index.css           # Tailwind entry
tailwind.config.js    # design tokens: colors, radius, type scale, elevation
PRODUCT_REFERENCE.md  # product rules for the salary advance
```

Design tokens live in `tailwind.config.js` and are used as Tailwind classes, such as `bg-brand`, `text-neutral-700`, `rounded-md`, `shadow-card`, and `text-title`. New screens are built from these tokens and the components in `src/novakit/`.

---

## Submission materials

| Item | Link |
|---|---|
| Pull request | _TBD_ |
| Live prototype | _TBD_ |
| Written submission | _TBD_ |
| Figma component sheet | _TBD_ |
| AI process log / recording | _TBD_ |

---

## Tech

React 18 · Vite 5 · Tailwind CSS 3. No routing library or backend. All data is mocked in the client.
