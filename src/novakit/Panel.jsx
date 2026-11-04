/**
 * Panel — NovaKit Lite
 * A surface container for grouping content.
 */
export default function Panel({ children, className = "" }) {
  return (
    <div
      className={
        "bg-white rounded-lg border border-neutral-300 shadow-card p-4 " + className
      }
    >
      {children}
    </div>
  );
}
