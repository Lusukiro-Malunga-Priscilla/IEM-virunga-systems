import React, { useEffect, useState } from "react";
import { fetchAllAnnouncements } from "@/api/announcementApi";
import { useAuth } from "@/context/AuthContext";

const NAVY = "#0B1B3A";
const MUTED = "#64748b";
const BORDER = "#e4e0d6";

type Announcement = {
  id: string | number;
  title?: string;
  message?: string;
  content?: string;
  audience?: string;
  createdAt?: string;
  author?: string;
};

export default function TeacherAnnouncementsPage() {
  const { user } = useAuth() as any;
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("teacher-announcements-read");
      return new Set<string>(raw ? JSON.parse(raw) : []);
    } catch { return new Set<string>(); }
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAllAnnouncements();
        const arr = Array.isArray(data) ? data : (data?.announcements ?? []);
        // Filter: show only ALL and TEACHERS
        const filtered = arr.filter((a: Announcement) => {
          const aud = (a.audience || "ALL").toUpperCase();
          return aud === "ALL" || aud === "TEACHERS";
        });
        setItems(filtered);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  const markRead = (id: string | number) => {
    const sid = String(id);
    const next = new Set(readIds);
    next.add(sid);
    setReadIds(next);
    try { localStorage.setItem("teacher-announcements-read", JSON.stringify([...next])); } catch {}
  };

  const unread = (id: string | number) => !readIds.has(String(id));

  const fmt = (s?: string) => {
    if (!s) return "";
    try { return new Date(s).toLocaleString("fr-FR"); } catch { return s; }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Annonces</h1>
      <p style={{ color: MUTED, marginBottom: 20 }}>
        {items.length} annonce(s) — {items.filter((a) => unread(a.id)).length} non lue(s)
      </p>

      {loading && <p style={{ color: MUTED }}>Chargement...</p>}

      {!loading && items.length === 0 && (
        <p style={{ color: MUTED }}>Aucune annonce pour le moment.</p>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {items.map((a) => {
          const isUnread = unread(a.id);
          return (
            <div
              key={a.id}
              onClick={() => markRead(a.id)}
              style={{
                border: "1px solid #e2e8f0",
                background: isUnread ? "#f5f8ff" : "#fff",
                borderRadius: 12, padding: 16, cursor: "pointer",
                boxShadow: isUnread ? "0 2px 6px rgba(29,59,120,.08)" : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <strong style={{ color: NAVY, fontSize: 15 }}>
                  {isUnread && <span style={{ color: "#dc2626", marginRight: 6 }}>●</span>}
                  {a.title || "(Sans titre)"}
                </strong>
                <span style={{ color: MUTED, fontSize: 12 }}>{fmt(a.createdAt)}</span>
              </div>
              <div style={{ color: "#334155", fontSize: 14, whiteSpace: "pre-wrap" }}>
                {a.message || a.content || ""}
              </div>
              {a.author && (
                <div style={{ color: MUTED, fontSize: 12, marginTop: 8 }}>— {a.author}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
