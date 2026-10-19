// src/components/RegisterPaymentModal.tsx
import React, { useEffect, useState } from "react";
import { X, Loader2, Save } from "lucide-react";
import { paymentApi } from "@/lib/paymentApi";

const ANNUAL_FEE = 300;

const usd = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface Props {
  studentId: number | null;
  studentName?: string;
  remainingAmount?: number;
  onClose: () => void;
  onSaved: () => void;
}

export default function RegisterPaymentModal({
  studentId, studentName, remainingAmount, onClose, onSaved,
}: Props) {
  const [amount, setAmount] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (remainingAmount && remainingAmount > 0 && remainingAmount < ANNUAL_FEE) {
      setAmount(String(remainingAmount));
    } else {
      setAmount("");
    }
  }, [remainingAmount]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!studentId) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const amt = Number(amount);
    if (!amt || amt <= 0) { setError("Le montant doit etre superieur a 0."); return; }
    if (amt > ANNUAL_FEE) { setError("Le montant ne peut pas depasser les frais annuels de " + usd(ANNUAL_FEE) + "."); return; }
    setSaving(true);
    try {
      await paymentApi.register({ studentId, amount: amt });
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rpm-bg" onClick={onClose} />
      <div className="rpm-modal" onClick={(e) => e.stopPropagation()}>
        <style>{`
          .rpm-bg { position:fixed; inset:0; background:rgba(11,27,58,.45); z-index:70; }
          .rpm-modal { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
            width:min(460px,95vw); background:#fff; border-radius:12px; z-index:71;
            box-shadow:0 20px 60px rgba(0,0,0,.25); font-family:'IBM Plex Sans',system-ui,sans-serif; color:#221F1B; }
          .rpm-head { padding:18px 22px; border-bottom:1px solid #E4E8EF;
            display:flex; justify-content:space-between; align-items:center; }
          .rpm-title { font-size:16px; font-weight:700; color:#0B1B3A; margin:0; }
          .rpm-sub { color:#64748B; font-size:12.5px; margin:2px 0 0; }
          .rpm-close { border:none; background:#F1F5F9; width:30px; height:30px; border-radius:8px;
            cursor:pointer; display:inline-flex; align-items:center; justify-content:center; }
          .rpm-body { padding:20px 22px; display:flex; flex-direction:column; gap:14px; }
          .rpm-info { background:#F4F6FA; border:1px solid #E4E8EF; border-radius:6px;
            padding:12px 14px; font-size:13px; color:#475569; }
          .rpm-field { display:flex; flex-direction:column; gap:6px; }
          .rpm-field label { font-size:11.5px; font-weight:600; letter-spacing:.03em;
            text-transform:uppercase; color:#64748B; }
          .rpm-field input { padding:9px 12px; font-size:13.5px; border:1px solid #E4E8EF;
            border-radius:6px; font-family:inherit; outline:none; }
          .rpm-field input:focus { border-color:#2F6FED; }
          .rpm-error { background:#FDECEC; color:#9B2C2C; border:1px solid #F3C6C6;
            border-radius:6px; padding:9px 12px; font-size:12.5px; }
          .rpm-foot { padding:14px 22px; border-top:1px solid #E4E8EF;
            display:flex; gap:8px; justify-content:flex-end; }
          .rpm-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 14px;
            font-size:13.5px; font-weight:600; font-family:inherit; border-radius:6px;
            cursor:pointer; border:1px solid #0B1B3A; background:#0B1B3A; color:#F3EFE3; }
          .rpm-btn:disabled { opacity:.6; cursor:not-allowed; }
          .rpm-btn.ghost { background:#fff; color:#0B1B3A; }
          .spin { animation: rpm-spin .9s linear infinite; }
          @keyframes rpm-spin { to { transform: rotate(360deg); } }
        `}</style>

        <form onSubmit={submit}>
          <div className="rpm-head">
            <div>
              <h3 className="rpm-title">Enregistrer un paiement</h3>
              <p className="rpm-sub">{studentName || "Eleve"}</p>
            </div>
            <button type="button" className="rpm-close" onClick={onClose}><X size={15} /></button>
          </div>

          <div className="rpm-body">
            <div className="rpm-info">
              Frais annuels : <strong>{usd(ANNUAL_FEE)}</strong><br/>
              Reste a payer : <strong>{usd(Math.max(0, remainingAmount ?? ANNUAL_FEE))}</strong>
            </div>

            <div className="rpm-field">
              <label>Montant de cette tranche</label>
              <input type="number" min="0" max={ANNUAL_FEE} step="0.01" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex. 100" required />
            </div>

            {error && <div className="rpm-error">{error}</div>}
          </div>

          <div className="rpm-foot">
            <button type="button" className="rpm-btn ghost" onClick={onClose} disabled={saving}>
              Annuler
            </button>
            <button type="submit" className="rpm-btn" disabled={saving}>
              {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
