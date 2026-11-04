import { useId } from "react";

/**
 * TextField — NovaKit Lite
 * States: default, focused, disabled, invalid
 *
 * Extended: optional visible `label` and `helper` text, wired to the input
 * with htmlFor / aria-describedby. `invalid` switches the helper to an
 * explanation of what's wrong. It uses neutral text plus a thicker border
 * rather than red, because in money flows the "error" is usually a limit,
 * not a mistake.
 */
export default function TextField({
  label,
  helper,
  invalid = false,
  placeholder = "",
  value,
  onChange,
  onFocus,
  disabled = false,
  inputMode,
  type = "text",
  prefix,
  className = "",
}) {
  const id = useId();
  const helperId = helper ? `${id}-helper` : undefined;

  return (
    <div className={`space-y-1 ${className}`}>
      {label ? (
        <label htmlFor={id} className="block text-body font-semibold text-neutral-900">
          {label}
        </label>
      ) : null}
      <div
        className={
          "flex items-center h-12 px-3 rounded-md bg-white " +
          (invalid ? "border-2 border-neutral-900 " : "border border-neutral-300 ") +
          "focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30 " +
          (disabled ? "bg-neutral-100" : "")
        }
      >
        {prefix ? <span className="text-body text-neutral-600 mr-2">{prefix}</span> : null}
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={helperId}
          className="w-full h-full bg-transparent text-body text-neutral-900 placeholder:text-neutral-600 focus:outline-none disabled:text-neutral-500"
        />
      </div>
      {helper ? (
        <p id={helperId} className={`text-caption ${invalid ? "text-neutral-900 font-semibold" : "text-neutral-600"}`}>
          {helper}
        </p>
      ) : null}
    </div>
  );
}
