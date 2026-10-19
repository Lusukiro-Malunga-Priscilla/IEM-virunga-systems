// src/lib/reportApi.ts
const API_BASE = "";

const JWT = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
function getToken(): string | null {
  for (const store of [localStorage, sessionStorage]) {
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (!k) continue;
      const v = store.getItem(k);
      if (!v) continue;
      if (JWT.test(v)) return v;
      try {
        const p = JSON.parse(v);
        if (p && typeof p === "object") {
          for (const iv of Object.values(p)) {
            if (typeof iv === "string" && JWT.test(iv)) return iv;
          }
        }
      } catch {}
    }
  }
  return null;
}

function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export interface TeacherReport {
  id: number;
  reportDate: string;
  summary: string;
  classesTaught: string;
  hoursWorked: number | null;
  issues: string;
  achievements: string;
  status: string;
  teacherId: number | null;
  teacherName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportPayload {
  reportDate: string;
  summary: string;
  classesTaught: string;
  hoursWorked: number | null;
  issues: string;
  achievements: string;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const reportApi = {
  create: (payload: ReportPayload) =>
    fetch(`${API_BASE}/api/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(handle<TeacherReport>),

  mine: () =>
    fetch(`${API_BASE}/api/reports/me`, { headers: authHeaders() })
      .then(handle<TeacherReport[]>),

  today: () =>
    fetch(`${API_BASE}/api/reports/me/today`, { headers: authHeaders() })
      .then(handle<TeacherReport | undefined>),

  list: (params?: { teacherId?: number; from?: string; to?: string }) => {
    const qs = new URLSearchParams();
    if (params?.teacherId) qs.set("teacherId", String(params.teacherId));
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    return fetch(`${API_BASE}/api/reports?${qs}`, { headers: authHeaders() })
      .then(handle<TeacherReport[]>);
  },

  get: (id: number) =>
    fetch(`${API_BASE}/api/reports/${id}`, { headers: authHeaders() })
      .then(handle<TeacherReport>),

  update: (id: number, payload: Partial<ReportPayload>) =>
    fetch(`${API_BASE}/api/reports/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(handle<TeacherReport>),

  remove: (id: number) =>
    fetch(`${API_BASE}/api/reports/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handle<void>),

  stats: () =>
    fetch(`${API_BASE}/api/reports/stats`, { headers: authHeaders() })
      .then(handle<{ total: number; thisWeek: number; thisMonth: number; today: number }>),
};