import { useI18n } from "../i18n/context";

function StratumMark({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <path
        d="M24 4.5 43 14.9 24 25.3 5 14.9 24 4.5Z"
        fill="#005BB3"
      />
      <path
        d="m8.4 21.7 15.6 8.6 15.6-8.6 3.4 1.9L24 34 5 23.6l3.4-1.9Z"
        fill="#007056"
      />
      <path
        d="m8.4 30 15.6 8.6L39.6 30l3.4 1.9L24 42.3 5 31.9 8.4 30Z"
        fill="#005BB3"
        opacity="0.72"
      />
    </svg>
  );
}

function StratumLogo({ size = 28, showText = true, textSize = 16, showTagline = false }) {
  const { t } = useI18n();

  return (
    <div
      aria-label="Stratum"
      style={{ display: "flex", alignItems: "center", gap: size * 0.34 }}
    >
      <StratumMark size={size} />

      {showText && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.08 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: textSize,
              fontWeight: 650,
              letterSpacing: "-0.025em",
              color: "var(--color-dark)",
            }}
          >
            Stratum
          </span>
          {showTagline && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 8,
                fontWeight: 650,
                letterSpacing: "0.08em",
                maxWidth: 130,
                color: "var(--color-mute)",
                textTransform: "uppercase",
              }}
            >
              {t("Compliance Intelligence")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default StratumLogo;
