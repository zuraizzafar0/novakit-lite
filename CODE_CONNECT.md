# NovaKit Lite: design ↔ code mapping

A Code Connect-style mapping for every component and token this PR **added or changed**. For each component it gives the Figma component name, how its Figma properties map to React props, the auto-layout spec, and how to use it in code.

**How to read the property tables**
- **Figma properties:** **Variant** = variant property · **Boolean** = boolean property · **Text** = text property · **Instance** = instance-swap slot.
- **"Code only"** = behaviour Figma can't model (handlers, data). It's listed so nothing is implied that the design file can't show.
- **Spacing** uses Tailwind's 4px scale (`p-4` = 16px, `gap-3` = 12px).

---

## Variables (tokens)

Figma variables should mirror `tailwind.config.js` 1:1 and use the same names, so a designer's `neutral/600` is a developer's `text-neutral-600`.

| Figma variable | Tailwind token | Value | Status | Rule |
|---|---|---|---|---|
| `color/neutral/600` | `neutral-600` | `#666666` | **Added** | Captions and secondary text (5.74:1). |
| `color/neutral/500` | `neutral-500` | `#808080` | Restricted | 3.95:1. Large text and decoration only. |
| `color/brand/*` | `brand`, `brand-50…800`, `brand-pressed` | unchanged | — | |
| `color/accent/50`, `color/accent/600` | `accent-50`, `accent-600` | unchanged | Restricted | Late/attention states only. Never on an offer. Never white text on `accent`. |
| `color/success` | `success` | `#1E9E5A` | Restricted | Icons and ✓ marks only (3.45:1 is too low for text). |
| `motion/enter` | `animate-enter` | 220ms ease-out, fade + 8px rise | **Added** | Screen content entry. |
| `motion/pop` | `animate-pop` | 320ms ease-out, scale 0.6→1 | **Added** | Confirmations and selection marks. |

Motion is always applied with Tailwind's `motion-safe:` prefix. In Figma, prototype these as Smart Animate on the matching variant change, and note "reduced motion: none" on the component description.

---

## Added components

### Notice
`src/novakit/Notice.jsx` · Figma: **Notice**

A persistent inline message for something the user must read before acting. Unlike Toast, it never auto-dismisses.

| Figma property | Type | Values | React prop |
|---|---|---|---|
| Tone | Variant | `Info`, `Attention` | `tone="info" \| "attention"` |
| Title | Text | — | `title` |
| Show body | Boolean | — | `children` present or absent |
| Body | Text | — | `children` |

- **Auto-layout:** horizontal, padding 12, gap 12, radius `md` (12), 1px border. Icon 22px, top-aligned. The text column is vertical with gap 4.
- **Tone → tokens:**
  - Info: bg `brand/50`, border `brand/100`, icon `brand`.
  - Attention: bg `accent/50`, border `accent/100`, icon `accent/600`.
- **There is deliberately no `Danger` variant.** A decline or a late payment is not the user's error.

```jsx
<Notice tone="attention" title="We couldn't collect your repayment on Tue 1 Dec">
  Your wallet had less than the Rs 10,300 due. Nothing extra has been added.
</Notice>
```

### AmountOption
`src/novakit/AmountOption.jsx` · Figma: **AmountOption**

One selectable amount. Use it inside a container with `role="radiogroup"`.

| Figma property | Type | Values | React prop |
|---|---|---|---|
| State | Variant | `Default`, `Selected`, `Locked` | `selected`, `locked` |
| Focus | Boolean | — | Code only: `:focus-visible` ring |
| Amount | Text | e.g. `Rs 10,000` | `amount` (number, formatted by AmountText) |
| Detail | Text | e.g. `Fee Rs 300 · you repay Rs 10,300` | `detail` |
| Locked reason | Text | e.g. `Above your current limit` | `lockedReason` (shown when Locked) |
| — | Code only | — | `onSelect` |

- **Auto-layout:** horizontal, padding 16, gap 12, radius `md`, 1px border, fill width. Radio dot 20px, then a text column (Amount in `title` type, Detail in `caption`), then a "Locked" tag when locked.
- **States → tokens:**
  - Default: border `neutral/300`, bg white.
  - Selected: border `brand` plus a 1px ring, bg `brand/50`, dot fills `brand` (with `motion/pop`).
  - Locked: bg `neutral/50`, border `neutral/200`, amount in AmountText `muted`.
- **Rule:** **Locked must stay readable and say why.** It's how over-limit requests are designed out. Never pre-select the largest amount.

```jsx
<div role="radiogroup" aria-label="Advance amount">
  <AmountOption amount={10000} detail="Fee Rs 300 · you repay Rs 10,300" selected onSelect={…} />
  <AmountOption amount={15000} locked lockedReason="Above your current limit" />
</div>
```

### Timeline
`src/novakit/Timeline.jsx` · Figma: **Timeline** (made of **Timeline / Item**)

A vertical "when → what → how much" sequence for money events.

| Figma property (on Item) | Type | Values | React (`items[]` field) |
|---|---|---|---|
| Step | Variant | `Upcoming`, `Done` | `tone: "default" \| "done"` |
| Last | Boolean | — | Code only: the connector is hidden on the last item |
| When | Text | e.g. `Tue 1 Dec · your payday` | `when` |
| Title | Text | e.g. `You repay` | `title` |
| Show amount | Boolean | — | `amount` present or absent |
| Amount | Text | e.g. `Rs 10,300` | `amount` (number) |
| Show detail | Boolean | — | `detail` present or absent |
| Detail | Text | — | `detail` |

- **Auto-layout:**
  - **Timeline:** vertical, gap 0. Each Item has 16 bottom padding, except the last.
  - **Item:** horizontal, gap 12. A 20px marker, with a 2px `neutral/200` connector running down from it. The text column is vertical: When (caption, `neutral/600`) → Title + Amount (space-between) → Detail (caption).
