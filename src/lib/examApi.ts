// src/lib/examApi.ts
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

export interface Exam {
  id?: number;
  title: string;
  subject: string;
  studentClass: string;
  examDate: string;
  examType: string;
  maxScore: number;
  duration?: number | null;
  description?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  createdByTeacher?: { id: number; prenom?: string; nom?: string } | null;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  attachmentMime?: string | null;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const examApi = {
  listAll: () =>
    fetch(`${API_BASE}/api/exams`, { headers: authHeaders() }).then(handle<Exam[]>),

  listMine: () =>
    fetch(`${API_BASE}/api/exams/me`, { headers: authHeaders() }).then(handle<Exam[]>),

  get: (id: number) =>
    fetch(`${API_BASE}/api/exams/${id}`, { headers: authHeaders() }).then(handle<Exam>),

  create: (payload: Exam) =>
    fetch(`${API_BASE}/api/exams`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(handle<Exam>),

  update: (id: number, payload: Partial<Exam>) =>
    fetch(`${API_BASE}/api/exams/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(handle<Exam>),

  remove: (id: number) =>
    fetch(`${API_BASE}/api/exams/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handle<void>),

  bulkImport: (exams: Exam[]) =>
    fetch(`${API_BASE}/api/exams/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(exams),
    }).then(handle<{ imported: number; errors: string[]; exams: Exam[] }>),
};

/** Parse a CSV string into rows (naive, no quotes inside values). */
export function parseCsv(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  return lines.map(l => l.split(",").map(c => c.trim()));
}

/** Convert parsed CSV rows to Exam objects (skip header row). */
export function csvToExams(rows: string[][]): { exams: Exam[]; errors: string[] } {
  const errors: string[] = [];
  const exams: Exam[] = [];
  if (rows.length < 2) {
    errors.push("Le fichier CSV est vide ou ne contient qu'une ligne d'en-tete.");
    return { exams, errors };
  }
  // Skip header, expect: titre,matiere,classe,date,type,note_max,duree
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (r.length < 4) { errors.push(`Ligne ${i + 1}: trop peu de colonnes`); continue; }
    const [titre, matiere, classe, date, type, noteMax, duree] = r;
    if (!titre) { errors.push(`Ligne ${i + 1}: titre manquant`); continue; }
    exams.push({
      title: titre,
      subject: matiere || "",
      studentClass: classe || "",
      examDate: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().slice(0, 10),
      examType: (type || "EXAM").toUpperCase(),
      maxScore: noteMax ? Number(noteMax) : 20,
      duration: duree ? Number(duree) : null,
      description: "",
      status: "DRAFT",
    });
  }
  return { exams, errors };
}

/** Read a File as a base64 data URL. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Impossible de lire le fichier."));
    reader.readAsDataURL(file);
  });
}