// src/pages/student/StudentLibrary.tsx
import { useEffect, useMemo, useState } from "react";
import { bookApi, Book } from "@/lib/bookApi";

export default function StudentLibrary() {
  const [rows, setRows] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await bookApi.list();
        if (!cancelled) setRows(list ?? []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Erreur de chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(b =>
      (b.bookName ?? "").toLowerCase().includes(q) ||
      (b.author ?? "").toLowerCase().includes(q) ||
      (b.bookId ?? "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  const statusBadge = (status: string) => {
    const isAvailable = (status ?? "").toUpperCase() === "AVAILABLE";
    return (
      <span style={{
        display: "inline-block", padding: "2px 10px", borderRadius: 999,
        fontSize: 12, fontWeight: 600,
        background: isAvailable ? "#DCFCE7" : "#FEF3C7",
        color:      isAvailable ? "#166534" : "#8A5A00",
      }}>{isAvailable ? "Disponible" : "Emprunte"}</span>
    );
  };

  return (
    <div style={pageWrap}>
      <h1 style={h1Style}>Bibliotheque</h1>
      <p style={subStyle}>Consultez les livres disponibles dans la bibliotheque de l'ecole.</p>

      <div style={{ ...card, padding: "14px 18px", marginBottom: 16, display: "flex", gap: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un livre, un auteur, un numero..."
          style={{
            flex: 1, padding: "10px 12px", border: "1px solid #E4E8EF",
            borderRadius: 6, fontSize: 13.5, outline: "none", fontFamily: "inherit",
          }}
        />
        <span style={{ alignSelf: "center", color: "#6E7580", fontSize: 13 }}>
          {filtered.length} livre{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {loading && <p style={{ color: "#6E7580" }}>Chargement...</p>}
      {error && (
        <div style={{ background: "#FDECEC", color: "#7A2626",
                      padding: "10px 14px", borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ ...card, padding: 40, textAlign: "center", color: "#6E7580" }}>
          Aucun livre a afficher.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div style={card}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <th style={th}>Numero</th>
              <th style={th}>Titre</th>
              <th style={th}>Auteur</th>
              <th style={th}>Statut</th>
            </tr></thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id ?? i}>
                  <td style={td}>{b.bookId ?? "--"}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{b.bookName ?? "--"}</td>
                  <td style={td}>{b.author ?? "--"}</td>
                  <td style={td}>{statusBadge(b.status ?? "")}</td>
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
