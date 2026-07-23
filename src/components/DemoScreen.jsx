import { useRef } from "react";
import { useI18n } from "../i18n/context";
import Overlay from "./overlay";
import ResultCard from "./ResultCard";
import "./DemoScreen.css";

function DemoScreen({ showOverlay, overlayPos, setShowOverlay, setOverlayPos, cardStatus, setCardStatus, handleSummarizeClick }) {
  const { t } = useI18n();
  const containerRef = useRef(null);

  const handleSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (!text || !selection.rangeCount || !containerRef.current) {
      setShowOverlay(false);
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const cardWidth = Math.min(340, Math.max(240, containerRect.width - 24));
    const preferredX = rect.left - containerRect.left + (rect.width / 2) - (cardWidth / 2);
    const maxX = Math.max(12, containerRect.width - cardWidth - 12);

    setOverlayPos({
      x: Math.min(Math.max(12, preferredX), maxX),
      y: Math.max(12, rect.top - containerRect.top - 42),
    });
    setShowOverlay(true);
  };

  const policy = t("By using this service, you agree that we may collect, store, and share your usage data with third-party advertising partners. This agreement includes a binding arbitration clause, meaning you waive your right to a jury trial or to join a class-action lawsuit. Your subscription will automatically renew at the end of each billing cycle unless canceled at least 48 hours in advance. We reserve the right to update these terms at any time without direct notice.");

  return (
    <div className="demo-screen" ref={containerRef}>
      <h1 className="demo-title">{t("Try it out")}</h1>
      <p className="demo-hint">{t("Highlight any part of the sample policy below to see Stratum in action.")}</p>

      <div className="demo-policy-card" onMouseUp={handleSelection} onTouchEnd={handleSelection}>
        <span className="demo-policy-source">{t("StreamHub — Terms of Service")}</span>
        <p className="demo-policy-text">{policy}</p>
      </div>

      {showOverlay && (
        <div className="demo-floating-control" style={{ top: overlayPos.y, left: overlayPos.x }}>
          <Overlay x={0} y={0} onSummarizeClick={handleSummarizeClick} />
        </div>
      )}

      {cardStatus && (
        <div className="demo-floating-result" style={{ top: overlayPos.y + 45, left: overlayPos.x }}>
          <ResultCard
            status={cardStatus}
            summary={t("This service can share your data with advertisers, and you are giving up your right to a jury trial or class action.")}
            flags={[
              { label: t("Auto-renewal clause detected"), level: "high" },
              { label: t("Arbitration clause detected"), level: "high" },
              { label: t("Data shared with advertising partners"), level: "moderate" },
            ]}
            onClose={() => setCardStatus(null)}
          />
        </div>
      )}
    </div>
  );
}

export default DemoScreen;
