// src/pages/student/StudentLogin.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { studentAuthApi } from "@/lib/studentAuthApi";

export default function StudentLogin() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setBusy(true);
    try {
      const r = await studentAuthApi.login(fullName, password);
      localStorage.setItem("token", r.token);
      localStorage.setItem("user", JSON.stringify(r.user));
      navigate("/eleve");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally { setBusy(false); }
  };

  const s: React.CSSProperties = {
    width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1",
    borderRadius: 6, fontSize: 14, fontFamily: "inherit", marginBottom: 12,
  };
  const label: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4,
  };
  const btn: React.CSSProperties = {
    width: "100%", padding: "11px 16px", background: "#0B1B3A", color: "#fff",
    border: 0, borderRadius: 6, fontWeight: 700, fontSize: 14, cursor: "pointer",
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 24, fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1B3A", margin: "0 0 6px" }}>
        Espace eleve
      </h1>
      <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 20px" }}>
        Connectez-vous avec votre nom complet et votre mot de passe.
      </p>

      {error && (
        <div style={{ background: "#FDECEC", color: "#7A2626", border: "1px solid #F3C6C6",
                      borderRadius: 6, padding: "10px 12px", marginBottom: 14, fontSize: 13 }}>
          {error}
        </div>
      )}

      <form onSubmit={submit}>
        <label style={label}>Nom complet</label>
        <input style={s} value={fullName} onChange={(e) => setFullName(e.target.value)}
               placeholder="Ex. ELANGA BONGONDA" required />
        <label style={label}>Mot de passe</label>
        <input style={s} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={btn} disabled={busy}>
          {busy ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: 13, color: "#64748b", textAlign: "center" }}>
        <Link to="/student/register" style={{ color: "#0B1B3A", fontWeight: 600 }}>Activer un compte</Link>
        {" · "}
        <Link to="/student/reset" style={{ color: "#0B1B3A", fontWeight: 600 }}>Mot de passe oublie</Link>
      </p>
    </div>
  );
}