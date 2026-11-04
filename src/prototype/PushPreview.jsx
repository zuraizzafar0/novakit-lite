/**
 * Prototype-only: shows the reminder a user would receive as a push/SMS,
 * so reviewers can read the reminder copy in context. Not a NovaKit component.
 */
export default function PushPreview({ message, onOpen, onDismiss }) {
  if (!message) return null;
  return (
    <div className="absolute left-3 right-3 top-3 z-30">
      <div className="rounded-md bg-white/95 border border-neutral-200 shadow-xl p-3 flex gap-3">
        <span aria-hidden="true" className="h-8 w-8 shrink-0 rounded-sm bg-brand text-white text-caption font-bold flex items-center justify-center">
          N
        </span>
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
          <span className="block text-caption text-neutral-600">NovaPay · now</span>
          <span className="block text-caption text-neutral-900">{message}</span>
        </button>
        <button type="button" onClick={onDismiss} aria-label="Dismiss notification" className="text-neutral-600 h-6 w-6 shrink-0">
          ×
        </button>
      </div>
    </div>
  );
}
