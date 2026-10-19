// src/lib/paymentApi.ts
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
function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export interface PaymentSummary {
  studentId: number;
  registrationNumber: string;
  fullName: string;
  studentClass: string;
  section: any;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  lastPaymentDate: string;
}

export interface Payment {
  id: number;
  student?: { id: number; fullName?: string; registrationNumber?: string };
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentDate: string;
  status: string;
}

export interface PaymentPayload {
  studentId: number;
  amount: number;
  totalAmount?: number;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const paymentApi = {
  summary: () =>
    fetch(`${API_BASE}/api/payments/summary`, { headers: authHeaders() })
      .then(handle<PaymentSummary[]>),

  historyFor: (studentId: number) =>
    fetch(`${API_BASE}/api/payments/student/${studentId}`, { headers: authHeaders() })
      .then(handle<Payment[]>),

  register: (payload: PaymentPayload) =>
    fetch(`${API_BASE}/api/payments/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(handle<Payment>),
};