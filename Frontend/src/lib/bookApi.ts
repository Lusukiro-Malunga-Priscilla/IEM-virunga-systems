// src/lib/bookApi.ts
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

export interface Book {
  id?: number;
  bookName: string;
  bookId: string;
  author: string;
  status: string;         // AVAILABLE | ISSUED
  issuerCardId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const bookApi = {
  list: (q?: string) => {
    const qs = q ? `?q=${encodeURIComponent(q)}` : "";
    return fetch(`${API_BASE}/api/books${qs}`, { headers: authHeaders() })
      .then(handle<Book[]>);
  },
  get: (id: number) =>
    fetch(`${API_BASE}/api/books/${id}`, { headers: authHeaders() })
      .then(handle<Book>),
  create: (book: Book) =>
    fetch(`${API_BASE}/api/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(book),
    }).then(handle<Book>),
  update: (id: number, book: Partial<Book>) =>
    fetch(`${API_BASE}/api/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(book),
    }).then(handle<Book>),
  remove: (id: number) =>
    fetch(`${API_BASE}/api/books/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handle<void>),
};