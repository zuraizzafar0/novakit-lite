import { useState } from "react";
import { AmountOption, Button, Card, Icon } from "../novakit";
import { Screen, Checklist } from "./layout.jsx";
import { TIERS, UNLOCK_CHECKLIST, feeFor, fmt, repayFor, REPAYMENT_DATE } from "./data.js";

/**
 * Choose an amount.
 * - Nothing is pre-selected, so we don't nudge people toward the largest amount.
 * - Every option shows its fee in rupees and its total (Dave, what not to do:
 *   "a small fee" with no number).
 * - Tiers above the limit are locked, so over-limit requests can't happen.
 * - Only amounts we can actually give are selectable. Risk checks run before
 *   this screen, so we never show an amount a later check takes away (KOHO).
 * - Locked tiers come with a factual "how to unlock" list, not a "boost" (Cleo).
 * - No countdowns, referral boosts or "limited time" framing (Cleo, what not to do).
 */
export default function OfferScreen({ limit, initialAmount = null, onBack, onContinue }) {
  const [selected, setSelected] = useState(initialAmount);
  const [showUnlock, setShowUnlock] = useState(false);
  const top = Math.max(...TIERS);

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
      <h2 className="text-title text-neutral-900">How much do you need?</h2>

      <div role="radiogroup" aria-label="Advance amount" className="space-y-2">
        {TIERS.map((amount) => (
          <AmountOption
            key={amount}
            amount={amount}
            detail={`Fee Rs ${fmt(feeFor(amount))} · you repay Rs ${fmt(repayFor(amount))}`}
            selected={selected === amount}
            locked={amount > limit}
            lockedReason="Above your current limit"
            onSelect={() => setSelected(amount)}
          />
        ))}
      </div>

      {/* Secondary info, available on request rather than pushed: shown up front it
          nudges toward borrowing more. Expand-in-place, not a tooltip (no hover on phones). */}
      {top > limit ? (
        <div className="-mt-1 space-y-2">
          <button
            type="button"
            aria-expanded={showUnlock}
            aria-controls="unlock-info"
            onClick={() => setShowUnlock((v) => !v)}
            className="inline-flex items-center gap-1 text-body font-semibold text-brand rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            How to unlock Rs {fmt(top)}
            <Icon
              name="chevron-down"
              size={18}
              className={`motion-safe:transition-transform ${showUnlock ? "rotate-180" : ""}`}
            />
          </button>
          {showUnlock ? (
            <div id="unlock-info" className="motion-safe:animate-enter">
              <Checklist title="What raises your limit" items={UNLOCK_CHECKLIST} />
            </div>
          ) : null}
        </div>
      ) : null}

      <Card className="space-y-2">
        <div className="text-body font-semibold text-neutral-900">How it works</div>
        <ul className="text-body text-neutral-700 space-y-1 list-disc pl-5">
          <li>One fixed fee of 3%. No interest, no late fees.</li>
          <li>Repaid automatically from your NovaPay wallet on {REPAYMENT_DATE.short}.</li>
          <li>A smaller amount means a smaller fee.</li>
          <li>We never ask for access to your contacts or photos.</li>
        </ul>
      </Card>
    </Screen>
  );
}
