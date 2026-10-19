// src/pages/StudentDetail.tsx
import { useEffect, useState } from 'react';
import {
  Student, Grade,
  getStudentById, getStudentGrades,
} from '../lib/api';

interface Props {
  studentId: number;
  onBack: () => void;
}

export default function StudentDetail({ studentId, onBack }: Props) {
  const [student, setStudent] = useState<Student | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getStudentById(studentId),
      getStudentGrades(studentId).catch(() => [] as Grade[]),
    ])
      .then(([s, g]) => {
        if (cancelled) return;
        setStudent(s);
        setGrades(g ?? []);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Erreur inconnue');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [studentId]);

  return (
    <div>
      <button onClick={onBack} style={backBtn}>← Retour</button>

      {loading && <p style={{ color: '#64748b' }}>Chargement…</p>}
      {error && <p style={{ color: '#dc2626' }}>Erreur : {error}</p>}

      {student && (
        <>
          <h1 style={{ fontSize: 20, marginBottom: 4 }}>{student.fullName}</h1>
          <p style={{ color: '#64748b', marginBottom: 16 }}>
            Classe : {student.classe?.name ?? '—'} · Matricule : {student.matricule ?? '—'}
          </p>

          <h2 style={{ fontSize: 16, margin: '20px 0 8px' }}>Notes</h2>

          {grades.length === 0 ? (
            <p style={{ color: '#64748b' }}>Aucune note enregistrée.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f1f5f9' }}>
                <tr>
                  <th style={th}>Cours</th>
                  <th style={th}>Note</th>
                  <th style={th}>Max</th>
                  <th style={th}>Coefficient</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid #eef2f7' }}>
                    <td style={td}>{g.courseName ?? g.course ?? '—'}</td>
                    <td style={td}>{g.note ?? g.score ?? '—'}</td>
                    <td style={td}>{g.max ?? 20}</td>
                    <td style={td}>{g.coefficient ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

const backBtn: React.CSSProperties = {
  marginBottom: 16,
  background: 'transparent',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  padding: '6px 12px',
  cursor: 'pointer',
};
const th: React.CSSProperties = { padding: 12, textAlign: 'left' };
const td: React.CSSProperties = { padding: 12 };