// src/lib/statsApi.ts
const API_BASE = "";

const JWT = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
function getToken(): string | null {
  for (const s of [localStorage, sessionStorage]) {
    for (let i = 0; i < s.length; i++) {
      const v = s.getItem(s.key(i) || "");
      if (v && JWT.test(v)) return v;
      try {
        const p = JSON.parse(v || "");
        for (const iv of Object.values(p))
          if (typeof iv === "string" && JWT.test(iv)) return iv;
      } catch {}
    }
  }
  return null;
}
function h(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
async function j<T>(url: string): Promise<T> {
  const res = await fetch(API_BASE + url, { headers: h() });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

export interface GlobalStats {
  studentsTotal: number;
  studentsActive: number;
  teachersTotal: number;
  teachersAvailable: number;
  coursesTotal: number;
  attendanceToday: number;
  reportsThisWeek: number;
  reportsTotal: number;
  paymentsThisMonth: number;
}

export async function loadGlobalStats(): Promise<GlobalStats> {
  const safe = async <T>(p: Promise<T>, fallback: T): Promise<T> => {
    try { return await p; } catch { return fallback; }
  };

  const students = await safe(j<any[]>("/api/students"), []);
  const teachers = await safe(j<any[]>("/api/teachers"), []);
  const courses  = await safe(j<any[]>("/api/courses"),  []);
  const attendance = await safe(j<any[]>("/api/attendance"), []);
  const payments = await safe(j<any[]>("/api/payments"), []);
  const reportStats = await safe(
    j<{ total: number; thisWeek: number }>("/api/reports/stats"),
    { total: 0, thisWeek: 0 }
  );

  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);

  return {
    studentsTotal:    students.length,
    studentsActive:   students.filter((s: any) => s.active !== false).length,
    teachersTotal:    teachers.length,
    teachersAvailable: teachers.filter((t: any) => t.disponible !== false).length,
    coursesTotal:     courses.length,
    attendanceToday:  attendance.filter((a: any) => a.date === today).length,
    reportsThisWeek:  reportStats.thisWeek,
    reportsTotal:     reportStats.total,
    paymentsThisMonth: payments
      .filter((p: any) => (p.paymentDate || "").startsWith(month))
      .reduce((sum: number, p: any) => sum + Number(p.paidAmount || 0), 0),
  };
}

/** Group attendance rows by ISO date. */
export function groupAttendanceByDay(
  rows: any[],
  days = 30
): { date: string; present: number; total: number }[] {
  const buckets: Record<string, { present: number; total: number }> = {};
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000).toISOString().slice(0, 10);
    buckets[d] = { present: 0, total: 0 };
  }
  for (const r of rows) {
    const d = (r.date || "").slice(0, 10);
    if (!(d in buckets)) continue;
    buckets[d].total += 1;
    if (r.present === true) buckets[d].present += 1;
  }
  return Object.entries(buckets).map(([date, v]) => ({ date, ...v }));
}

/** Top teachers by number of reports. */
export function topTeachersByReports(
  reports: any[],
  limit = 5
): { teacherId: number; name: string; count: number }[] {
  const map = new Map<number, { name: string; count: number }>();
  for (const r of reports) {
    if (r.teacherId == null) continue;
    const cur = map.get(r.teacherId) || { name: r.teacherName || `#${r.teacherId}`, count: 0 };
    cur.count += 1;
    cur.name = r.teacherName || cur.name;
    map.set(r.teacherId, cur);
  }
  return Array.from(map.entries())
    .map(([id, v]) => ({ teacherId: id, name: v.name, count: v.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}