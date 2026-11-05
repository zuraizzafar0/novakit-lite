import { useState } from "react";
import { AmountOption, AmountText, Button, Card, ListRow, Notice, TextField } from "../novakit";
import { Screen, OutcomeIcon, ActionRow, FactList } from "./layout.jsx";
import { AGREEMENT, DEFAULT_DATE, feeFor, fmt, LATE_STATES, NEW_DATE_OPTIONS, REPAYMENT_DATE, repayFor } from "./data.js";

/**
 * Repayment: the third hard moment.
 *
 * Built from the benchmarking:
 * - Afterpay: one big number for what you owe, plus the date. Plain, with no
 *   alarm styling before it's actually late.
 * - Warby Parker: a failed collection gets one sentence on what happened and
 *   a clear fix.
 * - Tabby: a struggling borrower sees a way forward (pay part now, move the
 *   date), not only "Pay now".
 * - KOHO (what not to do): no red, no loss framing, no threats.
 *
 * Product decisions beyond PRODUCT_REFERENCE.md (stated as assumptions):
 * partial payments are accepted, and the date can be moved once for free.
 */

/** Reminder copy (SMS/push). Plain, with the amount and date, and never threatening. */
export function reminderCopy(repay, owed) {
  switch (repay.state) {
    case "due_soon":
      return `Your salary advance repayment of Rs ${fmt(owed)} is due on ${REPAYMENT_DATE.day}. We'll take it from your wallet after your salary arrives. Nothing to do now.`;
    case "due_today":
      return `Today we'll collect Rs ${fmt(owed)} for your salary advance, once your salary arrives in your wallet.`;
    case "late":
      return `We couldn't collect Rs ${fmt(owed)} on ${REPAYMENT_DATE.day}. No late fee has been added. Open NovaPay to see your options.`;
    case "missed_new_date":
      return `We couldn't collect Rs ${fmt(owed)} on ${repay.newDate}. Nothing extra has been added. Open NovaPay to pay some now or talk to us.`;
    case "pre_default":
      return `Your salary advance will be 30 days overdue on ${DEFAULT_DATE.day}. Nothing extra has been added. Open NovaPay to see what changes and your options.`;
    default:
      return null;
  }
}

function dueLine(repay) {
  switch (repay.state) {
    case "rescheduled":
      return `Due on ${repay.newDate}`;
    case "missed_new_date":
      return `Was due on ${repay.newDate} (moved from ${REPAYMENT_DATE.day})`;
    case "pre_default":
      return `${repay.daysLate} days overdue · 30 days on ${DEFAULT_DATE.day}`;
    case "due_soon":
      return `Due on ${REPAYMENT_DATE.long} · in 3 days`;
    case "due_today":
      return "Due today, after your salary arrives";
    case "late":
      return `Was due on ${REPAYMENT_DATE.day} · ${repay.daysLate} days ago`;
    default:
      return `Due on ${REPAYMENT_DATE.long}`;
  }
}

