import StratumLogo from "./StratumLogo";
import { useI18n } from "../i18n/context";
import "./SessionBoot.css";

function SessionBoot() {
  const { t } = useI18n();

  return (
    <main className="session-boot" aria-busy="true" aria-live="polite">
      <span className="session-boot-sr">{t("Restoring your session…")}</span>
      <div className="session-boot-mark" aria-hidden="true">
        <StratumLogo size={38} textSize={19} />
      </div>
    </main>
  );
}

export default SessionBoot;
