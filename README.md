# NovaKit Lite

A small slice of **NovaPay's coded design system** — the starter for the AI-First Product Designer case study. It gives you design tokens, a handful of components, and a running mobile-framed app to build on.

> Read this and the components carefully — but treat the system as a **starting point, not gospel**. Real design systems are messier than their docs suggest: some things are missing, some are inconsistent, and some shouldn't be reused as-is. Part of your job is to notice that.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints. The app renders inside a ~390px mobile frame — keep your work mobile-first.

```bash
npm run build   # production build (also a quick way to check nothing is broken)
```

## What's in here

```
src/
  novakit/            # the design system — build from these
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
  App.jsx             # starter home screen (your canvas)
  index.css           # Tailwind entry
tailwind.config.js    # design tokens (colors, radius, type scale, elevation)
```

Tokens live in `tailwind.config.js` (e.g. `bg-brand`, `bg-brand-50`, `text-accent-600`, `text-neutral-700`, `rounded-md`, `shadow-card`, `text-title`). The palette is intentionally generous — a full brand (indigo) ramp, a warm amber accent, and a layered neutral scale — so you have room to make real aesthetic choices. Use it with restraint. Build new work from tokens and existing components; extend the system only where you genuinely need to, and keep design and code in sync.

## Your task (summary)

Design and build the **first-time salary-advance experience** — offer → terms/total cost → accept — plus at least one path where the news isn't good or simple (declined/ineligible, over-limit, or a late/missed repayment). See the full brief and `PRODUCT_REFERENCE.md` for the product details (tiers, fees, decline reasons, repayment states).

## How to submit

Share a runnable prototype: a **pull request** against this repo is preferred (work on a branch or fork), but a deployed link or repo is fine too — as long as it runs. Add your short writeup (Google Doc or PDF) and your AI process (prompt log or a 5–10 min screen recording, including one AI output you rejected and why). Don't lose a weekend over this — it's sized for about 6 hours.
