// src/pages/paiements.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Search, Loader2, Clock, Plus, CreditCard, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { paymentApi, PaymentSummary } from "@/lib/paymentApi";
import PaymentHistoryDrawer from "@/components/PaymentHistoryDrawer";
import RegisterPaymentModal from "@/components/RegisterPaymentModal";

function fmt(n: number | null | undefined) {
  if (n == null) return "0";
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function usd(n: number | null | undefined) {
  return "$" + fmt(n);
}

function classify(s: string | undefined): "paid" | "partial" | "unpaid" | "none" {
  if (!s) return "none";
  const up = s.toUpperCase();
  if (up.includes("PAY") && !up.includes("PART")) return "paid";
  if (up.includes("PART")) return "partial";
  if (up.includes("IMP") || up.includes("PEND")) return "unpaid";
  return "none";
}

const STATUS_LABEL: Record<string, string> = {
  paid: "Paye",
  partial: "Partiel",
  unpaid: "Impaye",
  none: "Non facture",
};

export default function Paiements() {
  const [rows, setRows] = useState<PaymentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [historyFor, setHistoryFor] = useState<PaymentSummary | null>(null);
  const [payFor, setPayFor] = useState<PaymentSummary | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const data = await paymentApi.summary();
      setRows(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de charger les paiements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    let paidCount = 0, partialCount = 0, unpaidCount = 0;
    let paidSum = 0, partialSum = 0, unpaidSum = 0;

    for (const r of rows) {
      const cls = classify(r.status);
      const paid = Number(r.paidAmount || 0);
      const remain = Number(r.remainingAmount || 0);

      if (cls === "paid") {
        paidCount++;
        paidSum += paid;
      } else if (cls === "partial") {
        partialCount++;
        partialSum += paid;
      } else {
        unpaidCount++;
        unpaidSum += remain;
      }
    }

    return {
      totalStudents: rows.length,
      paidCount, partialCount, unpaidCount,
      paidSum, partialSum, unpaidSum,
    };
  }, [rows]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(r => {
      if (statusFilter && classify(r.status) !== statusFilter) return false;
      if (!needle) return true;
      const hay = `${r.fullName || ""} ${r.registrationNumber || ""} ${r.studentClass || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [rows, q, statusFilter]);

  return (
    <div className="pm-wrap">
      <style>{`
        .pm-wrap { font-family:'IBM Plex Sans',system-ui,sans-serif; color:#221F1B; }
        .pm-head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:18px; flex-wrap:wrap; }
        .pm-title { font-size:22px; font-weight:700; color:#0B1B3A; margin:0 0 4px; }
        .pm-sub { color:#64748B; font-size:13.5px; margin:0; }
        .pm-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:18px; }
        .pm-stat { background:#fff; border:1px solid #E4E8EF; border-radius:10px; padding:14px 16px; display:flex; gap:12px; align-items:center; }
        .pm-stat .ico { width:36px; height:36px; border-radius:9px; display:inline-flex; align-items:center; justify-content:center; }
        .pm-stat .k { font-size:11.5px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; color:#64748B; }
        .pm-stat .v { font-size:20px; font-weight:700; color:#0B1B3A; margin-top:2px; }
        .pm-card { background:#fff; border:1px solid #E4E8EF; border-radius:10px; overflow:hidden; }
        .pm-filters { display:flex; gap:12px; align-items:center; padding:14px 18px; background:#FAFAF8; border-bottom:1px solid #E4E8EF; flex-wrap:wrap; }
        .pm-search { position:relative; flex:1; min-width:220px; }
        .pm-search input { width:100%; padding:8px 12px 8px 34px; border:1px solid #E4E8EF; border-radius:6px; font-size:13px; font-family:inherit; }
        .pm-search svg { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94A3B8; }
        .pm-select { padding:8px 10px; border:1px solid #E4E8EF; border-radius:6px; font-size:13px; font-family:inherit; }
        table.pm-table { width:100%; border-collapse:collapse; font-size:13.5px; }
        .pm-table thead th { background:#F1F5F9; text-align:left; padding:11px 14px; font-size:11.5px; font-weight:600; letter-spacing:.04em; color:#64748B; text-transform:uppercase; white-space:nowrap; }
        .pm-table tbody td { padding:11px 14px; border-top:1px solid #E4E8EF; }
        .pm-table tbody tr:hover { background:#FAFAF8; }
        .pm-name { font-weight:600; color:#0B1B3A; }
        .pm-matricule { color:#64748B; font-size:12px; }
        .pm-badge { display:inline-block; padding:3px 9px; border-radius:999px; font-size:11px; font-weight:600; }
        .pm-badge.paid    { background:#E6F4EA; color:#14532D; }
        .pm-badge.partial { background:#FEF3C7; color:#92400E; }
        .pm-badge.unpaid  { background:#FDECEC; color:#9B2C2C; }
        .pm-badge.none    { background:#F1F5F9; color:#64748B; }
        .pm-actions { display:flex; gap:6px; }
        .pm-btn { display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:6px;
          border:1px solid #E4E8EF; background:#fff; cursor:pointer; font-size:12.5px; font-weight:600;
          color:#334155; font-family:inherit; }
        .pm-btn:hover { background:#F1F5F9; }
        .pm-btn.primary { background:#0B1B3A; color:#F3EFE3; border-color:#0B1B3A; }
        .pm-btn.primary:hover { background:#15302A; }
        .pm-empty { padding:48px 24px; text-align:center; color:#94A3B8; font-size:13.5px; }
        .spin { animation: pm-spin .9s linear infinite; }
        @keyframes pm-spin { to { transform: rotate(360deg); } }
        @media (max-width: 800px) { .pm-stats { grid-template-columns:repeat(2,1fr); } }
      `}</style>

      <div className="pm-head">
        <div>
          <h1 className="pm-title">Paiements</h1>
          <p className="pm-sub">Suivi des paiements des eleves. Cliquez sur Historique pour voir tous les versements.</p>
        </div>
      </div>

      <div className="pm-stats">
        <div className="pm-stat">
          <div className="ico" style={{ background:"#EEF2F7", color:"#0B1B3A" }}><CreditCard size={18} /></div>
          <div>
            <div className="k">Total eleves</div>
            <div className="v">{stats.totalStudents}</div>
          </div>
        </div>
        <div className="pm-stat">
          <div className="ico" style={{ background:"#E6F4EA", color:"#14532D" }}><CheckCircle2 size={18} /></div>
          <div>
            <div className="k">Montant paye</div>
            <div className="v">${fmt(stats.paidSum)}</div>
            <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>
              {stats.paidCount} eleve{stats.paidCount === 1 ? "" : "s"}
            </div>
          </div>
        </div>
        <div className="pm-stat">
          <div className="ico" style={{ background:"#FEF3C7", color:"#92400E" }}><AlertCircle size={18} /></div>
          <div>
            <div className="k">Montant partiel</div>
            <div className="v">${fmt(stats.partialSum)}</div>
            <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>
              {stats.partialCount} eleve{stats.partialCount === 1 ? "" : "s"}
            </div>
          </div>
        </div>
        <div className="pm-stat">
          <div className="ico" style={{ background:"#FDECEC", color:"#9B2C2C" }}><XCircle size={18} /></div>
          <div>
            <div className="k">Reste a payer</div>
            <div className="v">${fmt(stats.unpaidSum)}</div>
            <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>
              {stats.unpaidCount} eleve{stats.unpaidCount === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </div>

      <div className="pm-card">
        <div className="pm-filters">
          <div className="pm-search">
            <Search size={15} />
            <input
              type="text"
              placeholder="Rechercher un eleve, un matricule..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select
            className="pm-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="paid">Payes</option>
            <option value="partial">Partiels</option>
            <option value="unpaid">Impayes</option>
            <option value="none">Non factures</option>
          </select>
        </div>

        {loading ? (
          <div className="pm-empty"><Loader2 size={16} className="spin" /> Chargement...</div>
        ) : error ? (
          <div className="pm-empty" style={{ color:"#9B2C2C" }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div className="pm-empty">Aucun resultat.</div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Eleve</th>
                  <th>Matricule</th>
                  <th>Classe</th>
                  <th>Total</th>
                  <th>Paye</th>
                  <th>Reste</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const cls = classify(r.status);
                  return (
                    <tr key={r.studentId}>
                      <td><div className="pm-name">{r.fullName || "-"}</div></td>
                      <td className="pm-matricule">{r.registrationNumber || "-"}</td>
                      <td>{r.studentClass || "-"}</td>
                      <td>{usd(r.totalAmount)}</td>
                      <td style={{ fontWeight:600, color:"#14532D" }}>{usd(r.paidAmount)}</td>
                      <td style={{ color: (r.remainingAmount ?? 0) > 0 ? "#9B2C2C" : "#14532D", fontWeight:600 }}>
                        {usd(r.remainingAmount)}
                      </td>
                      <td><span className={`pm-badge ${cls}`}>{STATUS_LABEL[cls]}</span></td>
                      <td>
                        <div className="pm-actions">
                          <button className="pm-btn" onClick={() => setHistoryFor(r)}>
                            <Clock size={13} /> Historique
                          </button>
                          <button className="pm-btn primary" onClick={() => setPayFor(r)}>
                            <Plus size={13} /> Enregistrer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PaymentHistoryDrawer
        studentId={historyFor?.studentId ?? null}
        studentName={historyFor?.fullName}
        onClose={() => setHistoryFor(null)}
      />

      <RegisterPaymentModal
        studentId={payFor?.studentId ?? null}
        studentName={payFor?.fullName}
        totalAmount={payFor?.totalAmount}
        remainingAmount={payFor?.remainingAmount}
        onClose={() => setPayFor(null)}
        onSaved={load}
      />
    </div>
  );
}