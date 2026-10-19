// src/lib/studentApi.ts
const TOKEN_KEYS = ['scolagest-auth-token', 'token', 'access_token', 'accessToken', 'jwt'];

function getToken(): string | null {
  try {
    for (const k of TOKEN_KEYS) {
      const v = localStorage.getItem(k) ?? sessionStorage.getItem(k);
      if (v) return v;
    }
  } catch {}
  return null;
}

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getToken();
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export interface StudentDashboard {
  student?: {
    id?: number;
    fullName?: string;
    studentClass?: string;
    section?: string;
    registrationNumber?: string;
    email?: string;
    nationality?: string;
    enrollmentStatus?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

async function handle<T>(res: Response): Promise<T> {
  if (res.status === 401 || res.status === 403) {
    throw new Error('Session expiree. Veuillez vous reconnecter.');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return null as unknown as T;
  return res.json() as Promise<T>;
}

export const studentApi = {
  me(): Promise<StudentDashboard> {
    return fetch('/api/students/me/dashboard', { headers: authHeaders() }).then(handle<StudentDashboard>);
  },
};
