# NovaKit Lite audit

What I found in the starter design system before building the salary-advance flow, and what I did about each item.

Contrast ratios are WCAG 2.x, measured against the token hex values. AA needs **4.5:1** for normal text and **3:1** for large text and UI parts.

**Action key:** **Fixed** = changed in this PR · **Avoided** = not used in the flow, left as-is · **Noted** = out of scope, recorded for the system team

---

## 1. Would hurt the borrower if reused as-is

| # | Finding | Evidence | Action |
|---|---|---|---|
| 1 | **The secondary button looks disabled.** Its text is `neutral-500`, and the disabled state only changes the text to `neutral-300` with the same border, so enabled and disabled look nearly the same. On an Accept screen, the way out would look greyed out, which is a pressure pattern. | `neutral-500` on white = 3.95:1 (fails AA). `neutral-300` on white = 1.41:1. [Button.jsx](src/novakit/Button.jsx) | **Fixed.** Secondary text is now `neutral-900`. Disabled now uses a filled `neutral-100` background, so it looks clearly different. |
| 2 | **There's no error, warning or info colour.** `success` is the only status colour, so bad news would end up in hardcoded red or misused amber. | [tailwind.config.js](tailwind.config.js) | Declines use neutral surfaces and the brand tint, not red. A declined advance is not an error by the user. The new `Notice` component uses existing tokens for tone. A `danger` token should exist for real errors, but this flow doesn't need one (**Noted**). |
| 3 | **Amber `accent` fails contrast with white, and the config invites "expressive" use.** In a market with a history of predatory lending apps, hyping an offer is the wrong move. | White on `accent` = 2.15:1. `accent-600` on `accent-50` = 4.71:1. | Amber is used only for the late-repayment notice (`accent-50` background, `accent-600` icon). It never appears on the offer itself. |
| 4 | **Toast is the only feedback component, and it's always green with a ✓.** It disappears on its own and has no `role="status"` or `aria-live`. Lending outcomes (sent, declined, late) must not vanish. | White on `success` = 3.45:1 at 15px (fails AA). [Toast.jsx](src/novakit/Toast.jsx) | **Avoided.** Outcomes get full screens or an inline `Notice`. The toast is no longer used. |
| 5 | **BottomSheet can't hold real terms.** It has no maximum height or scrolling, no `role="dialog"` or `aria-modal`, no title, no focus trap and no Escape to close. Tapping the backdrop dismisses it. | [BottomSheet.jsx](src/novakit/BottomSheet.jsx) | **Avoided.** The terms sit on the decision screen itself and aren't hidden in a sheet. |
| 6 | **Caption and helper text fails contrast.** `neutral-500` is the only grey used for captions, subtitles and placeholders, so the fine print (fee, date) would be the least readable text. | `neutral-500` on white = 3.95:1 | **Fixed.** Added `neutral-600` (`#666666`, 5.74:1). ListRow subtitles and all new secondary text use it. |
| 7 | **AmountText hardcodes `text-neutral-900` and can't show money in vs. out.** A `className` colour can't reliably override it, and credits and debits look the same in the feed. | [AmountText.jsx](src/novakit/AmountText.jsx) | **Fixed (partly).** Added `tone="muted"` for unavailable amounts. Showing direction is **Noted**. |
| 8 | **TextField has no label, helper text or error state.** | [TextField.jsx](src/novakit/TextField.jsx) | **Fixed.** Over-limit is still designed out (no typed loan amount). The late flow's "pay some now" needs a typed amount, so TextField gained `label`, `helper` and `invalid`. Invalid uses a heavier border and plain words, not red. |
| 9 | **Button has no loading state and no visible keyboard focus.** A slow Accept invites a double submit. | [Button.jsx](src/novakit/Button.jsx) | **Fixed.** Added a `loading` prop (spinner, `aria-busy`, ignores taps) and a `focus-visible` ring. |

## 2. Inconsistencies

| # | Finding | Action |
|---|---|---|
| 10 | **Card and Panel are duplicates.** They differ only in border colour (Card uses a hardcoded `#E6E6E6`, Panel uses `neutral-300`). | Use Card only. Merging them is **Noted**: changing Panel's API is out of scope. |
| 11 | **Some colours are hardcoded instead of tokens:** `#E6E6E6` (Card), `#DADADA` (ListRow), `bg-black/40` (BottomSheet), and `#1a1a1a` / `#e9eaee` (index.css). The first two match no neutral step. | **Fixed** in Card (`neutral-200`) and ListRow (`neutral-300`). The others are **Noted**. |
| 12 | **The colour scales have gaps and mixed naming.** Brand has no 300, 500–700 or 900 and includes a state called `pressed`. Accent jumps from 100 to 600. Neutral has no 400, 600 or 800. | Added only `neutral-600`, because the flow needs it. A full ramp rework is **Noted**. |
| 13 | **There's only one elevation token** (`shadow-card`). | **Noted.** |
| 14 | **ListRow is named "ListRow / TransactionRow"** but has no tap behaviour, and it truncates titles. Truncating text about money is risky. | Reused for the cost breakdown, where the labels are short. **Noted.** |
| 15 | **AppBar's back button is a "‹" text character** at body size. | **Fixed.** It's now a 44px target with an SVG chevron. All text glyphs (✓ ! i × ↑ ↓) were replaced with a new `Icon` set. |

## 3. Missing

- Urdu, right-to-left layout and localisation. The page is `lang="en"` only, for a Pakistan-market product.
- Tertiary or link buttons and a destructive button variant.
- Status tokens for repayment states (on time, late, default).
- A Figma or Code Connect mapping. Tokens exist only in Tailwind config.
