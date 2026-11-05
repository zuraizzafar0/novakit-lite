import { AmountText, Button, Card } from "../novakit";
import { Screen } from "./layout.jsx";
import { feeFor, fmt, repayFor, REPAYMENT_DATE, TIERS } from "./data.js";

/**
 * The haircut: final checks approved LESS than the user asked for.
 *
 * This gets its own decision step instead of being folded into the terms
 * screen, because a smaller amount pre-filled into an "Accept" button is a
 * quiet bait-and-switch. Here the user:
 * - sees exactly what changed (asked vs. can send, fee and total side by side),
 * - is told why, as specifically as we're allowed to,
 * - is explicitly allowed to walk away: a smaller advance that doesn't cover
 *   the need is just a debt.
 * Only after choosing to continue do they see the full terms and Accept.
 */
export default function AmountChangedScreen({ requested, disbursed, onContinue, onChangeAmount, onCancel }) {
  const rows = [
    { label: "Amount", before: requested, after: disbursed },
    { label: "Fee (3%)", before: feeFor(requested), after: feeFor(disbursed) },
    { label: "You repay", before: repayFor(requested), after: repayFor(disbursed), strong: true },
  ];

  const smaller = TIERS.filter((t) => t < disbursed);

  return (
    <Screen
      title="Your amount has changed"
      onBack={onChangeAmount}
      footer={
        <>
          <Button size="lg" onClick={onContinue}>
            Continue with Rs {fmt(disbursed)}
          </Button>
          <Button variant="secondary" onClick={onChangeAmount}>
            Choose a different amount
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Don't take an advance
          </Button>
        </>
      }
    >
      <div>
        <h2 className="text-title text-neutral-900">
          We can send Rs {fmt(disbursed)}, not the Rs {fmt(requested)} you asked for
        </h2>
      </div>

      <Card className="py-2">
        <table className="w-full text-left">
          <caption className="sr-only">What changes with the lower amount</caption>
          <thead>
            <tr className="text-caption text-neutral-600">
              <th scope="col" className="py-2 font-normal" />
              <th scope="col" className="py-2 font-normal text-right">You asked for</th>
              <th scope="col" className="py-2 font-normal text-right">We can send</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-neutral-200">
                <th scope="row" className={`py-3 text-body text-neutral-900 ${r.strong ? "font-semibold" : "font-normal"}`}>
                  {r.label}
                </th>
                <td className="py-3 text-right">
                  <AmountText amount={r.before} size="body" tone="muted" className="line-through decoration-neutral-500" />
                </td>
                <td className="py-3 text-right">
                  <AmountText amount={r.after} size="body" className={r.strong ? "font-semibold" : ""} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-caption text-neutral-600 pb-1">Repayment date stays the same: {REPAYMENT_DATE.short}.</p>
      </Card>

      <Card className="space-y-1">
        <div className="text-body font-semibold text-neutral-900">Will Rs {fmt(disbursed)} be enough?</div>
        <p className="text-body text-neutral-700">
          If it won't cover what you need, it's okay not to take it.
          {smaller.length ? ` You can also choose a smaller amount, like Rs ${fmt(smaller[0])}, for a smaller fee.` : ""}{" "}
          Saying no won't affect future offers.
        </p>
      </Card>
    </Screen>
  );
}
