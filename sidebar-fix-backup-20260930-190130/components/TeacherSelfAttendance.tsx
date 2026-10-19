import React, { useEffect, useState } from 'react';
import { attendanceApi } from '../lib/attendanceApi';
import { Attendance } from '../types/attendance';

interface Props {
  teacherUsername: string;
  teacherUserAccountId: number;
}

export default function TeacherSelfAttendance({ teacherUsername, teacherUserAccountId }: Props) {
  const [today, setToday] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadToday() {
    try {
      const all = await attendanceApi.getByUser(teacherUserAccountId);
      const todayStr = new Date().toISOString().slice(0, 10);
      setToday(all.find((a) => a.date === todayStr && a.attendeeType === 'TEACHER') || null);
    } catch {
      // ignore, first load can just be empty
    }
  }

  async function checkIn() {
    setLoading(true);
    setError(null);
    try {
      const result = await attendanceApi.teacherCheckIn(teacherUsername);
      setToday(result);
    } catch (e: any) {
      setError(e.message || "Ã‰chec du pointage");
    } finally {
      setLoading(false);
    }
  }

  const checkedIn = !!today;
  const late = today?.late;

  return (
    <div>
      <h2 style={{ fontSize: 18, marginBottom: 4 }}>Ma prÃ©sence</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        DÃ©but des cours : 07h30. Pointez votre arrivÃ©e en un clic.
      </p>

      <div
        style={{
          display: 'inline-block',
          padding: '20px 28px',
          borderRadius: 10,
          background: !checkedIn ? '#e2e8f0' : late ? '#f59e0b' : '#22c55e',
          color: !checkedIn ? '#334155' : '#fff',
          marginBottom: 16,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16 }}>
          {!checkedIn ? 'Pas encore pointÃ©' : late ? 'PrÃ©sent â€” en retard' : 'PrÃ©sent'}
        </div>
        {today?.checkInTime && (
          <div style={{ fontSize: 13, marginTop: 4 }}>
            ArrivÃ©e : {new Date(today.checkInTime).toLocaleTimeString().slice(0, 5)}
          </div>
        )}
      </div>

      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      <div>
        <button
          onClick={checkIn}
          disabled={loading || checkedIn}
          style={{
            background: checkedIn ? '#cbd5e1' : '#2563eb', color: '#fff', border: 'none', borderRadius: 6,
            padding: '10px 18px', cursor: checkedIn ? 'not-allowed' : 'pointer', fontWeight: 600,
          }}
        >
          {checkedIn ? 'DÃ©jÃ  pointÃ© aujourd\'hui' : loading ? 'Pointageâ€¦' : 'Marquer ma prÃ©sence'}
        </button>
      </div>
    </div>
  );
}