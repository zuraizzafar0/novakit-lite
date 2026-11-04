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
| 1. Terms and total-cost disclosure | Pick an amount → **Review your advance**. Every amount option also shows its fee and total. | [OfferScreen.jsx](src/salary-advance/OfferScreen.jsx), [ReviewScreen.jsx](src/salary-advance/ReviewScreen.jsx) |
| 2. The accept decision | Same screen. The total and date sit directly above **Accept**, with an equally readable **Not now**. | [ReviewScreen.jsx](src/salary-advance/ReviewScreen.jsx) |
| 3. A not-good path: **declined** | Choose a "Declined" scenario, then tap **Check what I can get**. | [OutcomeScreens.jsx](src/salary-advance/OutcomeScreens.jsx) |
| 3b. A not-good path: **repayment due / late** | Choose a "Repaying" scenario. The reminder appears as a notification, and the late state offers to pay part now or move the date. | [RepaymentScreens.jsx](src/salary-advance/RepaymentScreens.jsx) |

### Scenarios

Use the **Prototype scenario** panel next to the phone to simulate what NovaPay's checks return. Changing the scenario restarts from home.

| Scenario | What to look at |
|---|---|
| Approved | Limit Rs 10,000. Rs 15,000 is locked and says why, so an over-limit request can't happen. Go through Accept to see the done screen and the updated home. |
| Approved, amount reduced | Choose **Rs 15,000**. Final checks reduce it to Rs 10,000, and the review screen discloses this before Accept, with the fee recalculated. |
| Declined: income not verified | Real reason plus a next step (upload a payslip). Home then shows "we need to confirm your salary". |
| Declined: credit history | Reason given, plus a date to check again. |
| Declined: other | The hard case: no specific reason can be shared, but there's still a date, a reminder and a way to ask for human review. |
| Reminder: due in 3 days / due today | The reminder notification copy, and a calm repayment card with the amount and date first and no alarm styling. |
| Late: payment didn't go through | Amber, not red. One sentence on what happened, no late fee, and two ways forward: pay an amount you choose (each suggestion shows what it leaves in your wallet), or move the date once for free. |

**Deep links:** add `?scenario=<id>&screen=<screen>` to the URL, for example `?scenario=haircut&screen=review`, `?scenario=other&screen=declined` or `?scenario=late&screen=repayment`.

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
| `neutral-600` (`#666666`) | Token, added | `neutral-500` fails AA for caption text (3.95:1). This reaches 5.74:1. | [tailwind.config.js](tailwind.config.js) |
| Button `secondary` | Component, fixed | The text looked disabled, which visually pressures users toward Accept. | [Button.jsx](src/novakit/Button.jsx) |
| Button `loading` + focus ring | Component, extended | Prevents a double Accept. Keyboard focus is now visible. | [Button.jsx](src/novakit/Button.jsx) |
| Card, ListRow borders | Component, fixed | Hardcoded hex values replaced with neutral tokens. ListRow subtitles use `neutral-600`. | [Card.jsx](src/novakit/Card.jsx), [ListRow.jsx](src/novakit/ListRow.jsx) |
| AmountText `tone` | Component, extended | `muted` tone for locked amounts. The colour used to be hardcoded. | [AmountText.jsx](src/novakit/AmountText.jsx) |
| `Notice` | Component, added | Persistent inline message (info / attention) for things the user must read before deciding, such as a reduced amount. Toast is wrong for this. | [Notice.jsx](src/novakit/Notice.jsx) |
| `Timeline` | Component, added | A vertical "when → what → how much" sequence for terms, confirmation and repayment. | [Timeline.jsx](src/novakit/Timeline.jsx) |
| TextField `label` / `helper` / `invalid` | Component, extended | Needed to type a partial repayment amount. It had no label or error state. Invalid isn't red, because a limit isn't a mistake. | [TextField.jsx](src/novakit/TextField.jsx) |
| ListRow `wrap` | Component, extended | Cost explanations must never be cut off. Truncation stays the default for transaction lists. | [ListRow.jsx](src/novakit/ListRow.jsx) |
| `AmountOption` | Component, added | Selectable amount with a locked state that explains why, so over-limit is designed out. | [AmountOption.jsx](src/novakit/AmountOption.jsx) |

### Issues found in the starter system

Anything in NovaKit Lite that is wrong, inconsistent, or missing, and what was done about it. See [AUDIT.md](AUDIT.md).

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
    Notice.jsx        # (added) inline info / attention message
    AmountOption.jsx  # (added) selectable amount · default/selected/locked
  salary-advance/     # the flow: data/rules, screens, layout helpers
  prototype/          # prototype-only scenario switcher (not product UI)
  App.jsx             # mobile frame + screen state machine
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
