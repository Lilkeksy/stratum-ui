import { useState } from "react";
import { Eye, EyeOff, FileCheck2, LockKeyhole, X } from "lucide-react";
import StratumLogo from "./StratumLogo";
import { useI18n } from "../i18n/context";
import "./AuthPage.css";

function AuthPage({ mode, initialError = "", onSwitchMode, onSubmit, onClose }) {
  const { t } = useI18n();
  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(initialError);
  const [notice, setNotice] = useState("");


  const title = isLogin ? t("Welcome back") : isSignup ? t("Create your account") : isForgot ? t("Reset your password") : t("Choose a new password");
  const subtitle = isLogin ? t("Log in to continue to Stratum") : isSignup ? t("Create a private workspace for your policies") : isForgot ? t("We will email you a secure reset link") : t("Use at least 8 characters for your new password");
  const submitLabel = isLogin ? t("Log in") : isSignup ? t("Create account") : isForgot ? t("Send reset link") : t("Update password");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (isReset && password !== confirmPassword) {
      setError(t("The passwords do not match."));
      return;
    }
    setSubmitting(true);
    try {
      const result = await onSubmit({ mode, contactMethod: "email", name, contact, password });
      if (result.requiresVerification) {
        setNotice(t("Check your email to confirm your account, then log in."));
      }
      if (isForgot) setNotice(result.message);
    } catch (requestError) {
      setError(requestError.message || t("Authentication failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (nextMode) => {
    setError("");
    setNotice("");
    setPassword("");
    setConfirmPassword("");
    onSwitchMode(nextMode);
  };

  const passwordType = showPassword ? "text" : "password";

  return (
    <main className="auth-page">
      <section className="auth-story" aria-label={t("Why Stratum")}>
        <StratumLogo size={38} textSize={21} />
        <div className="auth-story-copy">
          <span className="auth-eyebrow">{t("Clarity before consent")}</span>
          <h2>{t("Understand the terms. Keep the evidence.")}</h2>
          <p>{t("Stratum turns dense policies into clear, traceable takeaways so you can decide with confidence.")}</p>
        </div>

        <div className="auth-policy-preview" aria-hidden="true">
          <div className="auth-preview-top">
            <span className="auth-preview-file"><FileCheck2 size={17} strokeWidth={1.8} /></span>
            <span className="auth-preview-name">privacy-policy.pdf</span>
            <span className="auth-preview-status">{t("Ready")}</span>
          </div>
          <div className="auth-preview-line auth-preview-line--wide" />
          <div className="auth-preview-line" />
          <div className="auth-preview-tags">
            <span>{t("Data practices")}</span>
            <span>{t("User rights")}</span>
            <span>{t("Financial and cancellation terms")}</span>
          </div>
          <div className="auth-preview-source">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="auth-trust-note">
          <LockKeyhole size={16} strokeWidth={1.8} aria-hidden="true" />
          <div><strong>{t("Private workspace")}</strong><span>{t("Your documents stay tied to your account.")}</span></div>
        </div>
      </section>

      <section className="auth-panel">
        <button type="button" className="auth-close" onClick={onClose} aria-label={t("Close authentication")}>
          <X size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>

        <div className="auth-card">
          <div className="auth-mobile-logo"><StratumLogo size={34} textSize={19} /></div>
          <div className="auth-heading">
            <h1 className="auth-title">{title}</h1>
            <p className="auth-subtitle">{subtitle}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="auth-field" htmlFor="auth-name">
                <span>{t("Full name")}</span>
                <input id="auth-name" type="text" className="auth-input" placeholder={t("Your name")} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
              </label>
            )}

            {!isReset && (
              <label className="auth-field" htmlFor="auth-contact">
                <span>{t("Email address")}</span>
                <input id="auth-contact" type="email" className="auth-input" placeholder="name@example.com" value={contact} onChange={(event) => setContact(event.target.value)} autoComplete="email" required />
              </label>
            )}

            {!isForgot && (
              <label className="auth-field" htmlFor="auth-password">
                <span>{isReset ? t("New password") : t("Password")}</span>
                <span className="auth-password-wrap">
                  <input id="auth-password" type={passwordType} className="auth-input" placeholder={isReset ? t("New password") : t("Password")} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isLogin ? "current-password" : "new-password"} minLength={8} required />
                  <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((current) => !current)} aria-label={t(showPassword ? "Hide password" : "Show password")}>
                    {showPassword ? <EyeOff size={17} strokeWidth={1.8} /> : <Eye size={17} strokeWidth={1.8} />}
                  </button>
                </span>
              </label>
            )}

            {isReset && (
              <label className="auth-field" htmlFor="auth-confirm-password">
                <span>{t("Confirm new password")}</span>
                <input id="auth-confirm-password" type={passwordType} className="auth-input" placeholder={t("Confirm new password")} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
              </label>
            )}

            {isLogin && <button type="button" className="auth-forgot" onClick={() => switchMode("forgot")}>{t("Forgot password?")}</button>}
            {error && <p className="auth-feedback auth-feedback--error" role="alert">{error}</p>}
            {notice && <p className="auth-feedback auth-feedback--success" role="status">{notice}</p>}
            <button type="submit" className="auth-submit" disabled={submitting}>{submitting ? t("Please wait…") : submitLabel}</button>
          </form>

          {!isReset && (
            <p className="auth-switch">
              {isForgot ? t("Remembered your password?") : isLogin ? t("Do not have an account?") : t("Already have an account?")}{" "}
              <button type="button" className="auth-switch-link" onClick={() => switchMode(isSignup || isForgot ? "login" : "signup")}>{isLogin ? t("Sign up") : t("Log in")}</button>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default AuthPage;
