// src/pages/student/StudentReset.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { studentAuthApi } from "@/lib/studentAuthApi";

export default function StudentReset() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"name" | "password">("name");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submitName = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setInfo(null); setBusy(true);
    try {
      const r = await studentAuthApi.forgot(fullName);
      setEmail(r.email); setInfo(r.message); setStep("password");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally { setBusy(false); }
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("6 caracteres minimum."); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    setError(null); setBusy(true);
    try {
      await studentAuthApi.reset(email, otp, password);
      alert("Mot de passe mis a jour. Connectez-vous.");
      navigate("/student/login");
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
        Reinitialiser mon mot de passe
      </h1>
      <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 20px" }}>
        {step === "name"
          ? "Entrez votre nom complet pour recevoir un code par email."
          : `Un code a ete envoye a ${email}. Entrez-le puis choisissez un nouveau mot de passe.`}
      </p>

      {error && (
        <div style={{ background: "#FDECEC", color: "#7A2626", border: "1px solid #F3C6C6",
                      borderRadius: 6, padding: "10px 12px", marginBottom: 14, fontSize: 13 }}>
          {error}
        </div>
      )}
      {info && step === "password" && (
        <div style={{ background: "#E6F4EA", color: "#14532D", border: "1px solid #BFE3CA",
                      borderRadius: 6, padding: "10px 12px", marginBottom: 14, fontSize: 13 }}>
          {info}
        </div>
      )}

      {step === "name" ? (
        <form onSubmit={submitName}>
          <label style={label}>Nom complet</label>
          <input style={s} value={fullName} onChange={(e) => setFullName(e.target.value)}
                 placeholder="Ex. ELANGA BONGONDA" required />
          <button type="submit" style={btn} disabled={busy}>
            {busy ? "Envoi..." : "Recevoir le code"}
          </button>
        </form>
      ) : (
        <form onSubmit={submitPassword}>
          <label style={label}>Code recu par email</label>
          <input style={s} value={otp} onChange={(e) => setOtp(e.target.value)}
                 placeholder="123456" maxLength={6} required />
          <label style={label}>Nouveau mot de passe</label>
          <input style={s} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label style={label}>Confirmer</label>
          <input style={s} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <button type="submit" style={btn} disabled={busy}>
            {busy ? "Mise a jour..." : "Changer le mot de passe"}
          </button>
        </form>
      )}

      <p style={{ marginTop: 20, fontSize: 13, color: "#64748b", textAlign: "center" }}>
        <Link to="/student/register" style={{ color: "#0B1B3A", fontWeight: 600 }}>Activer un compte</Link>
        {" · "}
        <Link to="/student/login" style={{ color: "#0B1B3A", fontWeight: 600 }}>Se connecter</Link>
      </p>
    </div>
  );
}