/**
 * Button — NovaKit Lite
 * Variants: primary | secondary
 * Sizes: md | lg
 * States: default, pressed (active), focus-visible, disabled, loading
 *
 * `loading` keeps the button's colours (it is busy, not unavailable),
 * shows a spinner, sets aria-busy, and ignores taps to prevent double submits.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors select-none w-full " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

  const sizes = {
    md: "h-11 px-4 text-body",
    lg: "h-14 px-5 text-title",
  };

  const variants = {
    primary:
      "bg-brand text-white active:bg-brand-pressed disabled:bg-neutral-300 disabled:text-neutral-500",
    // Was text-neutral-500 (3.95:1), which made an available choice look disabled.
    secondary:
      "bg-white text-neutral-900 border border-neutral-300 active:bg-neutral-100 " +
      "disabled:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-200",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={loading ? undefined : onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${loading ? "cursor-progress" : ""} ${className}`}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      ) : null}
      {children}
    </button>
  );
}
