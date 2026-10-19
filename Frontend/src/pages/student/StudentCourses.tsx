import { useEffect, useState } from "react";
import { courseApi, Course } from "@/lib/courseApi";
import { studentApi, StudentDashboard } from "@/lib/studentApi";

export default function StudentCourses() {
  const [me, setMe] = useState<StudentDashboard | null>(null);
  const [rows, setRows] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // 1. Fetch the logged-in student's profile to get class + section
        const dashboard = await studentApi.me();
        if (cancelled) return;
        setMe(dashboard);

        const classe  = dashboard?.student?.studentClass ?? "";
        const section = dashboard?.student?.section ?? "";

        // 2. Fetch courses filtered by class + section
        const filters: { classe?: string; section?: string } = {};
        if (classe)  filters.classe  = classe;
        if (section) filters.section = section;

        const courses = await courseApi.list(filters);
        if (!cancelled) setRows(courses ?? []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Erreur de chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const classe  = me?.student?.studentClass ?? "";
  const section = me?.student?.section ?? "";

  return (
    <div style={pageWrap}>
      <h1 style={h1Style}>Mes cours</h1>
      <p style={subStyle}>
        {classe
          ? `Cours de la classe ${classe}${section ? " - " + section : ""}.`
          : "Vos cours."}
      </p>

      {loading && <p style={{ color: "#6E7580" }}>Chargement...</p>}
      {error && (
        <div style={{ background: "#FDECEC", color: "#7A2626",
                      padding: "10px 14px", borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div style={{ ...card, padding: 40, textAlign: "center", color: "#6E7580" }}>
          Aucun cours disponible pour votre classe.
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <div style={card}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <th style={th}>Code</th>
              <th style={th}>Matiere</th>
              <th style={th}>Enseignant</th>
              <th style={th}>Classe</th>
              <th style={th}>Section</th>
              <th style={th}>Jour</th>
              <th style={th}>Horaire</th>
              <th style={th}>Volume</th>
            </tr></thead>
            <tbody>
              {rows.map((c, i) => (
                <tr key={c.id ?? i}>
                  <td style={td}>{c.code ?? "--"}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{c.name}</td>
                  <td style={td}>{c.enseignant ?? "--"}</td>
                  <td style={td}>{c.classe ?? "--"}</td>
                  <td style={td}>{(c as any).section ?? "--"}</td>
                  <td style={td}>{c.jour ?? "--"}</td>
                  <td style={td}>
                    {c.heureDebut && c.heureFin ? `${c.heureDebut} - ${c.heureFin}` : "--"}
                  </td>
                  <td style={td}>{c.volumeHoraire != null ? `${c.volumeHoraire}h` : "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const pageWrap: React.CSSProperties = { padding: "32px 36px 64px", maxWidth: 1200 };
const h1Style: React.CSSProperties = { fontSize: 24, fontWeight: 800, color: "#0A1B33", margin: 0 };
const subStyle: React.CSSProperties = { color: "#6E7580", marginTop: 6, marginBottom: 24, fontSize: 14 };
const card: React.CSSProperties = { background: "#fff", border: "1px solid #E7EAF0", borderRadius: 8, overflow: "hidden" };
const th: React.CSSProperties = { padding: "12px 16px", fontSize: 12, fontWeight: 700,
  color: "#475569", textTransform: "uppercase", letterSpacing: 0.4,
  textAlign: "left", background: "#F4F6FA", borderBottom: "1px solid #E7EAF0" };
const td: React.CSSProperties = { padding: "12px 16px", fontSize: 13.5,
  color: "#12141B", borderBottom: "1px solid #E7EAF0" };
