import { useState } from "react";
import { Button, Card, Icon, ListRow, Notice, Timeline } from "../novakit";
import { Screen, OutcomeIcon, Checklist, ActionRow, FactList } from "./layout.jsx";
import { CHECKLIST, fmt, repayFor, REPAYMENT_DATE, RETRY_DATE } from "./data.js";

/**
 * After Accept: confirm what happened and what happens next. No upsell.
 * The terms also go out by SMS (JazzCash), so they follow the user outside
 * the app and there's a record of what they agreed to.
 */
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
      <div className="flex flex-col items-center text-center gap-3 pt-4">
        <OutcomeIcon tone="success" name="check" />
        <h2 className="text-title text-neutral-900">Rs {fmt(amount)} is in your wallet</h2>
      </div>

      <Card>
        <Timeline
          items={[
            { when: "Today", title: "You got", amount, tone: "done" },
            { when: "28 Nov", title: "We remind you", detail: "3 days before, by SMS and in the app" },
            {
              when: `${REPAYMENT_DATE.day} · your payday`,
              title: "You repay",
              amount: repayFor(amount),
              detail: "Taken from your wallet after your salary arrives",
            },
          ]}
        />
      </Card>

      <Notice tone="info" title="We've sent these terms to you by SMS">
        Keep it for your records. You can also see them any time from the advance card on your home screen.
      </Notice>
    </Screen>
  );
}

/**
 * The not-good path: a declined first-time application.
 * - Neutral colours, not red: being declined is not an error the user made.
 * - Says "we", not "you": the decision is ours.
 * - Shows which requirement wasn't met, where we can (X's checklist).
 * - Says a system decided and that it isn't permanent (N26).
 * - Always gives a next step or a date (Starling, what not to do: a dead end with "OK").
 * - Never suggests another credit product (KOHO, what not to do).
 */
const DECLINE_COPY = {
  income_unverified: {
    title: "We couldn't confirm your salary yet",
  },
  credit_score: {
    title: "We can't offer an advance right now",
  },
  other: {
    title: "We can't offer an advance right now",
  },
};

export function DeclinedScreen({ reason, onHome, onUploadPayslip }) {
  const [notify, setNotify] = useState(false);
  const [review, setReview] = useState(false);
  const copy = DECLINE_COPY[reason] || DECLINE_COPY.other;
  const checklist = CHECKLIST[reason];
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
          <>
            <Button size="lg" variant={notify ? "secondary" : "primary"} disabled={notify} onClick={() => setNotify(true)}>
              {notify ? (
                <>
                  <Icon name="check" size={18} /> We'll remind you on {RETRY_DATE}
                </>
              ) : (
                `Remind me on ${RETRY_DATE}`
              )}
            </Button>
            <Button variant="secondary" onClick={onHome}>
              Back to home
            </Button>
          </>
        )
      }
    >
      {/* Prominent through structure, not alarm colour: brand tint, a clear
          headline, then Why → What you can do → what didn't happen. */}
      <div className="space-y-3 pt-2">
        <OutcomeIcon tone="brand" name="info" />
        <h2 className="text-title text-neutral-900">{copy.title}</h2>
        {!canAct ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-caption text-neutral-900">
            <Icon name="clock" size={16} /> You can check again from {RETRY_DATE}
          </p>
        ) : null}
      </div>

      {checklist ? (
        <Checklist
          title="Why: what we checked"
          items={checklist.map((item) => ({
            ...item,
            hint: canAct ? "A recent payslip can confirm this" : "Not met this time",
          }))}
        />
      ) : (
        <Card className="space-y-1">
          <div className="text-body font-semibold text-neutral-900">Why</div>
          <p className="text-body text-neutral-700">
            We can't share the specific reason for this decision. We know that's frustrating.
          </p>
        </Card>
      )}

      <Card className="py-1">
        <div className="text-body font-semibold text-neutral-900 pt-3">What you can do</div>
        <ActionRow
          icon="person"
          title="Ask a person to review this"
          detail="Our checks decided this automatically. A person can take a second look."
          done={review}
          doneText="Review requested. We'll reply in the app within 2 working days."
          onClick={() => setReview(true)}
        />
      </Card>

      <FactList facts={["Your NovaPay wallet works as usual", "Nothing has been charged"]} />
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
        <OutcomeIcon tone="brand" name="check" />
        <h2 className="text-title text-neutral-900">Thanks, we've got your payslip</h2>
      </div>
    </Screen>
  );
}
