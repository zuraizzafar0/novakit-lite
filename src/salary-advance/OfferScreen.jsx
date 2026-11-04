import { useState } from "react";
import { AmountOption, Button, Card } from "../novakit";
import { Screen } from "./layout.jsx";
import { TIERS, feeFor, repayFor, REPAYMENT_DATE } from "./data.js";

const fmt = (n) => new Intl.NumberFormat("en-PK").format(n);

/**
 * Moment 0: choose an amount.
 * - Nothing is pre-selected, so we don't nudge people toward the largest amount.
 * - Every option shows its fee and total repayment, so the cost is visible
 *   before the terms screen.
 * - Tiers above the limit are locked, so over-limit requests can't happen.
 */
export default function OfferScreen({ limit, initialAmount = null, onBack, onContinue }) {
  const [selected, setSelected] = useState(initialAmount);

  return (
    <Screen
      title="Salary advance"
      onBack={onBack}
      footer={
        <>
          <Button size="lg" disabled={!selected} onClick={() => onContinue(selected)}>
            Continue
          </Button>
          <Button variant="secondary" onClick={onBack}>
            Not now
          </Button>
        </>
      }
    >
      <div>
        <h2 className="text-title text-neutral-900">How much do you need?</h2>
        <p className="text-body text-neutral-700 mt-1">
          You can get up to Rs {fmt(limit)}. You pay it back in one go on your next payday,{" "}
          <span className="font-semibold text-neutral-900">{REPAYMENT_DATE.short}</span>.
        </p>
      </div>

      <div role="radiogroup" aria-label="Advance amount" className="space-y-2">
        {TIERS.map((amount) => (
          <AmountOption
            key={amount}
            amount={amount}
            detail={`Fee Rs ${fmt(feeFor(amount))} · you repay Rs ${fmt(repayFor(amount))}`}
            selected={selected === amount}
            locked={amount > limit}
            lockedReason="Above your current limit. Limits are reviewed after on-time repayments."
            onSelect={() => setSelected(amount)}
          />
        ))}
      </div>

      <Card className="space-y-2">
        <div className="text-body font-semibold text-neutral-900">How it works</div>
        <ul className="text-body text-neutral-700 space-y-1 list-disc pl-5">
          <li>One fixed fee of 3%. No interest.</li>
          <li>Repaid automatically from your NovaPay wallet on {REPAYMENT_DATE.short}.</li>
          <li>A smaller amount means a smaller fee.</li>
        </ul>
      </Card>
    </Screen>
  );
}
