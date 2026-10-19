import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { validateResetToken, resetPassword } = useAuth();
  const search = window.location.search;

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const tokenParam = params.get("token") ?? "";

    if (!tokenParam) {
      setValidating(false);
      setTokenValid(false);
      setError("Ce lien de réinitialisation est invalide ou manquant.");
      return;
    }

    setToken(tokenParam);
    void validateToken(tokenParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const validateToken = async (tokenParam: string) => {
    setValidating(true);
    setError("");
    try {
      const result = await validateResetToken(tokenParam);
      if (result.success) {
        setEmail(result.email ?? "votre compte");
        setTokenValid(true);
      } else {
        setTokenValid(false);
        setError(result.message ?? "Ce lien est invalide ou expiré.");
      }
    } catch {
      setTokenValid(false);
      setError("Ce lien est invalide ou expiré.");
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (!token) {
      setError("Jeton de réinitialisation invalide.");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(token, newPassword);
      if (result.success) {
        setResetSuccess(true);
        setTimeout(() => navigate({ to: "/login" }), 2000);
      } else {
        setError(result.message ?? "Impossible de réinitialiser le mot de passe.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de réinitialiser le mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="iemv-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

        .iemv-shell {
          --color-panel: #0B2545;
          --color-panel-alt: #0E3366;
          --color-bg: #F6F2E8;
          --color-text: #221F1B;
          --color-text-muted: #6B6357;
          --color-parchment-text: #F3EFE3;
          --color-parchment-muted: #A9BDB1;
          --color-accent: #C8933E;
          --color-accent-deep: #A6742A;
          --color-border: #E1D8C3;
          --color-error: #B3432B;
          --color-success: #3F6B4E;

          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
          font-family: 'IBM Plex Sans', system-ui, sans-serif;
          color: var(--color-text);
          background: var(--color-bg);
        }

        .iemv-brand {
          position: relative; background: var(--color-panel); color: var(--color-parchment-text);
          overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; padding: 48px 44px;
        }
        .iemv-ridges { position: absolute; inset: 0; pointer-events: none; opacity: 0.55; }
        .iemv-mark { display: flex; align-items: center; gap: 12px; position: relative; z-index: 1; }
        .iemv-mark-glyph {
          width: 38px; height: 38px; border: 1.5px solid var(--color-accent);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Fraunces', serif; font-size: 16px; font-weight: 500; flex-shrink: 0;
        }
        .iemv-mark-name {
          font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; font-weight: 500;
          letter-spacing: 0.02em; line-height: 1.3; color: var(--color-parchment-muted);
        }
        .iemv-brand-body { position: relative; z-index: 1; max-width: 420px; }
        .iemv-brand-body h1 {
          font-family: 'Fraunces', serif; font-weight: 500; font-size: clamp(28px, 3.4vw, 38px);
          line-height: 1.18; margin: 0 0 18px;
        }
        .iemv-brand-body p { font-size: 15px; line-height: 1.6; color: var(--color-parchment-muted); margin: 0; }
        .iemv-brand-foot {
          position: relative; z-index: 1; font-size: 12.5px; color: var(--color-parchment-muted);
          border-top: 1px solid rgba(243, 239, 227, 0.16); padding-top: 18px;
        }

        .iemv-formside { display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
        .iemv-formcard { width: 100%; max-width: 380px; text-align: left; }
        .iemv-formcard.centered { text-align: center; display: flex; flex-direction: column; align-items: center; }
        .iemv-formcard h2 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 27px; margin: 0 0 8px; }
        .iemv-formcard .iemv-subtitle { font-size: 14px; color: var(--color-text-muted); margin: 0 0 30px; line-height: 1.5; }

        .iemv-form { display: flex; flex-direction: column; gap: 18px; }
        .iemv-field { display: flex; flex-direction: column; gap: 7px; }
        .iemv-field label { font-size: 13px; font-weight: 500; color: var(--color-text); }
        .iemv-input-wrap { position: relative; display: flex; align-items: center; }
        .iemv-input {
          width: 100%; box-sizing: border-box; padding: 11px 13px; font-size: 14.5px;
          font-family: inherit; color: var(--color-text); background: #fff;
          border: 1px solid var(--color-border); border-radius: 3px; outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .iemv-input::placeholder { color: #B8AF9E; }
        .iemv-input:focus-visible { border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(200, 147, 62, 0.22); }
        .iemv-input[data-haspad="true"] { padding-right: 40px; }

        .iemv-toggle-visibility {
          position: absolute; right: 10px; background: none; border: none; cursor: pointer;
          color: var(--color-text-muted); display: flex; align-items: center; padding: 4px;
        }
        .iemv-toggle-visibility:hover { color: var(--color-text); }

        .iemv-btn-primary {
          width: 100%; box-sizing: border-box; padding: 12px 16px; background: var(--color-panel);
          color: var(--color-parchment-text); border: none; border-radius: 3px; font-size: 14.5px;
          font-weight: 600; font-family: inherit; cursor: pointer; transition: background 0.15s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .iemv-btn-primary:hover:not(:disabled) { background: var(--color-panel-alt); }
        .iemv-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .iemv-btn-ghost {
          width: 100%; box-sizing: border-box; padding: 11px 16px; background: transparent; color: var(--color-text);
          border: 1px solid var(--color-border); border-radius: 3px; font-size: 14px; font-weight: 500;
          font-family: inherit; cursor: pointer; transition: border-color 0.15s ease, background 0.15s ease;
        }
        .iemv-btn-ghost:hover:not(:disabled) { border-color: var(--color-panel); background: rgba(21, 48, 42, 0.04); }

        .iemv-notice { font-size: 13px; padding: 11px 13px; border-radius: 3px; margin-bottom: 4px; line-height: 1.5; }
        .iemv-notice.error { background: rgba(179, 67, 43, 0.08); color: var(--color-error); border: 1px solid rgba(179, 67, 43, 0.25); }

        .iemv-icon-badge {
          width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .iemv-icon-badge.error { background: rgba(179, 67, 43, 0.1); color: var(--color-error); }
        .iemv-icon-badge.success { background: rgba(63, 107, 78, 0.12); color: var(--color-success); }

        .iemv-spin { animation: iemv-spin 0.9s linear infinite; }
        @keyframes iemv-spin { to { transform: rotate(360deg); } }

        @media (max-width: 860px) {
          .iemv-shell { grid-template-columns: 1fr; }
          .iemv-brand { padding: 30px 26px; flex-direction: row; align-items: center; justify-content: space-between; gap: 16px; }
          .iemv-brand-body { display: none; }
          .iemv-brand-foot { display: none; }
          .iemv-formside { padding: 34px 22px 44px; }
        }
      `}</style>

      <div className="iemv-brand">
        <svg className="iemv-ridges" viewBox="0 0 500 700" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 480 L90 410 L150 450 L230 360 L300 430 L380 370 L500 460 L500 700 L0 700 Z" fill="#1D3F35" opacity="0.7" />
          <path d="M0 560 L70 520 L160 570 L240 500 L330 560 L420 500 L500 550 L500 700 L0 700 Z" fill="#234A3E" opacity="0.6" />
          <path d="M0 630 L100 600 L200 640 L320 590 L420 630 L500 610 L500 700 L0 700 Z" fill="#2A5647" opacity="0.55" />
        </svg>
        <div className="iemv-mark">
          <div className="iemv-mark-glyph">IEMV</div>
          <div className="iemv-mark-name">Institut d'Enseignement<br />Médical Virunga</div>
        </div>
        <div className="iemv-brand-body">
          <h1>Choisissez un mot de passe qui vous appartient.</h1>
          <p>Après cette étape, vous pourrez vous connecter avec votre nouveau mot de passe.</p>
        </div>
        <div className="iemv-brand-foot">
          Institut d'Enseignement Médical Virunga — espace réservé au personnel et aux étudiants
        </div>
      </div>

      <div className="iemv-formside">
        <div className={`iemv-formcard ${validating || !tokenValid || resetSuccess ? "centered" : ""}`}>
          {validating ? (
            <>
              <Loader2 size={40} className="iemv-spin" style={{ color: "var(--color-accent-deep)", marginBottom: 20 }} />
              <h2>Validation…</h2>
              <p className="iemv-subtitle">Vérification de votre lien de réinitialisation.</p>
            </>
          ) : !tokenValid ? (
            <>
              <div className="iemv-icon-badge error">
                <AlertCircle size={28} />
              </div>
              <h2>Lien invalide</h2>
              <p className="iemv-subtitle">{error || "Ce lien est invalide ou a expiré."}</p>
              <button type="button" className="iemv-btn-primary" onClick={() => navigate({ to: "/login" })}>
                Retour à la connexion
              </button>
              <button
                type="button"
                className="iemv-btn-ghost"
                style={{ marginTop: 12 }}
                onClick={() => navigate({ to: "/forgot-password" })}
              >
                Demander un nouveau lien
              </button>
            </>
          ) : resetSuccess ? (
            <>
              <div className="iemv-icon-badge success">
                <CheckCircle2 size={28} />
              </div>
              <h2>Mot de passe mis à jour</h2>
              <p className="iemv-subtitle">Redirection vers la connexion…</p>
              <button type="button" className="iemv-btn-primary" onClick={() => navigate({ to: "/login" })}>
                Aller à la connexion
              </button>
            </>
          ) : (
            <>
              <h2>Nouveau mot de passe</h2>
              <p className="iemv-subtitle">Pour {email} · au moins 6 caractères</p>

              <form onSubmit={handleSubmit} className="iemv-form" noValidate>
                {error ? <div className="iemv-notice error">{error}</div> : null}

                <div className="iemv-field">
                  <label htmlFor="newPassword">Nouveau mot de passe</label>
                  <div className="iemv-input-wrap">
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      className="iemv-input"
                      data-haspad="true"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="iemv-toggle-visibility"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="iemv-field">
                  <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                  <div className="iemv-input-wrap">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      className="iemv-input"
                      data-haspad="true"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="iemv-toggle-visibility"
                      onClick={() => setShowConfirm((v) => !v)}
                      tabIndex={-1}
                      aria-label={showConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="iemv-btn-primary" disabled={loading}>
                  {loading ? <Loader2 size={16} className="iemv-spin" /> : null}
                  {loading ? "Réinitialisation…" : "Réinitialiser le mot de passe"}
                </button>

                <button type="button" className="iemv-btn-ghost" onClick={() => navigate({ to: "/login" })} disabled={loading}>
                  ← Retour à la connexion
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;