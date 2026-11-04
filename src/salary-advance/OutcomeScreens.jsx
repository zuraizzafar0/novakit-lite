import { AmountText, Button, Card, ListRow } from "../novakit";
import { Screen, OutcomeIcon } from "./layout.jsx";
import { repayFor, REPAYMENT_DATE, RETRY_DATE } from "./data.js";

/** After Accept: confirm what happened and what happens next. No upsell. */
export function DoneScreen({ amount, onHome }) {
  return (
    <Screen
      title="Advance sent"
      footer={
        <Button size="lg" onClick={onHome}>
          Back to home
        </Button>
      }
    >
      <div className="flex flex-col items-center text-center gap-3 pt-6">
        <OutcomeIcon tone="success">✓</OutcomeIcon>
        <h2 className="text-title text-neutral-900">
          Rs {new Intl.NumberFormat("en-PK").format(amount)} is in your wallet
        </h2>
        <p className="text-body text-neutral-700">You can use it straight away.</p>
      </div>

      <Card className="py-1">
        <ListRow title="You repay" trailing={<AmountText amount={repayFor(amount)} size="body" />} />
        <ListRow title="On" trailing={<span className="text-body text-neutral-900">{REPAYMENT_DATE.short}</span>} />
      </Card>

      <p className="text-body text-neutral-700">
        We'll take it from your wallet on payday and remind you 3 days before. You can see this on your
        home screen at any time.
      </p>
    </Screen>
  );
}

/**
 * The not-good path: a declined first-time application.
 * - Neutral colours, not red: being declined is not an error the user made.
 * - Says "we", not "you": the decision is ours.
 * - Shares the real reason where we can, and always gives a next step or a date.
 */
const DECLINE_COPY = {
  income_unverified: {
    title: "We couldn't confirm your salary yet",
    body: "To offer an advance, we need to see that a salary comes in regularly. We couldn't confirm that from your NovaPay account.",
    next: "Upload a recent payslip and we'll check again. It usually takes 1 working day.",
  },
  credit_score: {
    title: "We can't offer an advance right now",
    body: "This decision is based on your credit history.",
    next: `You can check again from ${RETRY_DATE}. Paying bills and loans on time can help.`,
  },
  other: {
    title: "We can't offer an advance right now",
    body: "Our checks didn't approve an advance this time, and we're not able to share the specific reason.",
    next: `You can check again from ${RETRY_DATE}. If you have questions, NovaPay support can help from the Help menu.`,
  },
};

export function DeclinedScreen({ reason, onHome, onUploadPayslip }) {
  const copy = DECLINE_COPY[reason] || DECLINE_COPY.other;
  const canAct = reason === "income_unverified";

  return (
    <Screen
      title="Salary advance"
      onBack={onHome}
      footer={
        canAct ? (
          <>
            <Button size="lg" onClick={onUploadPayslip}>
              Upload a payslip
            </Button>
            <Button variant="secondary" onClick={onHome}>
              Not now
            </Button>
          </>
        ) : (
          <Button size="lg" variant="secondary" onClick={onHome}>
            Back to home
          </Button>
        )
      }
    >
      <div className="flex flex-col items-center text-center gap-3 pt-6">
        <OutcomeIcon tone="neutral">i</OutcomeIcon>
        <h2 className="text-title text-neutral-900">{copy.title}</h2>
        <p className="text-body text-neutral-700">{copy.body}</p>
      </div>

      <Card className="space-y-1">
        <div className="text-body font-semibold text-neutral-900">What you can do</div>
        <p className="text-body text-neutral-700">{copy.next}</p>
      </Card>

      <p className="text-caption text-neutral-600 text-center">
        Your NovaPay wallet works as usual. Nothing has been charged.
      </p>
    </Screen>
  );
}

/** Stub for the payslip step: the upload itself is out of scope. */
export function PayslipSentScreen({ onHome }) {
  return (
    <Screen
      title="Payslip received"
      footer={
        <Button size="lg" onClick={onHome}>
          Back to home
        </Button>
      }
    >
      <div className="flex flex-col items-center text-center gap-3 pt-6">
        <OutcomeIcon tone="brand">✓</OutcomeIcon>
        <h2 className="text-title text-neutral-900">Thanks, we've got your payslip</h2>
        <p className="text-body text-neutral-700">
          We'll check it within 1 working day and tell you in the app whether you can get an advance.
        </p>
      </div>
    </Screen>
  );
}
