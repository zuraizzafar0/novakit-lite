/**
 * BottomSheet — NovaKit Lite
 * A modal sheet anchored to the bottom of the viewport.
 */
export default function BottomSheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-20">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-lg p-4 pb-6">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-300" />
        {children}
      </div>
    </div>
  );
}
