/**
 * AmountText — NovaKit Lite
 * Formats an integer PKR amount, e.g. 10000 -> "Rs 10,000".
 */
export default function AmountText({ amount, size = "title", className = "" }) {
  const sizes = {
    display: "text-display",
    title: "text-title",
    body: "text-body",
  };
  const formatted = new Intl.NumberFormat("en-PK").format(amount ?? 0);
  return (
    <span className={`${sizes[size] || sizes.title} text-neutral-900 ${className}`}>
      Rs {formatted}
    </span>
  );
}
