/**
 * AppBar — NovaKit Lite
 * title + optional back affordance
 * Back is a 44px target with an SVG chevron (was a small "‹" text glyph).
 * The title can take focus, so screens can move focus to it on arrival.
 */
import Icon from "./Icon.jsx";

export default function AppBar({ title, onBack = null }) {
  return (
    <header className="h-14 flex items-center gap-2 px-3 border-b border-neutral-100 bg-white">
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Back"
          className="h-11 w-11 -ml-2 flex items-center justify-center rounded-full text-neutral-900 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Icon name="chevron-left" size={24} />
        </button>
      ) : null}
      <h1 tabIndex={-1} className="text-title text-neutral-900 focus:outline-none">{title}</h1>
    </header>
  );
}
