/**
 * Toast — NovaKit Lite
 * A transient confirmation message.
 * Variant: success
 */
export default function Toast({ open, message }) {
  if (!open) return null;
  return (
    <div className="absolute left-4 right-4 bottom-6 z-30">
      <div className="flex items-center gap-2 rounded-md bg-success text-white px-4 py-3 text-body shadow-card">
        <span aria-hidden="true">✓</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
