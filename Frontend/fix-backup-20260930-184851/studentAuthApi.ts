// src/lib/studentAuthApi.ts
const API_BASE = "";

async function handle<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as any).error || (body as any).message || `HTTP ${res.status}`);
  }
  return body as T;
}

export const studentAuthApi = {
  register: (fullName: string, dateOfBirth: string) =>
    fetch(`${API_BASE}/api/auth/student/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, dateOfBirth }),
    }).then(handle<{ success: boolean; message: string; email: string; studentId: number }>),

  verifyOtp: (email: string, otp: string, password: string, studentId: number) =>
    fetch(`${API_BASE}/api/auth/student/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password, studentId }),
    }).then(handle<{ success: boolean; token: string; user: any }>),

  login: (fullName: string, password: string) =>
    fetch(`${API_BASE}/api/auth/student/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, password }),
    }).then(handle<{ success: boolean; token: string; user: any }>),

  forgot: (fullName: string) =>
    fetch(`${API_BASE}/api/auth/student/forgot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName }),
    }).then(handle<{ success: boolean; message: string; email: string }>),

  reset: (email: string, otp: string, password: string) =>
    fetch(`${API_BASE}/api/auth/student/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password }),
    }).then(handle<{ success: boolean; message: string }>),
};