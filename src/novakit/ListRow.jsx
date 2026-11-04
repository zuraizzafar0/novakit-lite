/**
 * ListRow / TransactionRow — NovaKit Lite
 * leading icon · title + subtitle · trailing amount
 */
export default function ListRow({
  icon = null,
  title,
  subtitle,
  trailing = null,
  className = "",
}) {
  return (
    <div
      className={
        "flex items-center gap-3 py-3 border-b border-[#DADADA] last:border-b-0 " +
        className
      }
    >
      {icon ? (
        <div className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="text-body text-neutral-900 truncate">{title}</div>
        {subtitle ? (
          <div className="text-caption text-neutral-500 truncate">{subtitle}</div>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
