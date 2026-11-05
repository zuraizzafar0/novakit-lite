import { useEffect, useState } from "react";
import ScenarioSwitcher from "./prototype/ScenarioSwitcher.jsx";
import PushPreview from "./prototype/PushPreview.jsx";
import HomeScreen from "./salary-advance/HomeScreen.jsx";
import OfferScreen from "./salary-advance/OfferScreen.jsx";
import ReviewScreen from "./salary-advance/ReviewScreen.jsx";
import AmountChangedScreen from "./salary-advance/AmountChangedScreen.jsx";
import { DoneScreen, DeclinedScreen, PayslipSentScreen } from "./salary-advance/OutcomeScreens.jsx";
import {
  RepaymentScreen,
  NewDateScreen,
  PayAmountScreen,
  RepaymentDoneScreen,
  reminderCopy,
} from "./salary-advance/RepaymentScreens.jsx";
import { Waiting, ProblemScreen } from "./salary-advance/layout.jsx";
import {
  ADVANCE_AMOUNT_FOR_REPAY_SCENARIOS,
  SCENARIOS,
  STARTING_BALANCE,
  disbursedFor,
  fmt,
  repayFor,
} from "./salary-advance/data.js";

/**
 * NovaPay prototype: first-time salary advance.
 *
 * Applying:  home → checking → offer → final checks → review (terms + accept) → done
 *                           ↘ declined → (payslip uploaded)
 * Repaying:  reminder → repayment details → (late) pay part now / choose a new date
 */
function initialState(scenario) {
  if (scenario.repayment) {
    const { state, wallet, daysLate = 0 } = scenario.repayment;
    return {
      screen: "home",
      requested: null,
      status: null,
      advance: { amount: ADVANCE_AMOUNT_FOR_REPAY_SCENARIOS },
      repay: { state, wallet, daysLate, paid: 0, newDate: null, usedDateChange: false },
      push: true,
      doneMessage: null,
    };
  }
  return {
    screen: "home",
    requested: null,
    status: null,
    advance: null,
    repay: { state: "none", wallet: STARTING_BALANCE, daysLate: 0, paid: 0, newDate: null, usedDateChange: false },
    push: false,
    doneMessage: null,
  };
}

const CHECK_STEPS = ["Your NovaPay account", "Your salary deposits", "Working out your limit"];
const FINAL_STEPS = ["Confirming your payday", "Final check on the amount"];

// Deep links for reviewers, e.g. ?scenario=late&screen=repayment or ?scenario=haircut&screen=review
const DEEP_LINK_SCREENS = ["home", "offer", "review", "declined", "repayment", "pay_amount", "amount_changed", "checking", "check_failed", "send_failed"];
function fromUrl() {
  const q = new URLSearchParams(window.location.search);
  const scenario = SCENARIOS.find((x) => x.id === q.get("scenario")) || SCENARIOS[0];
  const state = initialState(scenario);
  const screen = q.get("screen");
  if (DEEP_LINK_SCREENS.includes(screen)) {
    if (screen === "review" && !scenario.decline && !scenario.repayment) {
      state.requested = scenario.haircutCap ? 15000 : scenario.limit;
      state.screen = "review";
    } else if (screen === "declined" && scenario.decline) state.screen = "declined";
    else if (screen === "repayment" && scenario.repayment) state.screen = "repayment";
    else if (screen === "amount_changed" && scenario.haircutCap) {
      state.requested = 15000;
      state.screen = "amount_changed";
    }
    else if (["checking", "check_failed"].includes(screen) && !scenario.repayment) state.screen = screen;
    else if (screen === "send_failed" && !scenario.decline && !scenario.repayment) {
      state.requested = scenario.haircutCap ? 15000 : scenario.limit;
      state.screen = "send_failed";
    }
    else if (screen === "pay_amount" && scenario.repayment?.state === "late") state.screen = "pay_amount";
    else if (screen === "offer" && !scenario.decline && !scenario.repayment) state.screen = "offer";
    state.push = state.push && state.screen === "home";
  }
  return { scenarioId: scenario.id, state };
}

