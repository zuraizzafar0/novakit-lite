import { useState } from "react";
import { AmountText, Button, Card, ListRow, Notice } from "../novakit";
import { Screen } from "./layout.jsx";
import { feeFor, repayFor, REPAYMENT_DATE } from "./data.js";

const fmt = (n) => new Intl.NumberFormat("en-PK").format(n);

/**
 * Moments 1 + 2: total-cost disclosure and the accept decision, on ONE screen.
 * The product rule is that the total cost and date must be clear "at the moment
 * of decision", so the numbers sit directly above the Accept button rather than
 * on a previous screen or in a sheet.
 *
 * If final checks reduced the amount (haircut), that is disclosed here, BEFORE
 * Accept, with the fee recalculated on the amount actually sent.
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
            You'll repay <span className="font-semibold text-neutral-900">Rs {fmt(repay)}</span> on{" "}
            {REPAYMENT_DATE.short}.
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
            After our final checks, Rs {fmt(disbursed)} is the most we can offer right now, based on
            your recent account activity. The fee below is worked out on Rs {fmt(disbursed)}.
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

      <div>
        <div className="text-caption text-neutral-600">You get today</div>
        <AmountText amount={disbursed} size="display" />
      </div>

      <Card className="py-1">
        <ListRow title="You get" trailing={<AmountText amount={disbursed} size="body" />} />
        <ListRow
          title="Fee"
          subtitle="One-time, 3% of the amount sent"
          trailing={<AmountText amount={fee} size="body" />}
        />
        <ListRow
          title={<span className="font-semibold">You repay</span>}
          subtitle={`On ${REPAYMENT_DATE.long}`}
          trailing={<AmountText amount={repay} size="title" />}
        />
      </Card>

      <ul className="text-body text-neutral-700 space-y-2">
        <li>
          <span className="font-semibold text-neutral-900">This is the full cost.</span> No interest and no
          other charges.
        </li>
        <li>
          On {REPAYMENT_DATE.short}, we take Rs {fmt(repay)} from your NovaPay wallet, after your salary
          arrives.
        </li>
        <li>We'll remind you 3 days before.</li>
      </ul>
    </Screen>
  );
}