- **Step → tokens:** Upcoming: white fill with a 2px `brand` ring. Done: `brand` fill with a white ✓ Icon.

```jsx
<Timeline items={[
  { when: "Today", title: "You get", amount: 10000, detail: "Into your NovaPay wallet" },
  { when: "Tue 1 Dec · your payday", title: "You repay", amount: 10300 },
]} />
```

### Icon
`src/novakit/Icon.jsx` · Figma: **Icon**

A 24×24 stroke icon set that replaces the starter's text glyphs (‹ ✓ ! i × ↑ ↓).

| Figma property | Type | Values | React prop |
|---|---|---|---|
| Name | Variant | `check`, `x`, `info`, `alert`, `chevron-left`, `chevron-down`, `chevron-right`, `person`, `arrow-up`, `arrow-down`, `clock`, `refresh`, `lock` | `name` |
| Size | Variant | `14`, `16`, `18`, `20`, `24`, `28` | `size` (number) |
| — | Code only | — | `label` (set when the icon carries meaning, e.g. "Money in"; otherwise hidden from screen readers) |

- **Spec:** 24px grid, 2px stroke, round caps and joins. Colour comes from the parent (`currentColor`). In Figma, bind the stroke to a variable and never hardcode it.

---

## Changed components

### Button
`src/novakit/Button.jsx` · Figma: **Button**

| Figma property | Type | Values | React prop | Change |
|---|---|---|---|---|
| Variant | Variant | `Primary`, `Secondary` | `variant` | **Secondary fixed** |
| Size | Variant | `md` (44), `lg` (56) | `size` | — |
| State | Variant | `Default`, `Pressed`, `Focus`, `Disabled`, `Loading` | `disabled`, `loading`; pressed/focus via CSS | **Focus, Loading added** |
| Label | Text | — | `children` | — |

- **Secondary:**
  - Text was `neutral/500`, so an available "Not now" looked disabled. It's now `neutral/900` on white with a `neutral/300` border.
  - Disabled is now visibly different: `neutral/100` fill, `neutral/500` text, `neutral/200` border.
- **Loading:** keeps the variant's colours (busy, not unavailable). Adds a 16px spinner before the label and ignores taps.
- **Focus:** a 2px `brand` ring with a 2px offset.
- **Pressed:** scales to 98% (motion-safe).
- **Auto-layout:** horizontal, centred, gap 8, fill width, radius `md`.

### TextField
`src/novakit/TextField.jsx` · Figma: **TextField**

| Figma property | Type | Values | React prop | Change |
|---|---|---|---|---|
| State | Variant | `Default`, `Focused`, `Disabled`, `Invalid` | `disabled`, `invalid`; focus via CSS | **Invalid added** |
| Show label | Boolean | — | `label` present or absent | **Added** |
| Label | Text | — | `label` | **Added** |
| Show prefix | Boolean | — | `prefix` present or absent | **Added** |
| Prefix | Text | e.g. `Rs` | `prefix` | **Added** |
| Show helper | Boolean | — | `helper` present or absent | **Added** |
| Helper | Text | — | `helper` | **Added** |
| Placeholder | Text | — | `placeholder` | — |

- **Invalid** uses a 2px `neutral/900` border, and the helper text turns `neutral/900` semibold. **It's not red**, because a limit (more than your wallet holds) isn't a mistake.
- **Accessibility:** the label is wired to the input, and the helper is announced with it.
- **Auto-layout:** vertical, gap 4. Label → input row (horizontal, height 48, padding 12) → helper.

### ListRow
`src/novakit/ListRow.jsx` · Figma: **ListRow**

| Figma property | Type | React prop | Change |
|---|---|---|---|
| Wrap | Boolean | `wrap` | **Added.** Text wraps instead of truncating. Use it for any cost explanation. |
| Show icon | Boolean | `icon` | — |
| Icon | Instance | `icon` | Now an **Icon** instance, not a text glyph |
| Title / Subtitle | Text | `title`, `subtitle` | Subtitle `neutral/500` → `neutral/600` |
| Trailing | Instance | `trailing` | — |

The divider `#DADADA` was a hardcoded hex. It's now `neutral/300`.

### AmountText
`src/novakit/AmountText.jsx` · Figma: **AmountText**

| Figma property | Type | Values | React prop | Change |
|---|---|---|---|---|
| Size | Variant | `Display`, `Title`, `Body` | `size` | — |
| Tone | Variant | `Default`, `Muted` | `tone` | **Added** (the colour used to be hardcoded) |
| Amount | Text | e.g. `Rs 10,300` | `amount` (number, formatted `en-PK`) | — |

Digits are now tabular, so amounts line up in columns. In Figma, turn on the font's "Tabular figures" OpenType feature.

### AppBar and Card
- **AppBar:** Back is now a 44px target with a `chevron-left` Icon (it was a "‹" glyph). The title takes focus when a screen opens. There are no new Figma properties; swap the glyph for the Icon instance.
- **Card:** the border `#E6E6E6` was a hardcoded hex and is now `neutral/200`. There are no property changes.

---

## Not mapped on purpose

| Component | Why |
|---|---|
| Toast | Not used. A message that disappears on its own is wrong for lending outcomes. See AUDIT.md #4. |
| BottomSheet | Not used. It has no scroll and no dialog semantics. See AUDIT.md #5. |
| Panel | A duplicate of Card. Card is used everywhere. See AUDIT.md #10. |
| `Checklist`, `ActionRow`, `FactList` | Flow-level patterns in `src/salary-advance/layout.jsx`, not system components yet. They're candidates for promotion once a second product needs them. |
