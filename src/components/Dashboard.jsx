import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3, FileCheck2, FolderOpen, ShieldAlert, Upload } from "lucide-react";
import { policyApi } from "../lib/api";
import { useI18n } from "../i18n/context";
import "./Dashboard.css";

const pendingStatuses = new Set(["uploaded", "processing", "extracted", "summarizing"]);

function Dashboard({ user, onLoginClick, onUploadClick, onOpenLibrary, refreshKey = 0 }) {
  const { locale, t } = useI18n();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return undefined;
    let active = true;
    let timer;

    const loadDocuments = async () => {
      try {
        const result = await policyApi.list();
        if (!active) return;
        const nextDocuments = result.documents || [];
        setDocuments(nextDocuments);
        setError("");
        if (nextDocuments.some((document) => pendingStatuses.has(document.status))) {
          timer = window.setTimeout(loadDocuments, 4000);
        }
      } catch (requestError) {
        if (active) setError(requestError.message || t("Unable to load uploaded policies."));
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadDocuments();
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [refreshKey, t, user]);

  const stats = useMemo(() => {
    const ready = documents.filter((document) => document.status === "ready" && document.summary);
    return {
      total: documents.length,
      ready: ready.length,
      high: ready.filter((document) => document.summary?.risk_level === "high").length,
      processing: documents.filter((document) => pendingStatuses.has(document.status)).length,
      risks: {
        low: ready.filter((document) => document.summary?.risk_level === "low").length,
        medium: ready.filter((document) => document.summary?.risk_level === "medium").length,
        high: ready.filter((document) => document.summary?.risk_level === "high").length,
      },
    };
  }, [documents]);

  const recent = useMemo(
    () => [...documents].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
    [documents],
  );
  const formatDate = (value) => new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

  if (!user) return (
    <main className="dashboard dashboard--guest">
      <div className="dashboard-signed-out-card">
        <div className="dashboard-signed-out-icon"><FileCheck2 size={22} strokeWidth={1.8} aria-hidden="true" /></div>
        <h1 className="dashboard-signed-out-title">{t("Keep your policy reviews in one place")}</h1>
        <p className="dashboard-signed-out-description">{t("Log in or create an account to see your documents, scanned policies, and account details here.")}</p>
        <button className="dashboard-primary-button" onClick={onLoginClick}>{t("Log in / Sign up")}<ArrowRight size={16} /></button>
      </div>
    </main>
  );

  const firstName = user.name?.split(" ")[0] || t("there");

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">{t("Your workspace")}</span>
          <h1>{t("Welcome back")}, {firstName}</h1>
          <p>{t("Here is what is happening with your policy library.")}</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="dashboard-secondary-button" onClick={onOpenLibrary}><FolderOpen size={16} strokeWidth={1.8} />{t("Open library")}</button>
          <button className="dashboard-primary-button" onClick={onUploadClick}><Upload size={16} strokeWidth={1.8} />{t("Upload Policy")}</button>
        </div>
      </header>

      {error && <p className="dashboard-error" role="alert">{error}</p>}

      <section className="dashboard-stat-grid" aria-label={t("Policy totals")}>
        <article className="dashboard-stat-card">
          <span className="dashboard-stat-icon"><FolderOpen size={17} strokeWidth={1.8} /></span>
          <span className="dashboard-stat-value">{loading ? "—" : stats.total}</span>
          <span className="dashboard-stat-label">{t("Total policies")}</span>
        </article>
        <article className="dashboard-stat-card">
          <span className="dashboard-stat-icon is-ready"><FileCheck2 size={17} strokeWidth={1.8} /></span>
          <span className="dashboard-stat-value">{loading ? "—" : stats.ready}</span>
          <span className="dashboard-stat-label">{t("Ready to review")}</span>
        </article>
        <article className="dashboard-stat-card">
          <span className="dashboard-stat-icon is-risk"><ShieldAlert size={17} strokeWidth={1.8} /></span>
          <span className="dashboard-stat-value">{loading ? "—" : stats.high}</span>
          <span className="dashboard-stat-label">{t("High-risk policies")}</span>
        </article>
        <article className="dashboard-stat-card">
          <span className="dashboard-stat-icon is-processing"><Clock3 size={17} strokeWidth={1.8} /></span>
          <span className="dashboard-stat-value">{loading ? "—" : stats.processing}</span>
          <span className="dashboard-stat-label">{t("Processing now")}</span>
        </article>
      </section>

      <section className="dashboard-content-grid">
        <article className="dashboard-panel dashboard-recent-panel">
          <div className="dashboard-panel-heading">
            <div><h2>{t("Recent policies")}</h2><p>{t("Your latest uploads and their review status.")}</p></div>
            {documents.length > 0 && <button onClick={onOpenLibrary}>{t("View all")}<ArrowRight size={14} /></button>}
          </div>

          {loading ? (
            <div className="dashboard-loading-list"><span /><span /><span /></div>
          ) : recent.length === 0 ? (
            <div className="dashboard-empty">
              <FileCheck2 size={22} strokeWidth={1.6} />
              <h3>{t("No uploaded policies yet.")}</h3>
              <p>{t("Upload your first policy to start building a private review history.")}</p>
              <button onClick={onUploadClick}>{t("Upload Policy")}</button>
            </div>
          ) : (
            <div className="dashboard-policy-list">
              {recent.map((document) => {
                const risk = document.summary?.risk_level;
                return (
                  <button key={document.id} className="dashboard-policy-row" onClick={onOpenLibrary}>
                    <span className="dashboard-policy-file"><FileCheck2 size={17} strokeWidth={1.8} /></span>
                    <span className="dashboard-policy-copy">
                      <strong title={document.original_name}>{document.original_name}</strong>
                      <small>{formatDate(document.created_at)}{document.word_count ? ` · ${document.word_count.toLocaleString(locale)} ${t("words")}` : ""}</small>
                    </span>
                    <span className={`dashboard-status ${risk ? `risk-${risk}` : document.status}`}>
                      {risk ? `${t(risk)} ${t("risk")}` : document.status === "ready" ? t("Ready") : t(document.status)}
                    </span>
                    <ArrowRight className="dashboard-row-arrow" size={15} strokeWidth={1.8} />
                  </button>
                );
              })}
            </div>
          )}
        </article>

        <aside className="dashboard-side-column">
          <article className="dashboard-panel dashboard-risk-panel">
            <div className="dashboard-panel-heading"><div><h2>{t("Risk overview")}</h2><p>{t("Based on completed policy summaries.")}</p></div></div>
            <div className="dashboard-risk-total"><span>{stats.ready}</span>{t("reviewed")}</div>
            <div className="dashboard-risk-bar" aria-hidden="true">
              {stats.ready > 0 && <>
                <span className="low" style={{ width: `${(stats.risks.low / stats.ready) * 100}%` }} />
                <span className="medium" style={{ width: `${(stats.risks.medium / stats.ready) * 100}%` }} />
                <span className="high" style={{ width: `${(stats.risks.high / stats.ready) * 100}%` }} />
              </>}
            </div>
            <div className="dashboard-risk-legend">
              {["low", "medium", "high"].map((level) => <div key={level}><span className={level} /><strong>{stats.risks[level]}</strong><small>{t(level)} {t("risk")}</small></div>)}
            </div>
          </article>

          <article className="dashboard-account-card">
            <div className="dashboard-avatar">{user.initials}</div>
            <div><strong>{user.name}</strong><span>{user.email || user.phone || t("Supabase account")}</span></div>
            <span className="dashboard-plan">{t("Free Plan")}</span>
          </article>
        </aside>
      </section>
    </main>
  );
}

export default Dashboard;
