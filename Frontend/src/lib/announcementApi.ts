import { Announcement, AnnouncementDraft, AnnouncementReply, Role } from '../types/announcement';

const API_BASE = '/api/announcements';

// Adjust this to however the app already stores its auth token.
function authHeaders(): HeadersInit {
  const TOKEN_KEYS = ['scolagest-auth-token', 'token', 'access_token', 'accessToken', 'jwt'];
  let token: string | null = null;
  for (const k of TOKEN_KEYS) {
    const v = localStorage.getItem(k) ?? sessionStorage.getItem(k);
    if (v) { token = v; break; }
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error('Replies are turned off for this announcement.');
    }
    throw new Error(`Request failed (${res.status})`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export async function fetchAllAnnouncements(): Promise<Announcement[]> {
  const res = await fetch(API_BASE, { headers: { ...authHeaders() } });
  return handle<Announcement[]>(res);
}

export async function fetchAnnouncementsForRole(role: Role): Promise<Announcement[]> {
  const res = await fetch(`${API_BASE}/for/${role}`, { headers: { ...authHeaders() } });
  return handle<Announcement[]>(res);
}

export async function createAnnouncement(draft: AnnouncementDraft): Promise<Announcement> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(draft),
  });
  return handle<Announcement>(res);
}

export async function updateAnnouncement(id: number, draft: AnnouncementDraft): Promise<Announcement> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(draft),
  });
  return handle<Announcement>(res);
}

export async function deleteAnnouncement(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: { ...authHeaders() } });
  return handle<void>(res);
}

export async function fetchReplies(announcementId: number): Promise<AnnouncementReply[]> {
  const res = await fetch(`${API_BASE}/${announcementId}/replies`, { headers: { ...authHeaders() } });
  return handle<AnnouncementReply[]>(res);
}

export async function postReply(
  announcementId: number,
  reply: { authorUsername: string; authorName: string; authorRole: string; message: string }
): Promise<AnnouncementReply> {
  const res = await fetch(`${API_BASE}/${announcementId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(reply),
  });
  return handle<AnnouncementReply>(res);
}
