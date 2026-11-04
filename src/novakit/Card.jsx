/**
 * Card — NovaKit Lite
 * A surface container for grouping content.
 */
export default function Card({ children, className = "" }) {
  return (
    <div
      className={
        "bg-white rounded-lg border border-[#E6E6E6] shadow-card p-4 " + className
      }
    >
      {children}
    </div>
  );
}
