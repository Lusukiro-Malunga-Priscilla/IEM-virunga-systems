// src/services/teacherApi.js

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

const BASE = "/api/teachers";

// ── Reuse the same token key your student API uses ──
// Change "token" below if your app stores the JWT under a different key.
const TOKEN_KEY = "token";

function authHeaders(extra = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = { ...extra };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function handle(res) {
  if (res.status === 204) return null;

  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }

  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && (body.message || body.error)) ||
      (typeof body === "string" && body) ||
      res.statusText ||
      `Erreur ${res.status}`;
    throw new ApiError(msg, res.status, body);
  }
  return body;
}

export const teacherApi = {
  list() {
    return fetch(BASE, { headers: authHeaders() }).then(handle);
  },
  create(payload) {
    return fetch(BASE, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    }).then(handle);
  },
  toggleAvailability(id) {
    return fetch(`${BASE}/${id}/toggle-availability`, {
      method: "PATCH",
      headers: authHeaders(),
    }).then(handle);
  },
};