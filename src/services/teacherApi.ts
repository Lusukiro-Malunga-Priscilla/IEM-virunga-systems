// src/services/teacherApi.ts
//
// Thin fetch wrapper around the Spring Boot TeacherController.
// Uses the same auth-token lookup as the rest of the app.

const API_BASE = "";

const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

function isJwtLike(value: unknown): value is string {
  return typeof value === "string" && JWT_PATTERN.test(value);
}

function findTokenInStorage(storage: Storage): string | null {
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!key) continue;
    const raw = storage.getItem(key);
    if (!raw) continue;
    if (isJwtLike(raw)) return raw;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        for (const v of Object.values(parsed)) {
          if (isJwtLike(v)) return v as string;
        }
      }
    } catch {
      // not JSON, ignore
    }
  }
  return null;
}

function getAuthToken(): string | null {
  return findTokenInStorage(localStorage) || findTokenInStorage(sessionStorage);
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return data?.message || data?.error || fallback;
  } catch {
    return fallback;
  }
}

export interface TeacherForm {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string | null;
  type?: string;
  coursDispense?: string | null;
  dateEmbauche?: string | null;
  journeePedagogique?: string | null;
  matricule?: string | null;
  qualification?: string | null;
  fonction?: string | null;
  nationality?: string | null;
  photo?: string | null;
  disponible?: boolean;
}

export interface Teacher extends TeacherForm {
  id: number;
  temporaryPassword?: string;
}

export const teacherApi = {
  async list(): Promise<Teacher[]> {
    const res = await fetch(`${API_BASE}/api/teachers`, {
      headers: { ...authHeaders() },
    });
    if (!res.ok) {
      throw new ApiError(
        await parseErrorMessage(res, "Impossible de charger les enseignants."),
        res.status
      );
    }
    return res.json();
  },

  async create(form: TeacherForm): Promise<Teacher> {
    const payload = {
      prenom: form.prenom,
      nom: form.nom,
      email: form.email,
      telephone: form.telephone || null,
      type: form.type,
      coursDispense: form.coursDispense || null,
      dateEmbauche: form.dateEmbauche || null,
      journeePedagogique: form.journeePedagogique || null,
      matricule: form.matricule || null,
      qualification: form.qualification || null,
      fonction: form.fonction || null,
      nationality: form.nationality || null,
      photo: form.photo || null,
    };

    const res = await fetch(`${API_BASE}/api/teachers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new ApiError(
        await parseErrorMessage(res, "Impossible d'enregistrer l'enseignant."),
        res.status
      );
    }

    const data = await res.json();
    if (data && data.teacher) {
      return { ...data.teacher, temporaryPassword: data.temporaryPassword };
    }
    return data;
  },

  async update(id: number, form: TeacherForm): Promise<Teacher> {
    const payload = {
      prenom: form.prenom,
      nom: form.nom,
      email: form.email,
      telephone: form.telephone || null,
      type: form.type,
      coursDispense: form.coursDispense || null,
      dateEmbauche: form.dateEmbauche || null,
      journeePedagogique: form.journeePedagogique || null,
      qualification: form.qualification || null,
      fonction: form.fonction || null,
      nationality: form.nationality || null,
      photo: form.photo || null,
      disponible: form.disponible,
    };

    const res = await fetch(`${API_BASE}/api/teachers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new ApiError(
        await parseErrorMessage(res, "Impossible de mettre a jour l'enseignant."),
        res.status
      );
    }
    return res.json();
  },

  async toggleAvailability(id: number): Promise<Teacher> {
    const res = await fetch(`${API_BASE}/api/teachers/${id}/toggle-availability`, {
      method: "PATCH",
      headers: { ...authHeaders() },
    });
    if (!res.ok) {
      throw new ApiError(
        await parseErrorMessage(res, "Echec de la mise a jour du statut."),
        res.status
      );
    }
    return res.json();
  },

  async remove(id: number): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/teachers/${id}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    });
    if (!res.ok && res.status !== 204) {
      throw new ApiError(
        await parseErrorMessage(res, "Echec de la suppression."),
        res.status
      );
    }
    return true;
  },
};