import { useEffect, useState } from "react";
import ScenarioSwitcher from "./prototype/ScenarioSwitcher.jsx";
import HomeScreen from "./salary-advance/HomeScreen.jsx";
import OfferScreen from "./salary-advance/OfferScreen.jsx";
import ReviewScreen from "./salary-advance/ReviewScreen.jsx";
import { DoneScreen, DeclinedScreen, PayslipSentScreen } from "./salary-advance/OutcomeScreens.jsx";
import { Waiting } from "./salary-advance/layout.jsx";
import { SCENARIOS, STARTING_BALANCE, disbursedFor } from "./salary-advance/data.js";

/**
 * NovaPay prototype: first-time salary advance.
 *
 * home → checking → offer → final checks → review (terms + accept) → done
 *                 ↘ declined → (payslip uploaded)
 */
export default function App() {
  const [scenarioId, setScenarioId] = useState("approved");
  const [screen, setScreen] = useState("home");
  const [requested, setRequested] = useState(null);
  const [advance, setAdvance] = useState(null); // { amount } once accepted
  const [status, setStatus] = useState(null); // null | "declined" | "needs_payslip" | "payslip_review"

  const scenario = SCENARIOS.find((s) => s.id === scenarioId);

  function reset(nextScenarioId = scenarioId) {
    setScenarioId(nextScenarioId);
    setScreen("home");
    setRequested(null);
    setAdvance(null);
    setStatus(null);
  }

  // Simulated network waits.
  useEffect(() => {
    if (screen !== "checking" && screen !== "final_checks") return;
    const t = setTimeout(() => {
      if (screen === "checking") setScreen(scenario.decline ? "declined" : "offer");
      else setScreen("review");
    }, 1200);
    return () => clearTimeout(t);
  }, [screen, scenario]);

  const home = () => setScreen("home");

  let view;
  switch (screen) {
    case "checking":
      view = <Waiting title="Salary advance" message="Checking what you can get…" />;
      break;
    case "offer":
      view = (
        <OfferScreen
          limit={scenario.limit}
          initialAmount={requested}
          onBack={home}
          onContinue={(amount) => {
            setRequested(amount);
            setScreen("final_checks");
          }}
        />
      );
      break;
    case "final_checks":
      view = <Waiting title="Salary advance" message="Running final checks…" />;
      break;
    case "review":
      view = (
        <ReviewScreen
          requested={requested}
          disbursed={disbursedFor(scenario, requested)}
          onBack={() => setScreen("offer")}
          onChangeAmount={() => {
            setRequested(null);
            setScreen("offer");
          }}
          onDecline={home}
          onAccept={() => {
            setAdvance({ amount: disbursedFor(scenario, requested) });
            setScreen("done");
          }}
        />
      );
      break;
    case "done":
      view = <DoneScreen amount={advance.amount} onHome={home} />;
      break;
    case "declined":
      view = (
        <DeclinedScreen
          reason={scenario.decline}
          onHome={() => {
            setStatus(scenario.decline === "income_unverified" ? "needs_payslip" : "declined");
            home();
          }}
          onUploadPayslip={() => setScreen("payslip_sent")}
        />
      );
      break;
    case "payslip_sent":
      view = (
        <PayslipSentScreen
          onHome={() => {
            setStatus("payslip_review");
            home();
          }}
        />
      );
      break;
    default:
      view = (
        <HomeScreen
          balance={STARTING_BALANCE + (advance ? advance.amount : 0)}
          advance={advance}
          status={status}
          onSeeOffer={() => setScreen("checking")}
          onUploadPayslip={() => setScreen("payslip_sent")}
        />
      );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 py-6 px-4">
      <ScenarioSwitcher scenarios={SCENARIOS} value={scenarioId} onChange={reset} onReset={() => reset()} />

      {/* Mobile frame */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-white rounded-[28px] shadow-xl overflow-hidden border border-neutral-300 shrink-0">
        {view}
      </div>
    </div>
  );
}
