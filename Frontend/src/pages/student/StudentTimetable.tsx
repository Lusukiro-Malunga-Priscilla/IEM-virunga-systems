import { useEffect, useState } from "react";
import { courseApi, Course } from "@/lib/courseApi";
import { studentApi, StudentDashboard } from "@/lib/studentApi";

export default function StudentTimetable() {
  const [me, setMe] = useState<StudentDashboard | null>(null);
  const [rows, setRows] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const dashboard = await studentApi.me();
        if (cancelled) return;
        setMe(dashboard);

        const classe  = dashboard?.student?.studentClass ?? "";
        const section = dashboard?.student?.section ?? "";
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

  const sorted = [...rows].sort((a, b) => {
    const order = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
    const da = order.indexOf((a.jour ?? "").trim());
    const db = order.indexOf((b.jour ?? "").trim());
    if (da !== db) return da - db;
    return (a.heureDebut ?? "").localeCompare(b.heureDebut ?? "");
  });

  return (
    <div style={pageWrap}>
      <h1 style={h1Style}>Emploi du temps</h1>
      <p style={subStyle}>
        {classe
          ? `Planning de la classe ${classe}${section ? " - " + section : ""}.`
          : "Votre planning hebdomadaire."}
      </p>

      {loading && <p style={{ color: "#6E7580" }}>Chargement...</p>}
      {error && (
        <div style={{ background: "#FDECEC", color: "#7A2626",
                      padding: "10px 14px", borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {!loading && !error && sorted.length === 0 && (
        <div style={{ ...card, padding: 40, textAlign: "center", color: "#6E7580" }}>
          Aucun cours planifie pour votre classe.
        </div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <div style={card}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <th style={th}>Jour</th>
              <th style={th}>Heure</th>
              <th style={th}>Matiere</th>
              <th style={th}>Enseignant</th>
              <th style={th}>Classe</th>
              <th style={th}>Section</th>
            </tr></thead>
            <tbody>
              {sorted.map((c, i) => (
                <tr key={c.id ?? i}>
                  <td style={{ ...td, fontWeight: 600 }}>{c.jour ?? "--"}</td>
                  <td style={td}>
                    {c.heureDebut && c.heureFin ? `${c.heureDebut} - ${c.heureFin}` : "--"}
                  </td>
                  <td style={td}>{c.name}</td>
                  <td style={td}>{c.enseignant ?? "--"}</td>
                  <td style={td}>{c.classe ?? "--"}</td>
                  <td style={td}>{(c as any).section ?? "--"}</td>
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
