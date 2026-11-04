import { AppBar } from "../novakit";

/** Screen layout for the prototype: app bar, scrolling content, pinned actions. */
export function Screen({ title, onBack, children, footer }) {
  return (
    <div className="flex flex-col h-full">
      <AppBar title={title} onBack={onBack} />
      <main className="flex-1 overflow-y-auto p-4 space-y-4">{children}</main>
      {footer ? (
        <div className="p-4 pt-3 border-t border-neutral-200 bg-white space-y-2">{footer}</div>
      ) : null}
    </div>
  );
}

/** Full-screen wait state, announced to screen readers. */
export function Waiting({ title, message }) {
  return (
    <Screen title={title}>
      <div className="h-full flex flex-col items-center justify-center text-center gap-4" role="status" aria-live="polite">
        <span
          aria-hidden="true"
          className="h-10 w-10 rounded-full border-4 border-brand-100 border-t-brand animate-spin"
        />
        <p className="text-body text-neutral-700">{message}</p>
      </div>
    </Screen>
  );
}

/** Large round icon at the top of an outcome screen. */
export function OutcomeIcon({ tone = "neutral", children }) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-700",
    success: "bg-success text-white",
    brand: "bg-brand-50 text-brand",
  };
  return (
    <div
      aria-hidden="true"
      className={`h-14 w-14 rounded-full flex items-center justify-center text-title ${tones[tone]}`}
    >
      {children}
    </div>
  );
}
