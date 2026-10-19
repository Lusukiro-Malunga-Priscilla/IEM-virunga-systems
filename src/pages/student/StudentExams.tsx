import { useEffect, useState } from "react";
import { examApi, Exam } from "@/lib/examApi";

export default function StudentExams() {
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

  const sorted = [...rows].sort((a, b) => (a.examDate || "").localeCompare(b.examDate || ""));
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = sorted.filter(e => (e.examDate || "") >= today);
  const past = sorted.filter(e => (e.examDate || "") < today);

  const table = (data: Exam[], title: string) => (
    <div style={{ ...card, marginBottom: 20 }}>
      <div style={{ padding: "14px 20px", background: "#F4F6FA", fontWeight: 700, fontSize: 13, color: "#0A1B33", textTransform: "uppercase", letterSpacing: 0.4 }}>{title}</div>
      {data.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "#6E7580" }}>Aucun examen.</div>
      ) : (
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            <th style={th}>Date</th><th style={th}>Heure</th><th style={th}>Matiere</th>
            <th style={th}>Salle</th><th style={th}>Type</th><th style={th}>Statut</th>
          </tr></thead>
          <tbody>
            {data.map((e, i) => (
              <tr key={e.id ?? i}>
                <td style={td}>{e.examDate}</td>
                <td style={td}>{e.duration ? `${e.duration} min` : "--"}</td>
                <td style={{ ...td, fontWeight:600 }}>{e.subject}</td>
                <td style={td}>{(e as any).room ?? e.studentClass ?? "--"}</td>
                <td style={td}>{e.examType}</td>
                <td style={td}>{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div style={pageWrap}>
      <h1 style={h1Style}>Examens</h1>
      <p style={subStyle}>Examens a venir et resultats publies.</p>

      {loading && <p style={{ color:"#6E7580" }}>Chargement...</p>}
      {error && <div style={{ background:"#FDECEC", color:"#7A2626", padding:"10px 14px", borderRadius:8, marginBottom:16 }}>{error}</div>}

      {!loading && !error && (
        <>
          {table(upcoming, "Examens a venir")}
          {table(past, "Examens passes / resultats")}
        </>
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
