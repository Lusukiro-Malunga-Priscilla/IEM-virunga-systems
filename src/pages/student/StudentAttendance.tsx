import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { attendanceApi } from "@/lib/attendanceApi";

export default function StudentAttendance() {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) { setLoading(false); return; }
    attendanceApi.getByUser(Number(user.id))
      .then(d => { if (!cancelled) setRows(d ?? []); })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id]);

  const present = rows.filter(r => r.present).length;
  const absent  = rows.filter(r => !r.present).length;
  const late    = rows.filter(r => r.late).length;
  const pct     = rows.length ? Math.round((present / rows.length) * 100) : 0;

  return (
    <div style={pageWrap}>
      <h1 style={h1Style}>Mes presences</h1>
      <p style={subStyle}>Historique et pourcentage de presence.</p>

      {loading && <p style={{ color:"#6E7580" }}>Chargement...</p>}
      {error && <div style={{ background:"#FDECEC", color:"#7A2626", padding:"10px 14px", borderRadius:8, marginBottom:16 }}>{error}</div>}

      {!loading && !error && (
        <>
          <div style={{ ...card, marginBottom: 20 }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>
                <th style={th}>Jours present</th><th style={th}>Jours absent</th>
                <th style={th}>Retards</th><th style={th}>Pourcentage</th>
              </tr></thead>
              <tbody><tr>
                <td style={{ ...td, fontWeight:700, color:"#166534" }}>{present}</td>
                <td style={{ ...td, fontWeight:700, color:"#B91C1C" }}>{absent}</td>
                <td style={{ ...td, fontWeight:700, color:"#8A5A00" }}>{late}</td>
                <td style={{ ...td, fontWeight:700 }}>{pct}%</td>
              </tr></tbody>
            </table>
          </div>

          {rows.length === 0 ? (
            <div style={{ ...card, padding:40, textAlign:"center", color:"#6E7580" }}>Aucune presence enregistree.</div>
          ) : (
            <div style={card}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>
                  <th style={th}>Date</th><th style={th}>Cours</th><th style={th}>Statut</th>
                  <th style={th}>Arrivee</th><th style={th}>Depart</th><th style={th}>Justification</th>
                </tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.id ?? i}>
                      <td style={td}>{r.date ?? "--"}</td>
                      <td style={td}>{r.course ?? "--"}</td>
                      <td style={td}>
                        <span style={{
                          display:"inline-block", padding:"2px 10px", borderRadius:999, fontSize:12, fontWeight:600,
                          background: r.present ? "#DCFCE7" : "#FDECEC",
                          color: r.present ? "#166534" : "#7A2626",
                        }}>{r.present ? "Present" : "Absent"}</span>
                      </td>
                      <td style={td}>{r.checkInTime ?? "--"}</td>
                      <td style={td}>{r.checkOutTime ?? "--"}</td>
                      <td style={td}>{r.justification ?? "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