export function RepaymentScreen({ amount, repay, onHome, onPay, onChooseAmount, onChooseDate, onTalkToUs }) {
  const total = repayFor(amount);
  const owed = total - repay.paid;
  const late = LATE_STATES.includes(repay.state);
  const preDefault = repay.state === "pre_default";
  const payable = Math.min(repay.wallet, owed);

  let footer;
  if (late) {
    footer = (
      <>
        {/* Before default, a plan with a person is the most useful step, so it leads. */}
        {preDefault ? (
          <Button size="lg" onClick={onTalkToUs}>
            Talk to us about a plan
          </Button>
        ) : null}
        {payable > 0 ? (
          <Button size={preDefault ? "md" : "lg"} variant={preDefault ? "secondary" : "primary"} onClick={onChooseAmount}>
            Pay some now
          </Button>
        ) : null}
        {/* One free date change. Once it's used, a person takes over: self-serve has run out. */}
        {!repay.usedDateChange ? (
          <Button variant="secondary" onClick={onChooseDate}>
            Choose a new date
          </Button>
        ) : !preDefault ? (
          <Button variant="secondary" onClick={onTalkToUs}>
            Talk to us
          </Button>
        ) : null}
      </>
    );
  } else {
    footer = (
      <>
        {repay.wallet >= owed ? (
          <Button variant="secondary" onClick={() => onPay(owed)}>
            Repay early: Rs {fmt(owed)}
          </Button>
        ) : null}
        <Button size="lg" variant={repay.wallet >= owed ? "primary" : "secondary"} onClick={onHome}>
          Back to home
        </Button>
      </>
    );
  }

  return (
    <Screen title="Your salary advance" onBack={onHome} footer={footer}>
      {late ? (
        <Notice
          tone="attention"
          title={
            preDefault
              ? `On ${DEFAULT_DATE.day}, this will be 30 days overdue`
              : `We couldn't collect your repayment on ${repay.state === "missed_new_date" ? repay.newDate : REPAYMENT_DATE.day}`
          }
        >
          {preDefault
            ? "We're telling you now so nothing comes as a surprise. Here's what would change, and what won't."
            : repay.paid > 0
              ? `Thanks for paying Rs ${fmt(repay.paid)}. Rs ${fmt(owed)} is left, and nothing extra has been added.`
              : `Your wallet had less than the Rs ${fmt(owed)} due. Nothing extra has been added.`}
        </Notice>
      ) : null}

      {/* One big number + the date (Afterpay). */}
      <div>
        <div className="text-caption text-neutral-600">{repay.paid > 0 ? "Left to pay" : "You owe"}</div>
        <AmountText amount={owed} size="display" />
        <div className="text-body text-neutral-900">{dueLine(repay)}</div>
      </div>

      <Card className="py-1">
        <ListRow title="Advance" trailing={<AmountText amount={amount} size="body" />} />
        <ListRow title="Fee (one-time)" trailing={<AmountText amount={feeFor(amount)} size="body" />} />
        {repay.paid > 0 ? (
          <ListRow title="Paid so far" trailing={<span className="text-body text-neutral-900">− Rs {fmt(repay.paid)}</span>} />
        ) : null}
        <ListRow
          title={<span className="font-semibold">{repay.paid > 0 ? "Left to pay" : "Total"}</span>}
          trailing={<AmountText amount={owed} size="body" className="font-semibold" />}
        />
      </Card>

      {preDefault ? (
        <>
          <Card className="space-y-2">
            <div className="text-body font-semibold text-neutral-900">What changes on {DEFAULT_DATE.day} if it isn't repaid</div>
            <ul className="text-body text-neutral-700 space-y-1 list-disc pl-5">
              <li>Your NovaPay credit record will show this advance as overdue. This can lower future limits.</li>
              <li>Salary advances stay paused until it's repaid.</li>
            </ul>
          </Card>
          <FactList
            facts={[
              `The amount stays Rs ${fmt(owed)}. No fees, ever.`,
              "We'll still only collect from your salary",
              "We'll never contact your family, friends or employer",
              "A plan agreed with us before 31 Dec stops these changes",
            ]}
          />
        </>
      ) : late ? (
        <Card className="space-y-2">
          <div className="text-body font-semibold text-neutral-900">What happens now</div>
          <ul className="text-body text-neutral-700 space-y-1 list-disc pl-5">
            <li>No late fee and no interest. You'll never owe more than Rs {fmt(total)}.</li>
            <li>We'll collect the rest when your next salary arrives, not from other money you receive.</li>
            <li>You can't take a new advance until this one is repaid.</li>
            <li>We'll never contact your family, friends or employer.</li>
          </ul>
        </Card>
      ) : (
        <Card className="space-y-1">
          <div className="text-body font-semibold text-neutral-900">How it's paid</div>
          <p className="text-body text-neutral-700">
            We'll take it from your wallet automatically after your salary arrives. You don't need to do
            anything. Your wallet has Rs {fmt(repay.wallet)} today.
          </p>
        </Card>
      )}

      {/* A record of what they agreed to, always one tap away from the debt itself. */}
      <Card className="py-1">
        <div className="text-caption text-neutral-600 pt-3">Your agreement</div>
        <ListRow title="Accepted on" trailing={<span className="text-body text-neutral-900">{AGREEMENT.date}</span>} />
        <ListRow title="Fee" trailing={<span className="text-body text-neutral-900">3%, one-time · no interest</span>} />
        <ListRow title="Terms sent by SMS to" trailing={<span className="text-body text-neutral-900">{AGREEMENT.smsTo}</span>} />
      </Card>

      {!late && !repay.usedDateChange ? (
        <p className="text-caption text-neutral-600">
          Worried about paying on time? You can move the date once, for free, from this screen if a
          payment doesn't go through.
        </p>
      ) : null}
    </Screen>
  );
}

/**
 * Pay part of a late repayment: the user chooses how much.
 * We never suggest emptying the wallet. Each suggestion shows what it leaves
 * in the wallet, so the user can keep money back for essentials.
 */
function suggestions(wallet, owed) {
  const max = Math.min(wallet, owed);
  const steps = [0.25, 0.5].map((f) => Math.floor((max * f) / 500) * 500).filter((n) => n >= 500);
  return [...new Set([...steps, max])].filter((n) => n > 0);
}

