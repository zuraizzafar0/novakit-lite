import { useEffect, useRef, useState } from "react";
import { AppBar, Button, Icon } from "../novakit";

/**
 * Screen layout for the prototype: app bar, scrolling content, pinned actions.
 * On arrival, focus moves to the screen title so screen-reader users hear
 * where they are, and the content eases in (skipped for reduced motion).
 */
export function Screen({ title, onBack, children, footer }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.querySelector("h1")?.focus({ preventScroll: true });
  }, []);

  return (
    <div ref={ref} className="flex flex-col h-full">
      <AppBar title={title} onBack={onBack} />
      <main className="flex-1 overflow-y-auto p-4 space-y-4 motion-safe:animate-enter">{children}</main>
      {footer ? (
        <div className="p-4 pt-3 border-t border-neutral-200 bg-white space-y-2">{footer}</div>
      ) : null}
    </div>
  );
}

/**
 * Wait state that says WHAT we're checking, step by step, instead of an
 * unexplained spinner. Each step ticks off as it completes.
 */
export function Waiting({ title, heading, steps, duration = 1800, note }) {
  const [done, setDone] = useState(0);
  useEffect(() => {
    const per = duration / steps.length;
    const timers = steps.map((_, i) => setTimeout(() => setDone(i + 1), per * (i + 1) - 80));
    return () => timers.forEach(clearTimeout);
  }, [steps, duration]);

  return (
    <Screen title={title}>
      <div className="pt-6 space-y-5">
        <h2 className="text-title text-neutral-900">{heading}</h2>
        <ol className="space-y-3" aria-live="polite">
          {steps.map((step, i) => {
            const state = i < done ? "done" : i === done ? "active" : "pending";
            return (
              <li key={step} className="flex items-center gap-3">
                <span className="h-6 w-6 flex items-center justify-center">
                  {state === "done" ? (
                    <span className="h-6 w-6 rounded-full bg-brand text-white flex items-center justify-center motion-safe:animate-pop">
                      <Icon name="check" size={14} />
                    </span>
                  ) : state === "active" ? (
                    <span aria-hidden="true" className="h-5 w-5 rounded-full border-2 border-brand-100 border-t-brand animate-spin" />
                  ) : (
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-neutral-300" />
                  )}
                </span>
                <span className={`text-body ${state === "pending" ? "text-neutral-600" : "text-neutral-900"}`}>
                  {step}
                  <span className="sr-only">{state === "done" ? " (done)" : state === "active" ? " (in progress)" : ""}</span>
                </span>
              </li>
            );
          })}
        </ol>
        {note ? <p className="text-caption text-neutral-600">{note}</p> : null}
      </div>
    </Screen>
  );
}

/** Large round icon at the top of an outcome screen. */
export function OutcomeIcon({ tone = "neutral", name }) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-700",
    success: "bg-success text-white",
    brand: "bg-brand-50 text-brand",
  };
  return (
    <div
      aria-hidden="true"
      className={`h-14 w-14 rounded-full flex items-center justify-center motion-safe:animate-pop ${tones[tone]}`}
    >
      <Icon name={name} size={28} />
    </div>
  );
}

/**
 * A technical failure. Deliberately different from a decline:
 * it says the problem is ours, that it isn't a decision about the user, and
 * exactly what did and didn't happen to their money.
 */
export function ProblemScreen({ title, heading, facts, retryLabel = "Try again", onRetry, onHome }) {
  const [retrying, setRetrying] = useState(false);
  return (
    <Screen
      title={title}
      onBack={retrying ? null : onHome}
      footer={
        <>
          <Button
            size="lg"
            loading={retrying}
            onClick={() => {
              setRetrying(true);
              setTimeout(onRetry, 1200);
            }}
          >
            {retrying ? "Trying again…" : retryLabel}
          </Button>
          <Button variant="secondary" disabled={retrying} onClick={onHome}>
            Back to home
          </Button>
        </>
      }
    >
      <div className="space-y-2 pt-2">
        <OutcomeIcon tone="neutral" name="alert" />
        <h2 className="text-title text-neutral-900">{heading}</h2>
      </div>
      <ul className="rounded-md bg-neutral-50 border border-neutral-200 p-3 space-y-2">
        {facts.map((f) => (
          <li key={f} className="flex gap-2 text-body text-neutral-900">
            <Icon name="check" size={18} className="mt-0.5 text-success" />
            {f}
          </li>
        ))}
      </ul>
    </Screen>
  );
}
