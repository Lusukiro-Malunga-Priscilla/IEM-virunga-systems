import { useEffect, useState } from "react";
import { examApi, Exam } from "@/lib/examApi";

export default function StudentReports() {
  const [rows, setRows] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    examApi.listAll()
      .then(d => { if (!cancelled) setRows(d ?? []); })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const bySubject = rows.reduce<Record<string, Exam[]>>((acc, e) => {
    const k = e.subject || "Autre";
    (acc[k] ||= []).push(e);
    return acc;
  }, {});

  return (
    <div style={pageWrap}>
      <h1 style={h1Style}>Mes bulletins</h1>
      <p style={subStyle}>Recapitulatif par matiere.</p>

      {loading && <p style={{ color:"#6E7580" }}>Chargement...</p>}
      {error && <div style={{ background:"#FDECEC", color:"#7A2626", padding:"10px 14px", borderRadius:8, marginBottom:16 }}>{error}</div>}

      {!loading && !error && rows.length === 0 && (
        <div style={{ ...card, padding:40, textAlign:"center", color:"#6E7580" }}>Aucun bulletin disponible.</div>
      )}

      {!loading && !error && rows.length > 0 && (
        <div style={card}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <th style={th}>Matiere</th><th style={th}>Nombre d evaluations</th>
              <th style={th}>Total bareme</th><th style={th}>Statut</th>
            </tr></thead>
            <tbody>
              {Object.entries(bySubject).map(([subject, list], i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight:600 }}>{subject}</td>
                  <td style={td}>{list.length}</td>
                  <td style={td}>{list.reduce((s, e) => s + (e.maxScore ?? 0), 0)}</td>
                  <td style={td}>{list.every(e => e.status === "PUBLISHED") ? "Publie" : "En attente"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding:"12px 16px", fontSize:12, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:0.4, textAlign:"left", background:"#F4F6FA", borderBottom:"1px solid #E7EAF0" };
const td: React.CSSProperties = { padding:"12px 16px", fontSize:13.5, color:"#12141B", borderBottom:"1px solid #E7EAF0" };
const pageWrap: React.CSSProperties = { padding:"32px 36px 64px", maxWidth:1200 };
const h1Style: React.CSSProperties = { fontSize:24, fontWeight:800, color:"#0A1B33", margin:0 };
const subStyle: React.CSSProperties = { color:"#6E7580", marginTop:6, marginBottom:24, fontSize:14 };
const card: React.CSSProperties = { background:"#fff", border:"1px solid #E7EAF0", borderRadius:8, overflow:"hidden" };
