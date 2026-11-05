import AmountText from "./AmountText.jsx";

/**
 * AmountOption — NovaKit Lite (added)
 * One selectable amount inside a group with role="radiogroup".
 * States: default, selected, locked, focus-visible
 *
 * Locked options stay readable (not greyed to invisibility) and say why
 * they are locked, so an over-limit amount can never be requested.
 */
export default function AmountOption({
  amount,
  detail,
  selected = false,
  locked = false,
  lockedReason,
  onSelect,
}) {
  const state = locked
    ? "bg-neutral-50 border-neutral-200 cursor-not-allowed"
    : selected
      ? "bg-brand-50 border-brand ring-1 ring-brand"
      : "bg-white border-neutral-300 active:bg-neutral-50";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={locked}
      onClick={locked ? undefined : onSelect}
      className={
        "w-full flex items-center gap-3 rounded-md border p-4 text-left transition-colors " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 " +
        state
      }
    >
      <span
        aria-hidden="true"
        className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
          selected ? "border-brand" : "border-neutral-300"
        }`}
      >
        {selected ? <span className="h-2.5 w-2.5 rounded-full bg-brand motion-safe:animate-pop" /> : null}
      </span>
      <span className="flex-1 min-w-0">
        <AmountText amount={amount} size="title" tone={locked ? "muted" : "default"} className="block" />
        <span className="block text-caption text-neutral-600 mt-0.5">
          {locked ? lockedReason : detail}
        </span>
      </span>
      {locked ? (
        <span className="shrink-0 text-caption text-neutral-600 border border-neutral-300 rounded-sm px-2 py-0.5">
          Locked
        </span>
      ) : null}
    </button>
  );
}
