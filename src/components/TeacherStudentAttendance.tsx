// src/components/TeacherStudentAttendance.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { attendanceApi } from '../lib/attendanceApi';
import { getAllStudents, Student } from '../lib/api';
import { ClassAttendanceEntry, SCHOOL_START_TIME } from '../types/attendance';

interface Props {
  teacherUsername?: string;
  course?: string;
}

type LocalMark = { present: boolean; late: boolean; justification: string };

function isNowAfterSchoolStart(): boolean {
  const now = new Date();
  const [h, m] = SCHOOL_START_TIME.split(':').map(Number);
  return now.getHours() > h || (now.getHours() === h && now.getMinutes() > m);
}

export default function TeacherStudentAttendance({ teacherUsername = '', course = '' }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [marks, setMarks] = useState<Record<number, LocalMark>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);
  const lateByDefault = useMemo(() => isNowAfterSchoolStart(), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    getAllStudents()
      .then(data => { if (!cancelled) setStudents(data ?? []); })
      .catch((e: unknown) => {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Erreur de chargement');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  function toggle(studentId: number) {
    setSavedOk(false);
    setMarks((prev) => {
      const current = prev[studentId];
      if (!current || !current.present) {
        return { ...prev, [studentId]: { present: true, late: lateByDefault, justification: current?.justification || '' } };
      }
      return { ...prev, [studentId]: { present: false, late: false, justification: current.justification || '' } };
    });
  }

  function setJustification(studentId: number, text: string) {
    setMarks((prev) => ({
      ...prev,
      [studentId]: { present: prev[studentId]?.present ?? true, late: prev[studentId]?.late ?? false, justification: text },
    }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSavedOk(false);
    try {
      const entries: ClassAttendanceEntry[] = students.map((s) => {
        const m = marks[s.id];
        return {
          studentUserAccountId: s.id,
          present: !!m?.present,
          late: !!m?.late,
          justification: m?.justification || '',
        };
      });

      await attendanceApi.classCheckIn({
        teacherUsername,
        course,
        entries,
      });
      setSavedOk(true);
    } catch (e: any) {
      setError(e.message || "Echec de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Chargement des eleves...</p>;
  if (loadError) return <p style={{ color: '#ef4444' }}>Erreur : {loadError}</p>;

  return (
    <div>
      <h2 style={{ fontSize: 18, marginBottom: 4 }}>
        Presence des eleves {course ? '- ' + course : ''}
      </h2>
      <p style={{ color: '#64748b', marginBottom: 12 }}>
        Cliquez sur un eleve pour le marquer present (la case devient verte). Debut des cours : 07h30 -
        un eleve pointe apres cette heure est automatiquement marque "en retard" et doit fournir une justification.
      </p>

      {students.length === 0 && (
        <p style={{ color: '#94a3b8' }}>Aucun eleve trouve.</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 16 }}>
        {students.map((student) => {
          const mark = marks[student.id];
          const present = !!mark?.present;
          const late = !!mark?.late;
          const bg = !present ? '#e2e8f0' : late ? '#f59e0b' : '#22c55e';
          const color = !present ? '#334155' : '#fff';

          return (
            <div key={student.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 10 }}>
              <button
                onClick={() => toggle(student.id)}
                style={{
                  width: '100%', background: bg, color, border: 'none', borderRadius: 6,
                  padding: '12px 8px', cursor: 'pointer', fontWeight: 600, textAlign: 'left',
                }}
              >
                {student.fullName}
                <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4 }}>
                  {!present ? 'Non pointe' : late ? 'Present - en retard' : 'Present'}
                </div>
              </button>

              {present && late && (
                <textarea
                  placeholder="Justification du retard (obligatoire)"
                  value={mark?.justification || ''}
                  onChange={(e) => setJustification(student.id, e.target.value)}
                  style={{ width: '100%', marginTop: 8, padding: 6, fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 6 }}
                  rows={2}
                />
              )}
            </div>
          );
        })}
      </div>

      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {savedOk && <p style={{ color: '#16a34a' }}>Presence enregistree. Les eleves ont ete notifies par email et SMS.</p>}

      <button
        onClick={save}
        disabled={saving || students.length === 0}
        style={{
          background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6,
          padding: '10px 18px', cursor: 'pointer', fontWeight: 600,
        }}
      >
        {saving ? 'Enregistrement...' : "Enregistrer la presence de la classe"}
      </button>
    </div>
  );
}