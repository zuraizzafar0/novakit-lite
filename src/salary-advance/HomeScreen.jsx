import { AppBar, AmountText, Button, Card, ListRow } from "../novakit";
import { repayFor, REPAYMENT_DATE, RETRY_DATE } from "./data.js";

/**
 * Home. The salary-advance card changes with the user's state:
 * offer → active advance (amount + date always visible) → or a calm
 * "not available" / "checking your payslip" message after a decline.
 */
export default function HomeScreen({ balance, advance, status, onSeeOffer, onUploadPayslip }) {
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

        <AdvanceCard advance={advance} status={status} onSeeOffer={onSeeOffer} onUploadPayslip={onUploadPayslip} />

        <Card>
          <div className="text-caption text-neutral-600 mb-1">Recent activity</div>
          {advance ? (
            <ListRow
              icon="↓"
              title="Salary advance received"
              subtitle="Today"
              trailing={<AmountText amount={advance.amount} size="body" />}
            />
          ) : null}
          <ListRow
            icon="↑"
            title="Sent to Ahmed K."
            subtitle="Today, 2:14 PM"
            trailing={<AmountText amount={1500} size="body" />}
          />
          <ListRow
            icon="↓"
            title="Salary credited"
            subtitle="28 Jun"
            trailing={<AmountText amount={68000} size="body" />}
          />
          <ListRow
            icon="↑"
            title="Mobile top-up"
            subtitle="27 Jun"
            trailing={<AmountText amount={500} size="body" />}
          />
        </Card>
      </main>
    </div>
  );
}

function AdvanceCard({ advance, status, onSeeOffer, onUploadPayslip }) {
  if (advance) {
    return (
      <Card className="space-y-1">
        <div className="text-caption text-neutral-600">Salary advance</div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-body text-neutral-900">Repay on {REPAYMENT_DATE.short}</span>
          <AmountText amount={repayFor(advance.amount)} size="title" />
        </div>
        <p className="text-caption text-neutral-600">Taken from your wallet automatically on payday.</p>
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

  return (
    <Card className="space-y-3">
      <div>
        <div className="text-title text-neutral-900">Need cash before payday?</div>
        <div className="text-body text-neutral-700 mt-1">
          Check if you can get a salary advance. It only takes a moment.
        </div>
      </div>
      <Button size="lg" onClick={onSeeOffer}>
        Check what I can get
      </Button>
    </Card>
  );
}