export default function App() {
  const [initial] = useState(fromUrl);
  const [scenarioId, setScenarioId] = useState(initial.scenarioId);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);
  const [s, setS] = useState(initial.state);
  // Prototype-only: make the next check or send fail once, to show error states.
  const [problems, setProblems] = useState({ check: false, send: false });
  const [failed, setFailed] = useState({ check: false, send: false });
  const set = (patch) => setS((prev) => ({ ...prev, ...patch }));
  const go = (screen) => set({ screen, push: false });

  function reset(nextId = scenarioId) {
    setFailed({ check: false, send: false });
    setScenarioId(nextId);
    setS(initialState(SCENARIOS.find((x) => x.id === nextId)));
  }

  // Simulated network waits.
  useEffect(() => {
    if (s.screen !== "checking" && s.screen !== "final_checks") return;
    const t = setTimeout(() => {
      if (s.screen === "checking" && problems.check && !failed.check) {
        setFailed((f) => ({ ...f, check: true }));
        set({ screen: "check_failed" });
      } else if (s.screen === "checking") set({ screen: scenario.decline ? "declined" : "offer" });
      else set({ screen: disbursedFor(scenario, s.requested) < s.requested ? "amount_changed" : "review" });
    }, 1800);
    return () => clearTimeout(t);
  }, [s.screen, scenario, problems, failed]);

  const owed = s.advance ? repayFor(s.advance.amount) - s.repay.paid : 0;
  const home = () => go("home");

  function pay(amount) {
    const left = owed - amount;
    set({
      repay: { ...s.repay, paid: s.repay.paid + amount, wallet: s.repay.wallet - amount },
      doneMessage:
        left > 0
          ? {
              title: `You paid Rs ${fmt(amount)}. Rs ${fmt(left)} is left, with nothing added.`,
            }
          : { title: "Your advance is fully repaid. Thank you." },
      screen: "repayment_done",
    });
  }

  let view;
  switch (s.screen) {
    case "checking":
      view = (
        <Waiting
          title="Salary advance"
          heading="Checking what you can get"
          steps={CHECK_STEPS}
          note="This takes a few seconds. Checking is free and doesn't commit you to anything."
        />
      );
      break;
    case "offer":
      view = (
        <OfferScreen
          limit={scenario.limit}
          initialAmount={s.requested}
          onBack={home}
          onContinue={(amount) => set({ requested: amount, screen: "final_checks" })}
        />
      );
      break;
    case "final_checks":
      view = (
        <Waiting
          title="Salary advance"
          heading="Running final checks"
          steps={FINAL_STEPS}
          note="Nothing is sent until you've seen the full cost and tapped Accept."
        />
      );
      break;
    case "review":
      view = (
        <ReviewScreen
          requested={s.requested}
          disbursed={disbursedFor(scenario, s.requested)}
          onBack={() => go(disbursedFor(scenario, s.requested) < s.requested ? "amount_changed" : "offer")}
          onDecline={home}
          onAccept={() => {
            if (problems.send && !failed.send) {
              setFailed((f) => ({ ...f, send: true }));
              set({ screen: "send_failed" });
              return;
            }
            const amount = disbursedFor(scenario, s.requested);
            set({
              advance: { amount },
              repay: { ...s.repay, state: "active", wallet: s.repay.wallet + amount },
              screen: "done",
            });
          }}
        />
      );
      break;
    case "amount_changed":
      view = (
        <AmountChangedScreen
          requested={s.requested}
          disbursed={disbursedFor(scenario, s.requested)}
          onContinue={() => go("review")}
          onChangeAmount={() => set({ requested: null, screen: "offer" })}
          onCancel={home}
        />
      );
      break;
    case "check_failed":
      view = (
        <ProblemScreen
          title="Salary advance"
          heading="We couldn't finish checking"
          facts={[
            "This is a problem on our side, not a decision about you",
            "Nothing has changed on your account",
            "It doesn't count as a declined application",
          ]}
          onRetry={() => go("checking")}
          onHome={home}
        />
      );
      break;
    case "send_failed":
      view = (
        <ProblemScreen
          title="Salary advance"
          heading="We couldn't send your advance"
          facts={[
            "Nothing was sent to your wallet",
            "Nothing was charged, and you don't owe anything",
            "Your offer and terms are unchanged",
          ]}
          retryLabel={`Try again: get Rs ${fmt(disbursedFor(scenario, s.requested || 0))}`}
          onRetry={() => {
            const amount = disbursedFor(scenario, s.requested);
            set({
              advance: { amount },
              repay: { ...s.repay, state: "active", wallet: s.repay.wallet + amount },
              screen: "done",
            });
          }}
          onHome={home}
        />
      );
      break;
    case "done":
      view = <DoneScreen amount={s.advance.amount} onHome={home} />;
      break;
    case "declined":
      view = (
        <DeclinedScreen
          reason={scenario.decline}
          onHome={() =>
            set({ status: scenario.decline === "income_unverified" ? "needs_payslip" : "declined", screen: "home" })
          }
          onUploadPayslip={() => go("payslip_sent")}
        />
      );
      break;
    case "payslip_sent":
      view = <PayslipSentScreen onHome={() => set({ status: "payslip_review", screen: "home" })} />;
      break;
    case "repayment":
      view = (
        <RepaymentScreen
          amount={s.advance.amount}
          repay={s.repay}
          onHome={home}
          onChooseDate={() => go("new_date")}
          onChooseAmount={() => go("pay_amount")}
          onPay={(amount) => pay(amount)}
        />
      );
      break;
    case "pay_amount":
      view = (
        <PayAmountScreen
          owed={owed}
          wallet={s.repay.wallet}
          onBack={() => go("repayment")}
          onConfirm={(amount) => pay(amount)}
        />
      );
      break;
    case "new_date":
      view = (
        <NewDateScreen
          owed={owed}
          onBack={() => go("repayment")}
          onConfirm={(date) =>
            set({
              repay: { ...s.repay, newDate: date, usedDateChange: true },
              doneMessage: {
                title: `Your new date is ${date}. No extra cost.`,
              },
              screen: "repayment_done",
            })
          }
        />
      );
      break;
    case "repayment_done":
      view = <RepaymentDoneScreen {...s.doneMessage} onHome={home} />;
      break;
    default:
      view = (
        <HomeScreen
          balance={s.repay.wallet}
          advance={s.advance}
          repay={s.repay}
          status={s.status}
          onSeeOffer={() => go("checking")}
          onUploadPayslip={() => go("payslip_sent")}
          onOpenAdvance={() => go("repayment")}
        />
      );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 py-6 px-4">
      <ScenarioSwitcher
        scenarios={SCENARIOS}
        value={scenarioId}
        onChange={reset}
        onReset={() => reset()}
        problems={problems}
        onProblemsChange={(p) => {
          setProblems(p);
          setFailed({ check: false, send: false });
        }}
      />

      {/* Mobile frame */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-white rounded-[28px] shadow-xl overflow-hidden border border-neutral-300 shrink-0">
        <div key={s.screen} className="h-full">
          {view}
        </div>
        {s.screen === "home" && s.push && s.advance ? (
          <PushPreview
            message={reminderCopy(s.repay, owed)}
            onOpen={() => go("repayment")}
            onDismiss={() => set({ push: false })}
          />
        ) : null}
      </div>
    </div>
  );
}
