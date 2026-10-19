import React, { useEffect, useState, useCallback } from 'react';
import { Announcement, AUDIENCE_LABEL, Role } from '../types/announcement';
import { fetchAnnouncementsForRole } from '../api/announcementApi';
import ReplyThread from './ReplyThread';

interface CurrentUser {
  username: string;
  fullName: string;
  role: Role;
}

interface Props {
  currentUser: CurrentUser;
  /** Optional: pass a heading override, e.g. "Announcements" / "Staff notices". */
  title?: string;
  /** Poll for new announcements every N ms. Default 20s, 0 disables polling. */
  pollIntervalMs?: number;
}

const ink = '#16233a';
const paper = '#faf8f3';
const line = '#e4e0d6';
const muted = '#6b7280';

const AUDIENCE_COLOR: Record<string, string> = {
  ALL: '#1f8a70',
  STAFF: '#16233a',
  TEACHERS: '#c98a2c',
  STUDENTS: '#a23e5c',
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AnnouncementsBoard({ currentUser, title, pollIntervalMs = 20000 }: Props) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchAnnouncementsForRole(currentUser.role);
      setAnnouncements(data);
      setError(null);
    } catch {
      setError('Could not load announcements.');
    } finally {
      setLoading(false);
    }
  }, [currentUser.role]);

  useEffect(() => {
    load();
    if (!pollIntervalMs) return;
    const id = setInterval(load, pollIntervalMs);
    return () => clearInterval(id);
  }, [load, pollIntervalMs]);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            fontFamily: "Georgia, 'Iowan Old Style', serif",
            fontSize: 26,
            color: ink,
            margin: '0 0 4px',
          }}
        >
          {title ?? 'Announcements'}
        </h1>
        <p style={{ color: muted, fontSize: 13.5, margin: 0 }}>
          Showing what's posted for {currentUser.role.toLowerCase()}s
          {currentUser.role !== 'ADMIN' ? ' and for everyone' : ''}.
        </p>
      </div>

      {loading && <p style={{ color: muted }}>Loading announcements…</p>}
      {error && <p style={{ color: '#c1495b' }}>{error}</p>}
      {!loading && !error && announcements.length === 0 && (
        <p style={{ color: muted }}>Nothing posted yet — check back later.</p>
      )}

      <div style={{ borderTop: announcements.length ? `1px solid ${line}` : 'none' }}>
        {announcements.map((a) => {
          const isOpen = openId === a.id;
          return (
            <article
              key={a.id}
              style={{
                borderBottom: `1px solid ${line}`,
                padding: '18px 4px',
                background: paper,
                display: 'flex',
                gap: 14,
              }}
            >
              <div style={{ width: 4, borderRadius: 2, background: AUDIENCE_COLOR[a.audience] ?? ink, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                  <h2 style={{ fontFamily: "Georgia, 'Iowan Old Style', serif", fontSize: 18.5, margin: 0, color: ink }}>
                    {a.title}
                  </h2>
                  <span
                    style={{
                      fontSize: 11.5,
                      color: AUDIENCE_COLOR[a.audience] ?? ink,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {AUDIENCE_LABEL[a.audience]}
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: muted, margin: '3px 0 10px' }}>
                  {a.authorName ?? a.authorUsername ?? 'Administration'} · {timeAgo(a.createdAt)}
                </p>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#2b2b2b', margin: '0 0 10px', whiteSpace: 'pre-wrap' }}>
                  {a.message}
                </p>

                <button
                  onClick={() => setOpenId(isOpen ? null : a.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: ink,
                    fontSize: 13,
                    fontWeight: 600,
                    padding: 0,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  {isOpen ? 'Hide replies' : a.allowReplies ? 'Reply / view replies' : 'View replies'}
                </button>

                {isOpen && (
                  <ReplyThread announcementId={a.id} allowReplies={a.allowReplies} currentUser={currentUser} />
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}