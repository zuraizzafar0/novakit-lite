/**
 * AmountText — NovaKit Lite
 * Formats an integer PKR amount, e.g. 10000 -> "Rs 10,000".
 * Tones: default | muted (for amounts that are shown but not available)
 */
export default function AmountText({ amount, size = "title", tone = "default", className = "" }) {
  const sizes = {
    display: "text-display",
    title: "text-title",
    body: "text-body",
  };
  const tones = {
    default: "text-neutral-900",
    muted: "text-neutral-600",
  };
  const formatted = new Intl.NumberFormat("en-PK").format(amount ?? 0);
  return (
    <span className={`${sizes[size] || sizes.title} ${tones[tone] || tones.default} ${className}`}>
      Rs {formatted}
    </span>
  );
}