export function PayAmountScreen({ owed, wallet, onBack, onConfirm }) {
  const options = suggestions(wallet, owed);
  const [preset, setPreset] = useState(null);
  const [custom, setCustom] = useState("");
  const max = Math.min(wallet, owed);

  const typed = custom === "" ? null : Number(custom.replace(/[^0-9]/g, ""));
  const amount = typed ?? preset;
  let problem = null;
  if (typed != null) {
    if (typed <= 0) problem = "Enter an amount above Rs 0.";
    else if (typed > wallet) problem = `That's more than the Rs ${fmt(wallet)} in your wallet.`;
    else if (typed > owed) problem = `You only owe Rs ${fmt(owed)}.`;
  }
  const valid = amount != null && amount > 0 && !problem;

  return (
    <Screen
      title="Pay some now"
      onBack={onBack}
      footer={
        <>
          {valid ? (
            <p className="text-caption text-neutral-600 text-center">
              Leaves Rs {fmt(wallet - amount)} in your wallet
              {owed - amount > 0 ? ` · Rs ${fmt(owed - amount)} left to repay` : " · fully repaid"}
            </p>
          ) : null}
          <Button size="lg" disabled={!valid} onClick={() => onConfirm(amount)}>
            {valid ? `Pay Rs ${fmt(amount)}` : "Choose an amount"}
          </Button>
          <Button variant="secondary" onClick={onBack}>
            Cancel
          </Button>
        </>
      }
    >
      <div>
        <h2 className="text-title text-neutral-900">How much do you want to pay now?</h2>
      </div>

      <div role="radiogroup" aria-label="Amount to pay" className="space-y-2">
        {options.map((n) => (
          <AmountOption
            key={n}
            amount={n}
            detail={
              n === wallet
                ? "Everything in your wallet"
                : `Leaves Rs ${fmt(wallet - n)} in your wallet`
            }
            selected={typed == null && preset === n}
            onSelect={() => {
              setPreset(n);
              setCustom("");
            }}
          />
        ))}
      </div>

      <TextField
        label="Or enter an amount"
        prefix="Rs"
        inputMode="numeric"
        placeholder="0"
        value={custom}
        onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ""))}
        onFocus={() => setPreset(null)}
        invalid={Boolean(problem)}
        helper={problem || `Up to Rs ${fmt(max)}`}
      />
    </Screen>
  );
}

/** Move the repayment date once, for free (benchmark: Tabby "Extend"). */
/**
 * Talk to us: appears only once self-serve options have run out (the free
 * date change is used). Human help is for when the user can't fix it alone.
 */
export function TalkToUsScreen({ owed, onBack }) {
  const [requested, setRequested] = useState(null);
  return (
    <Screen
      title="Talk to us"
      onBack={onBack}
      footer={
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
      }
    >
      <h2 className="text-title text-neutral-900">Let's find a way to repay Rs {fmt(owed)} that works for you</h2>

      <Card className="space-y-2">
        <div className="text-body font-semibold text-neutral-900">What we can set up together</div>
        <ul className="text-body text-neutral-700 space-y-1 list-disc pl-5">
          <li>Smaller payments over a few weeks</li>
          <li>Payment dates that match when you're paid</li>
        </ul>
      </Card>

      <Card className="py-1">
        <ActionRow
          icon="person"
          title="Request a call back"
          detail="A NovaPay person calls you, at a time you choose"
          done={requested === "call"}
          doneText="Requested. We'll call you within 1 working day."
          onClick={() => setRequested("call")}
        />
        <div className="border-t border-neutral-200" />
        <ActionRow
          icon="info"
          title="Message us in the app"
          detail="Reply when it suits you"
          done={requested === "chat"}
          doneText="Sent. A person will reply in the app within a few hours."
          onClick={() => setRequested("chat")}
        />
      </Card>

      <FactList facts={["Talking to us is free and adds nothing to what you owe", "We'll never contact your family, friends or employer"]} />
    </Screen>
  );
}

export function NewDateScreen({ owed, onBack, onConfirm }) {
  const [date, setDate] = useState(null);
  return (
    <Screen
      title="Choose a new date"
      onBack={onBack}
      footer={
        <>
          <Button size="lg" disabled={!date} onClick={() => onConfirm(date)}>
            {date ? `Move my date to ${date}` : "Choose a date"}
          </Button>
          <Button variant="secondary" onClick={onBack}>
            Cancel
          </Button>
        </>
      }
    >
      <div>
        <h2 className="text-title text-neutral-900">When can you repay Rs {fmt(owed)}?</h2>
      </div>
      <fieldset className="space-y-2">
        <legend className="sr-only">New repayment date</legend>
        {NEW_DATE_OPTIONS.map((d) => (
          <label
            key={d}
            className={`flex items-center gap-3 rounded-md border p-4 cursor-pointer ${
              date === d ? "border-brand bg-brand-50 ring-1 ring-brand" : "border-neutral-300 bg-white"
            }`}
          >
            <input type="radio" name="newdate" checked={date === d} onChange={() => setDate(d)} className="accent-brand h-4 w-4" />
            <span className="text-body text-neutral-900">{d}</span>
          </label>
        ))}
      </fieldset>
      <p className="text-caption text-neutral-600">
        Free, and the amount stays the same. You can do this once. We'll take it from your wallet on that date
        and remind you 3 days before. If money arrives sooner,
        you can repay earlier.
      </p>
    </Screen>
  );
}

/** Confirmation after a payment or a date change. Calm, factual, no celebration of debt. */
export function RepaymentDoneScreen({ title, onHome }) {
  return (
    <Screen
      title="Salary advance"
      footer={
        <Button size="lg" onClick={onHome}>
          Back to home
        </Button>
      }
    >
      <div className="flex flex-col items-center text-center gap-3 pt-6">
        <OutcomeIcon tone="brand" name="check" />
        <h2 className="text-title text-neutral-900">{title}</h2>
      </div>
    </Screen>
  );
}
