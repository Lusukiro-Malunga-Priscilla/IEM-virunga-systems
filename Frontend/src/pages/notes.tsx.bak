// src/pages/notes.tsx
import { useEffect, useState } from 'react';
import { Student, getAllStudents } from '../lib/api';
import StudentDetail from './StudentDetail';

export default function Notes() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getAllStudents()
      .then(data => { if (!cancelled) setStudents(data ?? []); })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Erreur inconnue');
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  if (selectedId !== null) {
    return <StudentDetail studentId={selectedId} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div>
      <h1 style={{ fontSize: 20, marginBottom: 6 }}>Notes</h1>
      <p style={{ color: '#64748b', marginBottom: 12 }}>
        Bulletin des notes — cliquez sur un élève pour voir sa classe et ses notes.
      </p>

      {error && <p style={{ color: '#dc2626', marginBottom: 12 }}>Erreur : {error}</p>}

      {loading ? (
        <p style={{ color: '#64748b' }}>Chargement…</p>
      ) : students.length === 0 ? (
        <p style={{ color: '#64748b' }}>Aucun élève trouvé.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f1f5f9' }}>
              <tr>
                <th style={th}>#</th>
                <th style={th}>Élève</th>
                <th style={th}>Classe</th>
                <th style={th}>Matricule</th>
              </tr>
            </thead>
            <tbody>
              {students.map(st => (
                <tr
                  key={st.id}
                  onClick={() => setSelectedId(st.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(st.id);
                    }
                  }}
                  style={{ borderBottom: '1px solid #eef2f7', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={td}>{st.id}</td>
                  <td style={td}>{st.fullName}</td>
                  <td style={td}>{st.classe?.name ?? '—'}</td>
                  <td style={td}>{st.matricule ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: 12, textAlign: 'left' };
const td: React.CSSProperties = { padding: 12 };