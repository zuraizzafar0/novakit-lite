/**
 * Notice — NovaKit Lite (added)
 * An inline, persistent message that stays on screen until the user moves on.
 * Use it for information the user must read before deciding (e.g. a reduced
 * amount). Unlike Toast, it never auto-dismisses.
 *
 * Tones: info (brand tint) | attention (amber tint)
 * There is deliberately no "danger" tone: a reduced or declined advance is
 * not an error the user made.
 */
export default function Notice({ tone = "info", title, children, className = "" }) {
  const tones = {
    info: { box: "bg-brand-50 border-brand-100", icon: "bg-brand text-white", glyph: "i" },
    attention: { box: "bg-accent-50 border-accent-100", icon: "bg-accent-600 text-white", glyph: "!" },
  };
  const t = tones[tone] || tones.info;

  return (
    <div className={`flex gap-3 rounded-md border p-3 ${t.box} ${className}`}>
      <span
        aria-hidden="true"
        className={`mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-caption font-bold ${t.icon}`}
      >
        {t.glyph}
      </span>
      <div className="min-w-0 space-y-1">
        {title ? <div className="text-body font-semibold text-neutral-900">{title}</div> : null}
        {children ? <div className="text-body text-neutral-700">{children}</div> : null}
      </div>
    </div>
  );
}
