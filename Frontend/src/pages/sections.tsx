// src/pages/sections.tsx
import { useEffect, useState } from 'react';
import { Section, sectionApi } from '@/lib/Courseapi';

export default function Sections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    sectionApi
      .list()
      .then(data => { if (!cancelled) setSections(data ?? []); })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur inconnue');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, marginBottom: 6 }}>Sections</h1>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        Liste des sections de l'institut.
      </p>

      {error && <p style={{ color: '#dc2626' }}>Erreur : {error}</p>}
      {loading ? (
        <p style={{ color: '#64748b' }}>Chargement…</p>
      ) : sections.length === 0 ? (
        <p style={{ color: '#64748b' }}>Aucune section.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9' }}>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Nom</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s, i) => (
              <tr key={String(s.id ?? i)} style={{ borderBottom: '1px solid #eef2f7' }}>
                <td style={td}>{String(s.id)}</td>
                <td style={td}>{s.nom ?? s.name ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: 12, textAlign: 'left' };
const td: React.CSSProperties = { padding: 12 };