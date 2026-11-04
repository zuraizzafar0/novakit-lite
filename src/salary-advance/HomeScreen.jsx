import { AppBar, AmountText, Button, Card, ListRow, Notice } from "../novakit";
import { fmt, repayFor, REPAYMENT_DATE, RETRY_DATE } from "./data.js";

/**
 * Home. The salary-advance card changes with the user's state:
 * entry → active advance (amount + date always visible) → reminder → late,
 * or a calm "not available" / "checking your payslip" message after a decline.
 */
export default function HomeScreen({ balance, advance, repay, status, onSeeOffer, onUploadPayslip, onOpenAdvance }) {
  return (
    <div className="flex flex-col h-full">
      <AppBar title="NovaPay" />
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card>
          <div className="text-caption text-neutral-600">Available balance</div>
          <div className="mt-1">
            <AmountText amount={balance} size="display" />
          </div>
        </Card>

        <AdvanceCard
          advance={advance}
          repay={repay}
          status={status}
          onSeeOffer={onSeeOffer}
          onUploadPayslip={onUploadPayslip}
          onOpenAdvance={onOpenAdvance}
        />

        <Card>
          <div className="text-caption text-neutral-600 mb-1">Recent activity</div>
          {repay?.paid > 0 ? (
            <ListRow icon="↑" title="Advance repayment" subtitle="Today" trailing={<AmountText amount={repay.paid} size="body" />} />
          ) : null}
          {advance && repay?.state === "active" ? (
            <ListRow icon="↓" title="Salary advance received" subtitle="Today" trailing={<AmountText amount={advance.amount} size="body" />} />
          ) : null}
          <ListRow icon="↑" title="Sent to Ahmed K." subtitle="Today, 2:14 PM" trailing={<AmountText amount={1500} size="body" />} />
          <ListRow icon="↓" title="Salary credited" subtitle="28 Jun" trailing={<AmountText amount={68000} size="body" />} />
          <ListRow icon="↑" title="Mobile top-up" subtitle="27 Jun" trailing={<AmountText amount={500} size="body" />} />
        </Card>
      </main>
    </div>
  );
}

function AdvanceCard({ advance, repay, status, onSeeOffer, onUploadPayslip, onOpenAdvance }) {
  if (advance) {
    const owed = repayFor(advance.amount) - repay.paid;

    if (owed <= 0) {
      return (
        <Card className="space-y-1">
          <div className="text-caption text-neutral-600">Salary advance</div>
          <p className="text-body text-neutral-900">Fully repaid. Thank you.</p>
        </Card>
      );
    }

    // Late: amber attention, never red, never loss-framed (KOHO, what not to do).
    if (repay.state === "late" && !repay.newDate) {
      return (
        <Card className="space-y-3">
          <Notice tone="attention" title="Your repayment didn't go through">
            Rs {fmt(owed)} is {repay.daysLate} days late. No late fee has been added.
          </Notice>
          <Button variant="secondary" onClick={onOpenAdvance}>
            See your options
          </Button>
        </Card>
      );
    }

    // Before it's late: amount + date first, no alarm styling (Afterpay).
    const when = repay.newDate
      ? `Due ${repay.newDate}`
      : repay.state === "due_today"
        ? "Due today"
        : repay.state === "due_soon"
          ? `Due ${REPAYMENT_DATE.day} · in 3 days`
          : `Due ${REPAYMENT_DATE.day}`;

    return (
      <Card className="space-y-3">
        <div className="space-y-1">
          <div className="text-caption text-neutral-600">Salary advance</div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-body text-neutral-900">{when}</span>
            <AmountText amount={owed} size="title" />
          </div>
          <p className="text-caption text-neutral-600">Taken from your wallet automatically after your salary arrives.</p>
        </div>
        <Button variant="secondary" onClick={onOpenAdvance}>
          View details
        </Button>
      </Card>
    );
  }

  if (status === "payslip_review") {
    return (
      <Card className="space-y-1">
        <div className="text-caption text-neutral-600">Salary advance</div>
        <p className="text-body text-neutral-900">We're checking your payslip.</p>
        <p className="text-caption text-neutral-600">We'll let you know within 1 working day.</p>
      </Card>
    );
  }

  if (status === "needs_payslip") {
    return (
      <Card className="space-y-3">
        <div className="space-y-1">
          <div className="text-caption text-neutral-600">Salary advance</div>
          <p className="text-body text-neutral-900">We need to confirm your salary first.</p>
          <p className="text-caption text-neutral-600">Upload a recent payslip and we'll check again.</p>
        </div>
        <Button variant="secondary" onClick={onUploadPayslip}>
          Upload a payslip
        </Button>
      </Card>
    );
  }

  if (status === "declined") {
    return (
      <Card className="space-y-1">
        <div className="text-caption text-neutral-600">Salary advance</div>
        <p className="text-body text-neutral-900">Not available right now.</p>
        <p className="text-caption text-neutral-600">You can check again from {RETRY_DATE}.</p>
      </Card>
    );
  }

  // Entry point: no amount promised (a check could take it away), but the fee
  // is shown in rupees, never as "a small fee" (KOHO, Dave).
  return (
    <Card className="space-y-3">
      <div>
        <div className="text-title text-neutral-900">Need cash before payday?</div>
        <div className="text-body text-neutral-700 mt-1">
          A salary advance of Rs 5,000 to 15,000, repaid on your next payday. One fee of 3% (Rs 150 to 450).
          No interest.
        </div>
      </div>
      <Button size="lg" onClick={onSeeOffer}>
        Check what I can get
      </Button>
      <p className="text-caption text-neutral-600 text-center">Checking is free, and you decide after you see the full cost.</p>
    </Card>
  );
}
