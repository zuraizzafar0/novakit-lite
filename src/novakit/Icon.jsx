/**
 * Icon — NovaKit Lite (added)
 * A small, consistent stroke icon set, replacing the text glyphs
 * (‹ ✓ ! i × ↑ ↓) the starter used. Glyphs render differently per
 * platform and font, which reads as unfinished in a money flow.
 *
 * Icons are decorative by default (aria-hidden). Pass `label` when the
 * icon carries meaning on its own.
 */
const PATHS = {
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6.5 6.5l11 11M17.5 6.5l-11 11",
  info: "M12 11v6M12 7.5v.01",
  alert: "M12 7v6.5M12 17v.01",
  "chevron-left": "M15 5l-7 7 7 7",
  "arrow-up": "M12 19V5M6 11l6-6 6 6",
  "arrow-down": "M12 5v14M6 13l6 6 6-6",
  refresh: "M19 12a7 7 0 1 1-2.05-4.95M19 4.5V9h-4.5",
  clock: "M12 7v5l3 2",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
};

const CIRCLED = new Set(["info", "alert", "clock"]);

export default function Icon({ name, size = 20, label, className = "" }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      className={`shrink-0 ${className}`}
    >
      {CIRCLED.has(name) ? <circle cx="12" cy="12" r="9" /> : null}
      <path d={d} />
    </svg>
  );
}
