// src/components/AdminDailyAttendance.tsx
import React, { useEffect, useState } from 'react';
import { attendanceApi } from '../lib/attendanceApi';
import { AttendeeType } from '../types/attendance';

const STATUS_LABEL: Record<string, string> = {
  PRESENT: 'Present',
  LATE: 'En retard',
  ABSENT: 'Absent',
  NOT_MARKED: 'Non pointe',
};

const STATUS_BG: Record<string, string> = {
  PRESENT: '#E6F4EA',
  LATE:    '#FEF3C7',
  ABSENT:  '#FDECEC',
  NOT_MARKED: '#F1F5F9',
};

const STATUS_FG: Record<string, string> = {
  PRESENT: '#14532D',
  LATE:    '#92400E',
  ABSENT:  '#9B2C2C',
  NOT_MARKED: '#64748B',
};

interface Props {
  attendeeType: AttendeeType;
}

interface StudentRow {
  userAccountId: number;
  fullName: string;
  status: string;
  checkInTime: string | null;
  justification: string | null;
}

interface ClassGroup {
  studentClass: string;
  section: string;
  sectionLabel: string;
  total: number;
  present: number;
  late: number;
  absent: number;
  students: StudentRow[];
}

export default function AdminDailyAttendance({ attendeeType }: Props) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [groups, setGroups] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, attendeeType]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data: any = await attendanceApi.getBoardByClass(date, attendeeType);
      setGroups(data?.classes || []);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  const heading =
    attendeeType === 'STUDENT' ? 'Eleves'
    : attendeeType === 'TEACHER' ? 'Enseignants'
    : 'Administration';

  return (
    <div>
      <h2 style={{ fontSize: 18, marginBottom: 4 }}>Presence du jour - {heading}</h2>
      <p style={{ color: '#64748b', marginBottom: 12 }}>
        Debut des cours : 07h30. Vert = present, orange = en retard, rouge = absent.
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'inline-flex', flexDirection: 'column', fontSize: 13 }}>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: 8, border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 4 }}
          />
        </label>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {!loading && groups.length === 0 && (
        <p style={{ color: '#94a3b8' }}>Aucune presence enregistree pour ce jour.</p>
      )}

      {groups.map(g => (
        <div key={g.studentClass + '|' + g.section} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 15, marginBottom: 8 }}>
            Classe : <strong>{g.studentClass}</strong>
            {g.sectionLabel ? ' - ' + g.sectionLabel : ''}
          </h3>
          <div style={{ display: 'flex', gap: 12, fontSize: 12.5, marginBottom: 8 }}>
            <span style={{ color: '#14532D' }}>Presents : {g.present}</span>
            <span style={{ color: '#92400E' }}>Retards : {g.late}</span>
            <span style={{ color: '#9B2C2C' }}>Absents : {g.absent}</span>
            <span style={{ color: '#64748b' }}>Total : {g.total}</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead style={{ background: '#F1F5F9' }}>
              <tr>
                <th style={th}>Nom</th>
                <th style={th}>Statut</th>
                <th style={th}>Heure</th>
                <th style={th}>Justification</th>
              </tr>
            </thead>
            <tbody>
              {g.students.map(s => (
                <tr key={s.userAccountId} style={{ borderBottom: '1px solid #eef2f7' }}>
                  <td style={td}>{s.fullName}</td>
                  <td style={td}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        background: STATUS_BG[s.status] || '#F1F5F9',
                        color: STATUS_FG[s.status] || '#64748B',
                      }}
                    >
                      {STATUS_LABEL[s.status] || s.status}
                    </span>
                  </td>
                  <td style={td}>{s.checkInTime ? s.checkInTime.slice(0, 5) : '-'}</td>
                  <td style={td}>{s.justification || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

const th: React.CSSProperties = {
  padding: '10px 12px',
  textAlign: 'left',
  fontSize: 11.5,
  color: '#64748B',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};
const td: React.CSSProperties = { padding: '10px 12px', verticalAlign: 'middle' };