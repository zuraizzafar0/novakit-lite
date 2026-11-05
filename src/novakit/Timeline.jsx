/**
 * Timeline — NovaKit Lite (added)
 * A short vertical sequence of money events: when → what → how much.
 * Used wherever we tell someone what happens to their money and when
 * (terms, confirmation, repayment). Benchmark: Airwallex "Review transfer".
 *
 * items: [{ when, title, amount?, detail?, tone? }]
 * tone: "default" | "done" (a past step, shown with a check)
 */
import AmountText from "./AmountText.jsx";
import Icon from "./Icon.jsx";

export default function Timeline({ items, className = "" }) {
  return (
    <ol className={`relative ${className}`}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        const done = item.tone === "done";
        return (
          <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
            {!last ? (
              <span aria-hidden="true" className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-neutral-200" />
            ) : null}
            <span
              aria-hidden="true"
              className={`relative mt-1 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center text-[11px] font-bold ${
                done ? "bg-brand border-brand text-white" : "bg-white border-brand"
              }`}
            >
              {done ? <Icon name="check" size={12} /> : null}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-caption text-neutral-600">{item.when}</div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-body text-neutral-900">{item.title}</span>
                {item.amount != null ? <AmountText amount={item.amount} size="body" className="font-semibold" /> : null}
              </div>
              {item.detail ? <div className="text-caption text-neutral-600">{item.detail}</div> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
