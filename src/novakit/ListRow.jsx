/**
 * ListRow / TransactionRow — NovaKit Lite
 * leading icon · title + subtitle · trailing amount
 * `wrap` lets title/subtitle wrap instead of truncating. Use it for
 * money explanations, where cut-off text could hide a cost.
 */
export default function ListRow({
  icon = null,
  title,
  subtitle,
  trailing = null,
  wrap = false,
  className = "",
}) {
  return (
    <div
      className={
        (wrap ? "flex items-start gap-3" : "flex items-center gap-3") + " py-3 border-b border-neutral-300 last:border-b-0 " +
        className
      }
    >
      {icon ? (
        <div className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className={`text-body text-neutral-900 ${wrap ? "" : "truncate"}`}>{title}</div>
        {subtitle ? (
          <div className={`text-caption text-neutral-600 ${wrap ? "" : "truncate"}`}>{subtitle}</div>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
