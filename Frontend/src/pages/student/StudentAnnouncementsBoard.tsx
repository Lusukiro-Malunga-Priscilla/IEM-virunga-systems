// src/pages/student/StudentAnnouncementsBoard.tsx
import { useEffect, useState } from "react";
import { fetchAnnouncementsForRole } from "@/lib/announcementApi";

interface Announcement {
  id?: number;
  title?: string;
  message?: string;
  content?: string;
  category?: string;
  audience?: string;
  date?: string;
  createdAt?: string;
  createdBy?: string;
  author?: string;
  allowReplies?: boolean;
}

export default function StudentAnnouncementsBoard() {
  const [rows, setRows] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchAnnouncementsForRole("STUDENT" as any);
        if (!cancelled) setRows((list ?? []) as Announcement[]);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Erreur de chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const when = (a: Announcement) => a.date ?? a.createdAt ?? "--";
  const body = (a: Announcement) => a.message ?? a.content ?? "";

  return (
    <div style={pageWrap}>
      <h1 style={h1Style}>Annonces</h1>
      <p style={subStyle}>Messages de l'administration.</p>

      {loading && <p style={{ color: "#6E7580" }}>Chargement...</p>}
      {error && (
        <div style={{ background: "#FDECEC", color: "#7A2626",
                      padding: "10px 14px", borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div style={{ ...card, padding: 40, textAlign: "center", color: "#6E7580" }}>
          Aucune annonce pour le moment.
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <div style={card}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <th style={th}>Date</th>
              <th style={th}>Titre</th>
              <th style={th}>Contenu</th>
              <th style={th}>Audience</th>
            </tr></thead>
            <tbody>
              {rows.map((a, i) => (
                <tr key={a.id ?? i}>
                  <td style={td}>{when(a)}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{a.title ?? "--"}</td>
                  <td style={td}>{body(a)}</td>
                  <td style={td}>{a.audience ?? "Tous"}</td>
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
