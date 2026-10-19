import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

/* ------------------------------------------------------------------ */
/*  Institut d'Enseignement Mdical Virunga  page de connexion        */
/*  Accounts are provisioned by the admin; there is no self-service    */
/*  registration. Users log in with the credentials they were given    */
/*  and can reset their password via "Mot de passe oubli".            */
/* ------------------------------------------------------------------ */

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"login" | "otp">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Champs manquants",
        description: "Renseignez votre e-mail et votre mot de passe.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.needsOtp) {
        setStep("otp");
        setOtp("");
        toast({
          title: "Code envoy",
          description: result.message || "Vrifiez votre bote e-mail.",
        });
      } else if (!result.success) {
        toast({
          title: "chec de la connexion",
          description: result.message || "Identifiants invalides.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "chec de la connexion",
        description: error instanceof Error ? error.message : "Identifiants invalides.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Code invalide",
        description: "Saisissez le code  6 chiffres.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const result = await verifyOtp(email, otp);

      if (!result.success) {
        throw new Error(result.message || "Verification failed");
      }

      // Role resolution order:
      //   1. result.user.role (fresh from the OTP response)
      //   2. localStorage user object
      //   3. decode the JWT payload
      //   4. fall back to "eleve"
      const returnedRole = result?.user?.role;

      const storedRaw =
        typeof window !== "undefined"
          ? localStorage.getItem("scolagest-auth-user")
          : null;
      let storedRole: string | undefined;
      try { storedRole = storedRaw ? JSON.parse(storedRaw)?.role : undefined; } catch { storedRole = undefined; }

      let jwtRole: string | undefined;
      try {
        const token = typeof window !== "undefined"
          ? localStorage.getItem("scolagest-auth-token")
          : null;
        if (token) {
          const parts = token.split(".");
          if (parts.length >= 2) {
            const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
            const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
            const payload = JSON.parse(atob(padded));
            jwtRole = payload.role ?? payload.authorities;
          }
        }
      } catch { jwtRole = undefined; }

      const normalize = (r: string | undefined) =>
        (r ?? "").toString().trim().toUpperCase().replace(/^ROLE_/, "");

      const rawRole = normalize(returnedRole) || normalize(storedRole) || normalize(jwtRole);

      const role =
        (rawRole === "ADMIN" || rawRole === "ADMINISTRATOR" || rawRole === "ADMINISTRATEUR") ? "admin" :
        (rawRole === "TEACHER" || rawRole === "TITULAIRE" || rawRole === "ENSEIGNANT") ? "enseignant" :
        (rawRole === "STUDENT" || rawRole === "ELEVE") ? "eleve" :
        "eleve";

      // Route by role  each role lands on its own space.
      const target =
        role === "admin" ? "/dashboard" :
        role === "enseignant" ? "/teacher" :
        role === "eleve" ? "/eleve" :
        "/";

      toast({
        title: "Content de vous revoir !",
        description: "Connexion russie.",
      });

      navigate(target, { replace: true });
    } catch (error: unknown) {
      toast({
        title: "chec de la vrification",
        description: error instanceof Error ? error.message : "Code invalide.",
        variant: "destructive",
      });
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const result = await login(email, password);
      if (result.needsOtp) {
        toast({
          title: "Code renvoy",
          description: "Un nouveau code a t envoy  votre e-mail.",
        });
        setOtp("");
      }
    } catch {
      toast({ title: "chec de l'envoi", variant: "destructive" });
    } finally {
      setResendLoading(false);
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

          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
          font-family: 'IBM Plex Sans', system-ui, sans-serif;
          color: var(--color-text);
          background: var(--color-bg);
        }

        .iemv-brand {
          position: relative;
          background: var(--color-panel);
          color: var(--color-parchment-text);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 44px;
        }

        .iemv-ridges {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.55;
        }

        .iemv-mark {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .iemv-mark-glyph {
          width: 38px;
          height: 38px;
          border: 1.5px solid var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fraunces', serif;
          font-size: 16px;
          font-weight: 500;
          flex-shrink: 0;
        }

        .iemv-mark-name {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
          line-height: 1.3;
          color: var(--color-parchment-muted);
        }

        .iemv-brand-body {
          position: relative;
          z-index: 1;
          max-width: 420px;
        }

        .iemv-brand-body h1 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: clamp(28px, 3.4vw, 38px);
          line-height: 1.18;
          margin: 0 0 18px;
        }

        .iemv-brand-body p {
          font-size: 15px;
          line-height: 1.6;
          color: var(--color-parchment-muted);
          margin: 0;
        }

        .iemv-brand-foot {
          position: relative;
          z-index: 1;
          font-size: 12.5px;
          color: var(--color-parchment-muted);
          border-top: 1px solid rgba(243, 239, 227, 0.16);
          padding-top: 18px;
        }

        .iemv-formside {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .iemv-formcard {
          width: 100%;
          max-width: 380px;
        }

        .iemv-formcard h2 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 27px;
          margin: 0 0 8px;
        }

        .iemv-formcard .iemv-subtitle {
          font-size: 14px;
          color: var(--color-text-muted);
          margin: 0 0 30px;
          line-height: 1.5;
        }

        .iemv-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .iemv-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .iemv-field label {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text);
        }

        .iemv-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .iemv-input {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 13px;
          font-size: 14.5px;
          font-family: inherit;
          color: var(--color-text);
          background: #fff;
          border: 1px solid var(--color-border);
          border-radius: 3px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .iemv-input::placeholder {
          color: #B8AF9E;
        }

        .iemv-input:focus-visible {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(200, 147, 62, 0.22);
        }

        .iemv-input[data-haspad="true"] {
          padding-right: 40px;
        }

        .iemv-otp-input {
          letter-spacing: 0.5em;
          font-size: 20px;
          text-align: center;
          font-family: 'IBM Plex Sans', sans-serif;
          font-weight: 500;
        }

        .iemv-toggle-visibility {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .iemv-toggle-visibility:hover {
          color: var(--color-text);
        }

        .iemv-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .iemv-remember {
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--color-text-muted);
          cursor: pointer;
        }

        .iemv-remember input {
          accent-color: var(--color-panel);
          width: 14px;
          height: 14px;
        }

        .iemv-link {
          color: var(--color-panel);
          font-weight: 600;
          text-decoration: none;
        }

        .iemv-link:hover {
          text-decoration: underline;
        }

        .iemv-btn-primary {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 16px;
          background: var(--color-panel);
          color: var(--color-parchment-text);
          border: none;
          border-radius: 3px;
          font-size: 14.5px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .iemv-btn-primary:hover:not(:disabled) {
          background: var(--color-panel-alt);
        }

        .iemv-btn-primary:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }

        .iemv-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .iemv-btn-ghost {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 16px;
          background: transparent;
          color: var(--color-text);
          border: 1px solid var(--color-border);
          border-radius: 3px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }

        .iemv-btn-ghost:hover:not(:disabled) {
          border-color: var(--color-panel);
          background: rgba(21, 48, 42, 0.04);
        }

        .iemv-btn-ghost:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }

        .iemv-btn-ghost:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .iemv-btn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--color-text-muted);
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          padding: 4px 0;
        }

        .iemv-btn-back:hover:not(:disabled) {
          color: var(--color-text);
        }

        .iemv-footline {
          text-align: center;
          font-size: 13px;
          color: var(--color-text-muted);
          margin: 4px 0 0;
        }

        @media (max-width: 860px) {
          .iemv-shell {
            grid-template-columns: 1fr;
          }
          .iemv-brand {
            padding: 30px 26px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
          }
          .iemv-brand-body { display: none; }
          .iemv-brand-foot { display: none; }
          .iemv-formside { padding: 34px 22px 44px; }
        }
      `}</style>

      {/* Identity panel */}
      <div className="iemv-brand">
        <svg className="iemv-ridges" viewBox="0 0 500 700" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 480 L90 410 L150 450 L230 360 L300 430 L380 370 L500 460 L500 700 L0 700 Z" fill="#1D3F35" opacity="0.7" />
          <path d="M0 560 L70 520 L160 570 L240 500 L330 560 L420 500 L500 550 L500 700 L0 700 Z" fill="#234A3E" opacity="0.6" />
          <path d="M0 630 L100 600 L200 640 L320 590 L420 630 L500 610 L500 700 L0 700 Z" fill="#2A5647" opacity="0.55" />
        </svg>

        <div className="iemv-mark">
          <div className="iemv-mark-glyph">IEMV</div>
          <div className="iemv-mark-name">
            Institut d'Enseignement<br />Mdical Virunga
          </div>
        </div>

        <div className="iemv-brand-body">
          <h1>Former les soignants qui veillent sur nos communauts.</h1>
          <p>
            Accdez  votre espace tudiant ou administratif pour suivre vos cours,
            vos rsultats et vos dmarches  l'institut.
          </p>
        </div>

        <div className="iemv-brand-foot">
          Institut d'Enseignement Mdical Virunga  espace rserv au personnel et aux tudiants
        </div>
      </div>

      {/* Form panel */}
      <div className="iemv-formside">
        <div className="iemv-formcard">
          {step === "login" ? (
            <>
              <h2>Connexion</h2>
              <p className="iemv-subtitle">Utilisez l'e-mail et le mot de passe fournis par l'institut</p>

              <form onSubmit={handleLoginSubmit} className="iemv-form" noValidate>
                <div className="iemv-field">
                  <label htmlFor="email">Adresse e-mail</label>
                  <div className="iemv-input-wrap">
                    <input
                      id="email"
                      type="email"
                      className="iemv-input"
                      placeholder="vous@iemv.edu.cd"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="iemv-field">
                  <label htmlFor="password">Mot de passe</label>
                  <div className="iemv-input-wrap">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="iemv-input"
                      data-haspad="true"
                      placeholder="Saisissez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="iemv-toggle-visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="iemv-row">
                  <label className="iemv-remember">
                    <input type="checkbox" />
                    Se souvenir de moi
                  </label>
                  <Link to="/forgot-password" className="iemv-link">
                    Mot de passe oubli ?
                  </Link>
                </div>

                <button type="submit" className="iemv-btn-primary" disabled={loading}>
                  {loading ? "Connexion" : "Se connecter"}
                </button>

                <p className="iemv-footline">
                  Un compte vous a t cr par l'administration. Besoin d'aide ?{" "}
                  <Link to="/forgot-password" className="iemv-link">
                    Rcuprer mon mot de passe
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <>
              <h2>Vrification</h2>
              <p className="iemv-subtitle">Un code  6 chiffres a t envoy  {email}</p>

              <form onSubmit={handleOtpSubmit} className="iemv-form" noValidate>
                <div className="iemv-field">
                  <label htmlFor="otp">Code  usage unique</label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    className="iemv-input iemv-otp-input"
                    placeholder=""
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <button type="submit" className="iemv-btn-primary" disabled={loading}>
                  {loading ? "Vrification" : "Vrifier et continuer"}
                </button>

                <button
                  type="button"
                  className="iemv-btn-ghost"
                  onClick={handleResendOtp}
                  disabled={loading || resendLoading}
                >
                  {resendLoading ? "Envoi en cours" : "Renvoyer le code"}
                </button>

                <button
                  type="button"
                  className="iemv-btn-back"
                  onClick={() => {
                    setStep("login");
                    setOtp("");
                  }}
                  disabled={loading}
                >
                  <ArrowLeft size={14} />
                  Retour  la connexion
                </button>
              </form>

        {/* Student portal entry */}
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid #E4E8EF", textAlign: "center" }}>
          <p style={{ fontSize: 12.5, color: "#94A3B8", margin: "0 0 10px" }}>
            Vous etes un eleve ?
          </p>
          <Link
            to="/student/login"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "10px 16px", borderRadius: 6, border: "1px solid #0B1B3A", background: "#fff", color: "#0B1B3A", fontWeight: 600, fontSize: 13.5, textDecoration: "none" }}
          >
            Je suis un eleve
          </Link>
        </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
