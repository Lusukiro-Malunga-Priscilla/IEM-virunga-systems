import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { paymentApi, Payment } from "@/lib/paymentApi";

// ---- Business rule -----------------------------------------------------
// Annual fee per student = $300 (USD).
// Every payment row is an installment. Total paid = sum of all installments.
const ANNUAL_FEE = 300;

const usd = (n: number | undefined) =>
  "$" + (n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function StudentPayments() {
  const { user } = useAuth();
  const studentId = Number((user as any)?.studentId ?? 0);

  const [rows, setRows] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        let history: Payment[] = [];
        if (studentId) {
          history = await paymentApi.historyFor(studentId).catch(() => []);
        }
        if (!cancelled) setRows(history);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Erreur de chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [studentId]);

  // Business computation
  const totalPaid = rows.reduce((s, r) => s + (r.paidAmount ?? 0), 0);
  const remaining = Math.max(0, ANNUAL_FEE - totalPaid);
  const pct       = Math.min(100, Math.round((totalPaid / ANNUAL_FEE) * 100));
  const isPaid    = totalPaid >= ANNUAL_FEE;
  const status    = isPaid ? "Solde" : totalPaid > 0 ? "En cours" : "Non commence";

  return (
    <div style={pageWrap}>
      <h1 style={h1Style}>Mes paiements</h1>
      <p style={subStyle}>Frais annuels : {usd(ANNUAL_FEE)}. Paiement par tranches.</p>

      {loading && <p style={{ color:"#6E7580" }}>Chargement...</p>}
      {error && (
        <div style={{ background:"#FDECEC", color:"#7A2626", padding:"10px 14px",
                      borderRadius:8, marginBottom:16 }}>{error}</div>
      )}

      {!loading && !error && (
        <>
          {/* Summary cards */}
          <div style={{ display:"flex", gap:14, marginBottom:22, flexWrap:"wrap" }}>
            <StatCard label="Frais annuel"  value={usd(ANNUAL_FEE)} />
            <StatCard label="Deja paye"     value={usd(totalPaid)} valueColor="#166534" />
            <StatCard label="Reste a payer" value={usd(remaining)}
                      valueColor={remaining > 0 ? "#B91C1C" : "#166534"} />
          </div>

          {/* Progress bar */}
          <div style={{ ...card, padding:"18px 20px", marginBottom:22 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:13, color:"#6E7580" }}>Progression du paiement</span>
              <span style={{ fontSize:13, fontWeight:700, color:"#0A1B33" }}>{pct}%</span>
            </div>
            <div style={{ height:10, background:"#E7EAF0", borderRadius:999, overflow:"hidden" }}>
              <div style={{
                width:`${pct}%`, height:"100%",
                background: isPaid ? "#166534" : "#2F6FED",
                transition:"width 300ms ease",
              }} />
            </div>
            <div style={{ marginTop:12, fontSize:12.5, color:"#6E7580" }}>
              Statut : <strong style={{ color: isPaid ? "#166534" : totalPaid > 0 ? "#8A5A00" : "#B91C1C" }}>
                {status}
              </strong>
            </div>
          </div>

          {/* History */}
          <div style={card}>
            <div style={{ padding:"14px 20px", background:"#F4F6FA", fontWeight:700,
                          fontSize:13, color:"#0A1B33", textTransform:"uppercase",
                          letterSpacing:0.4, borderBottom:"1px solid #E7EAF0" }}>
              Historique des paiements
            </div>
            {rows.length === 0 ? (
              <div style={{ padding:40, textAlign:"center", color:"#6E7580" }}>
                Aucun paiement enregistre pour le moment.
              </div>
            ) : (
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>
                  <th style={th}>Date</th>
                  <th style={th}>Montant paye</th>
                  <th style={th}>Reste apres</th>
                  <th style={th}>Statut</th>
                </tr></thead>
                <tbody>
                  {(() => {
                    // Compute remaining after each payment, from the top down.
                    let running = 0;
                    const enriched = rows
                      .slice()
                      .sort((a, b) => (a.paymentDate ?? "").localeCompare(b.paymentDate ?? ""))
                      .map(r => {
                        running += r.paidAmount ?? 0;
                        const rest = Math.max(0, ANNUAL_FEE - running);
                        return { ...r, _running: running, _rest: rest };
                      });

                    return enriched.reverse().map((r, i) => {
                      const rowStatus = r._running >= ANNUAL_FEE ? "PAID"
                        : r._running > 0 ? "Partiel" : "Non paye";
                      return (
                        <tr key={r.id ?? i}>
                          <td style={td}>{r.paymentDate}</td>
                          <td style={{ ...td, fontWeight:600, color:"#166534" }}>{usd(r.paidAmount)}</td>
                          <td style={{ ...td, color: r._rest > 0 ? "#B91C1C" : "#166534" }}>
                            {usd(r._rest)}
                          </td>
                          <td style={td}>
                            <span style={{
                              display:"inline-block", padding:"2px 10px", borderRadius:999,
                              fontSize:12, fontWeight:600,
                              background: rowStatus === "PAID" ? "#DCFCE7"
                                        : rowStatus === "Partiel" ? "#FEF3C7" : "#FDECEC",
                              color: rowStatus === "PAID" ? "#166534"
                                   : rowStatus === "Partiel" ? "#8A5A00" : "#7A2626",
                            }}>{rowStatus}</span>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ flex:"1 1 200px", background:"#fff", border:"1px solid #E7EAF0",
                  borderRadius:8, padding:"18px 22px" }}>
      <div style={{ fontSize:11.5, color:"#6E7580", fontWeight:600,
                    textTransform:"uppercase", letterSpacing:0.4 }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:800, color: valueColor ?? "#0A1B33", marginTop:8 }}>
        {value}
      </div>
    </div>
  );
}

const th: React.CSSProperties = { padding:"12px 16px", fontSize:12, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:0.4, textAlign:"left", background:"#F4F6FA", borderBottom:"1px solid #E7EAF0" };
const td: React.CSSProperties = { padding:"12px 16px", fontSize:13.5, color:"#12141B", borderBottom:"1px solid #E7EAF0" };
const pageWrap: React.CSSProperties = { padding:"32px 36px 64px", maxWidth:1200 };
const h1Style: React.CSSProperties = { fontSize:24, fontWeight:800, color:"#0A1B33", margin:0 };
const subStyle: React.CSSProperties = { color:"#6E7580", marginTop:6, marginBottom:24, fontSize:14 };
const card: React.CSSProperties = { background:"#fff", border:"1px solid #E7EAF0", borderRadius:8, overflow:"hidden" };
