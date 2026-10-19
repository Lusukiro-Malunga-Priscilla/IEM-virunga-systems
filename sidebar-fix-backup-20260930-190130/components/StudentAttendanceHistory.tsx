import React, { useEffect, useState } from 'react';
import { attendanceApi } from '../lib/attendanceApi';
import { Attendance } from '../types/attendance';

interface Props {
  studentUserAccountId: number;
}

export default function StudentAttendanceHistory({ studentUserAccountId }: Props) {
  const [rows, setRows] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    attendanceApi
      .getByUser(studentUserAccountId)
      .then(setRows)
      .catch((e) => setError(e.message || 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, [studentUserAccountId]);

  return (
    <div>
      <h2 style={{ fontSize: 18, marginBottom: 4 }}>Mes prÃ©sences</h2>
      <p style={{ color: '#64748b', marginBottom: 12 }}>DÃ©but des cours : 07h30.</p>

      {loading && <p>Chargementâ€¦</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: 12, textAlign: 'left' }}>Date</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Cours</th>
              <th style={{ padding: 12, textAlign: 'left' }}>ArrivÃ©e</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Statut</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Justification</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #eef2f7' }}>
                <td style={{ padding: 12 }}>{r.date}</td>
                <td style={{ padding: 12 }}>{r.course || '-'}</td>
                <td style={{ padding: 12 }}>
                  {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString().slice(0, 5) : '-'}
                </td>
                <td style={{ padding: 12 }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      color: '#fff',
                      background: !r.present ? '#ef4444' : r.late ? '#f59e0b' : '#22c55e',
                    }}
                  >
                    {!r.present ? 'Absent' : r.late ? 'En retard' : 'PrÃ©sent'}
                  </span>
                </td>
                <td style={{ padding: 12 }}>{r.justification || (r.late ? 'â€” Ã  fournir â€”' : '-')}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 12, color: '#94a3b8' }}>
                  Aucun enregistrement pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}