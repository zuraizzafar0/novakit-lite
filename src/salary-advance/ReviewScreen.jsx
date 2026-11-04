import { useState } from "react";
import { AmountText, Button, Card, ListRow, Notice, Timeline } from "../novakit";
import { Screen } from "./layout.jsx";
import { feeFor, fmt, repayFor, REPAYMENT_DATE } from "./data.js";

/**
 * Moments 1 + 2: total-cost disclosure and the accept decision, on ONE screen.
 *
 * Built from the benchmarking:
 * - Affirm: the headline is one line, what you repay and when.
 * - Airwallex: a timeline of "You get today → You repay on payday".
 * - Zip: every cost has a plain-language line, and the late-payment
 *   consequence is stated BEFORE accepting, not after.
 * - Zopa: "Not now" sits right under Accept at almost equal weight.
 * - Afterpay (what not to do): no fee hidden behind an info icon, no
 *   consent checkbox above a wall of legal text.
 *
 * A haircut is disclosed here, before Accept, with the fee recalculated.
 */
export default function ReviewScreen({ requested, disbursed, onBack, onChangeAmount, onDecline, onAccept }) {
  const [sending, setSending] = useState(false);
  const reduced = disbursed < requested;
  const fee = feeFor(disbursed);
  const repay = repayFor(disbursed);

  function accept() {
    setSending(true);
    setTimeout(onAccept, 1400);
  }

  return (
    <Screen
      title="Review your advance"
      onBack={sending ? null : onBack}
      footer={
        <>
          <p className="text-caption text-neutral-600 text-center">
            Nothing is sent or charged until you tap Accept.
          </p>
          <Button size="lg" loading={sending} onClick={accept}>
            {sending ? "Sending…" : `Accept and get Rs ${fmt(disbursed)}`}
          </Button>
          <Button variant="secondary" disabled={sending} onClick={onDecline}>
            Not now
          </Button>
        </>
      }
    >
      {reduced ? (
        <Notice tone="attention" title={`We can send Rs ${fmt(disbursed)}, not Rs ${fmt(requested)}`}>
          <p>
            After our final checks, Rs {fmt(disbursed)} is the most we can offer right now, based on your
            recent account activity. Everything below is worked out on Rs {fmt(disbursed)}.
          </p>
          <button
            type="button"
            onClick={onChangeAmount}
            disabled={sending}
            className="mt-2 font-semibold text-brand underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          >
            Choose a different amount
          </button>
        </Notice>
      ) : null}

      {/* Headline: the commitment in one sentence (Affirm). */}
      <div>
        <div className="text-caption text-neutral-600">You repay</div>
        <AmountText amount={repay} size="display" />
        <div className="text-body text-neutral-900">on {REPAYMENT_DATE.long}</div>
      </div>

      {/* What happens, in order (Airwallex). */}
      <Card>
        <Timeline
          items={[
            {
              when: "Today",
              title: "You get",
              amount: disbursed,
              detail: "Into your NovaPay wallet, straight away",
            },
            {
              when: `${REPAYMENT_DATE.day} · your payday`,
              title: "You repay",
              amount: repay,
              detail: "Taken from your wallet after your salary arrives",
            },
          ]}
        />
      </Card>

      {/* Every number with a plain-language line (Zip). */}
      <Card className="py-1">
        <ListRow
          wrap
          title="Amount"
          subtitle="What you receive"
          trailing={<AmountText amount={disbursed} size="body" />}
        />
        <ListRow
          wrap
          title="Fee"
          subtitle="What this advance costs you. Charged once: 3% of the amount."
          trailing={<AmountText amount={fee} size="body" />}
        />
        <ListRow
          wrap
          title={<span className="font-semibold">Total to repay</span>}
          subtitle="The only amount you'll pay back. No interest."
          trailing={<AmountText amount={repay} size="body" className="font-semibold" />}
        />
      </Card>

      {/* The late-payment consequence, stated before accepting (Zip). */}
      <Card className="space-y-2">
        <div className="text-body font-semibold text-neutral-900">If you can't repay on {REPAYMENT_DATE.short}</div>
        <ul className="text-body text-neutral-700 space-y-1 list-disc pl-5">
          <li>No late fee and no interest. You'll never owe more than Rs {fmt(repay)}.</li>
          <li>We'll collect it when your next salary arrives, not from other money you receive.</li>
          <li>You can move the date once, for free, in the app.</li>
          <li>We'll never contact your family, friends or employer.</li>
        </ul>
      </Card>
    </Screen>
  );
}
