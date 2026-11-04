/**
 * Card — NovaKit Lite
 * A surface container for grouping content.
 */
export default function Card({ children, className = "" }) {
  return (
    <div
      className={
        "bg-white rounded-lg border border-neutral-200 shadow-card p-4 " + className
      }
    >
      {children}
    </div>
  );
}
