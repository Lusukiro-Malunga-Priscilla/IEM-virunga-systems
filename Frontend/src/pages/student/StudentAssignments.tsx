import { useEffect, useState } from "react";
import { examApi, Exam } from "@/lib/examApi";

export default function StudentAssignments() {
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

  const today = new Date().toISOString().slice(0, 10);
  const statusOf = (e: Exam) => {
    if (e.status === "PUBLISHED" || e.status === "GRADED") return "Note";
    if ((e.examDate || "") < today) return "En retard";
    return "En cours";
  };

  return (
    <div style={pageWrap}>
      <h1 style={h1Style}>Mes devoirs</h1>
      <p style={subStyle}>Travaux a rendre et corrections.</p>

      {loading && <p style={{ color:"#6E7580" }}>Chargement...</p>}
      {error && <div style={{ background:"#FDECEC", color:"#7A2626", padding:"10px 14px", borderRadius:8, marginBottom:16 }}>{error}</div>}

      {!loading && !error && rows.length === 0 && (
        <div style={{ ...card, padding:40, textAlign:"center", color:"#6E7580" }}>Aucun devoir.</div>
      )}

      {!loading && !error && rows.length > 0 && (
        <div style={card}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <th style={th}>Titre</th><th style={th}>Matiere</th><th style={th}>Enseignant</th>
              <th style={th}>Echeance</th><th style={th}>Statut</th><th style={th}>Note max</th>
            </tr></thead>
            <tbody>
              {rows.map((e, i) => (
                <tr key={e.id ?? i}>
                  <td style={{ ...td, fontWeight:600 }}>{e.title}</td>
                  <td style={td}>{e.subject}</td>
                  <td style={td}>{e.createdByTeacher?.prenom ? `${e.createdByTeacher.prenom} ${e.createdByTeacher.nom ?? ""}` : "--"}</td>
                  <td style={td}>{e.examDate}</td>
                  <td style={td}>{statusOf(e)}</td>
                  <td style={td}>{e.maxScore}</td>
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
