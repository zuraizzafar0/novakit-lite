/**
 * TextField — NovaKit Lite
 * States: default, focused, disabled
 */
export default function TextField({
  placeholder = "",
  value,
  onChange,
  disabled = false,
  inputMode,
  type = "text",
  className = "",
}) {
  return (
    <input
      type={type}
      inputMode={inputMode}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={
        "w-full h-12 px-3 rounded-md bg-white text-body text-neutral-900 " +
        "border border-neutral-300 placeholder:text-neutral-500 " +
        "focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 " +
        "disabled:bg-neutral-100 disabled:text-neutral-500 " +
        className
      }
    />
  );
}
