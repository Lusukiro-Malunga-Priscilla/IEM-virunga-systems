import React, { useEffect, useState, useCallback } from 'react';
import { Announcement, AnnouncementDraft, AUDIENCE_LABEL } from '../types/announcement';
import {
  fetchAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../api/announcementApi';
import AnnouncementComposer from './AnnouncementComposer';

const ink = '#16233a';
const line = '#e4e0d6';
const muted = '#6b7280';

const AUDIENCE_COLOR: Record<string, string> = {
  ALL: '#1f8a70',
  STAFF: '#16233a',
  TEACHERS: '#c98a2c',
  STUDENTS: '#a23e5c',
};

interface Props {
  currentAdmin?: { username: string; fullName: string };
}

export default function AdminAnnouncementsPage({ currentAdmin: propAdmin }: Props) {
  const currentAdmin = propAdmin ?? (() => {
    try {
      const raw = localStorage.getItem('scolagest-auth-user');
      if (raw) {
        const u = JSON.parse(raw);
        return {
          username: u.email ?? u.username ?? 'admin',
          fullName: u.fullName ?? u.name ?? u.email ?? 'Administrateur',
        };
      }
    } catch {}
    return { username: 'admin', fullName: 'Administrateur' };
  })();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Announcement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllAnnouncements();
      setAnnouncements(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(draft: AnnouncementDraft) {
    if (editing) {
      await updateAnnouncement(editing.id, draft);
      setEditing(null);
    } else {
      await createAnnouncement(draft);
    }
    await load();
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this announcement? This cannot be undone.')) return;
    await deleteAnnouncement(id);
    await load();
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <h1
        style={{
          fontFamily: "Georgia, 'Iowan Old Style', serif",
          fontSize: 26,
          color: ink,
          margin: '0 0 4px',
        }}
      >
        Announcements
      </h1>
      <p style={{ color: muted, fontSize: 13.5, margin: '0 0 22px' }}>
        Post a notice for everyone, staff, teachers, or students â€” each group only sees what's meant for them.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 380px) 1fr', gap: 28, alignItems: 'start' }}>
        <AnnouncementComposer
          authorUsername={currentAdmin.username}
          authorName={currentAdmin.fullName}
          editing={editing}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditing(null)}
        />

        <div>
          {loading && <p style={{ color: muted }}>Loadingâ€¦</p>}
          {!loading && announcements.length === 0 && <p style={{ color: muted }}>No announcements posted yet.</p>}

          <div style={{ borderTop: announcements.length ? `1px solid ${line}` : 'none' }}>
            {announcements.map((a) => (
              <div
                key={a.id}
                style={{
                  borderBottom: `1px solid ${line}`,
                  padding: '14px 4px',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 4,
                    alignSelf: 'stretch',
                    borderRadius: 2,
                    background: AUDIENCE_COLOR[a.audience] ?? ink,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <h3 style={{ margin: '0 0 3px', fontSize: 15.5, color: ink }}>{a.title}</h3>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: AUDIENCE_COLOR[a.audience] ?? ink, whiteSpace: 'nowrap' }}>
                      {AUDIENCE_LABEL[a.audience]}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: 13, color: '#2b2b2b', lineHeight: 1.5 }}>{a.message}</p>
                  <p style={{ margin: 0, fontSize: 12, color: muted }}>
                    {new Date(a.createdAt).toLocaleString()} Â· {a.allowReplies ? 'replies on' : 'replies off'}
                    {a.replies?.length ? ` Â· ${a.replies.length} replies` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => setEditing(a)}
                    style={{
                      fontSize: 12.5,
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: `1px solid ${line}`,
                      background: '#fff',
                      cursor: 'pointer',
                      color: ink,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    style={{
                      fontSize: 12.5,
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: '1px solid #f0d3d9',
                      background: '#fff',
                      cursor: 'pointer',
                      color: '#c1495b',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}