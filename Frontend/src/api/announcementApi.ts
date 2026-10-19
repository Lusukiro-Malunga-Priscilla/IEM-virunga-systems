// src/api/announcementApi.ts
// HTTP client for the announcements feature.

import type { Announcement, AnnouncementDraft } from '../types/announcement';
import { apiUrl, ApiError } from '../lib/courseApi';

const TOKEN_KEYS = ['scolagest-auth-token', 'token', 'access_token', 'accessToken', 'jwt'] as const;

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

async function handle(res: Response) {
  // Auto-logout on expired / invalid token
  if (res.status === 401 || res.status === 403) {
    try {
      localStorage.removeItem("scolagest-auth-token");
      localStorage.removeItem("scolagest-auth-user");
    } catch {}
    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new ApiError("Session expirée. Veuillez vous reconnecter.", res.status);
  }

  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const body = await res.json();
      message = body?.message || body?.error || message;
    } catch {}
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : apiUrl(path);
  const res = await fetch(url, {
    credentials: 'include',
    ...init,
    headers: {
      ...authHeaders(),
      ...((init.headers as Record<string, string>) || {}),
    },
  });
  return handle(res) as Promise<T>;
}

// â”€â”€â”€ Endpoints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function fetchAllAnnouncements(): Promise<Announcement[]> {
  return request<Announcement[]>('/announcements');
}

export function fetchAnnouncementById(id: number): Promise<Announcement> {
  return request<Announcement>(`/announcements/${id}`);
}

export function createAnnouncement(payload: AnnouncementDraft): Promise<Announcement> {
  return request<Announcement>('/announcements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function updateAnnouncement(id: number, payload: AnnouncementDraft): Promise<Announcement> {
  return request<Announcement>(`/announcements/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function deleteAnnouncement(id: number): Promise<null> {
  return request<null>(`/announcements/${id}`, { method: 'DELETE' });
}