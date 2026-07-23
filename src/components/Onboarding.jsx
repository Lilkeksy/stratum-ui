import { useState } from "react";
import { ArrowRight, Layers, MousePointer2, ScanText, ShieldCheck } from "lucide-react";
import StratumLogo from "./StratumLogo";
import { useI18n } from "../i18n/context";
import "./Onboarding.css";

function Onboarding({ onFinish }) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const steps = [
    { Icon: Layers, title: t("Welcome to Stratum"), description: t("Try the demo first. Create an account only when you want to upload, save, or compare your own policies.") },
    { Icon: MousePointer2, title: t("Highlight any text"), description: t("Works anywhere — a website, a PDF, or another app. Not just inside Stratum.") },
    { Icon: ScanText, title: t("Tap “Summarize with Stratum”"), description: t("It appears next to copy and cut wherever you highlight text.") },
    { Icon: ShieldCheck, title: t("Get a plain-language summary"), description: t("Quickly understand what you are agreeing to, with risky clauses flagged.") },
  ];
  const activeStep = steps[step];
  const ActiveIcon = activeStep.Icon;
  const isLastStep = step === steps.length - 1;
  const handleNext = () => isLastStep ? onFinish() : setStep((current) => current + 1);

  return (
    <div className="onboarding-overlay">
      <section className="onboarding-card" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
        <header className="onboarding-header">
          <StratumLogo size={32} textSize={17} />
          <span className="onboarding-counter">{String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
        </header>

        <div className="onboarding-layout">
          <div className="onboarding-visual" aria-hidden="true">
            <div className="onboarding-icon-ring">
              <div className="onboarding-icon"><ActiveIcon size={48} strokeWidth={1.55} /></div>
            </div>
            <span className="onboarding-visual-line" />
          </div>

          <div className="onboarding-content">
            <span className="onboarding-kicker">{t("Compliance Intelligence")}</span>
            <h2 className="onboarding-title" id="onboarding-title">{activeStep.title}</h2>
            <p className="onboarding-description">{activeStep.description}</p>

            <div className="onboarding-dots" aria-label={`${step + 1} / ${steps.length}`}>
              {steps.map((_, index) => (
                <span key={index} className={`onboarding-dot ${index === step ? "active" : ""}`} />
              ))}
            </div>

            <div className="onboarding-actions">
              <button className="onboarding-skip" onClick={onFinish}>{t("Skip")}</button>
              <button className="onboarding-next" onClick={handleNext}>
                {isLastStep ? t("Try the Demo") : t("Next")}
                <ArrowRight size={17} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Onboarding;
