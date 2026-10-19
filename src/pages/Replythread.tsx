import React, { useEffect, useState } from 'react';
import { AnnouncementReply, Role } from '../types/announcement';
import { fetchReplies, postReply } from '../api/announcementApi';

interface CurrentUser {
  username: string;
  fullName: string;
  role: Role;
}

interface Props {
  announcementId: number;
  allowReplies: boolean;
  currentUser: CurrentUser;
}

const ink = '#16233a';
const line = '#e4e0d6';
const muted = '#6b7280';

export default function ReplyThread({ announcementId, allowReplies, currentUser }: Props) {
  const [replies, setReplies] = useState<AnnouncementReply[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchReplies(announcementId)
      .then((data) => {
        if (!cancelled) setReplies(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load replies.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [announcementId]);

  async function handleSend() {
    if (!draft.trim()) return;
    setSending(true);
    setError(null);
    try {
      const saved = await postReply(announcementId, {
        authorUsername: currentUser.username,
        authorName: currentUser.fullName,
        authorRole: currentUser.role,
        message: draft.trim(),
      });
      setReplies((prev) => [...prev, saved]);
      setDraft('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your reply.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px dashed ${line}` }}>
      {loading ? (
        <p style={{ fontSize: 13, color: muted, margin: 0 }}>Loading replies…</p>
      ) : replies.length === 0 ? (
        <p style={{ fontSize: 13, color: muted, margin: '0 0 10px' }}>No replies yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: '0 0 14px', padding: 0, display: 'grid', gap: 10 }}>
          {replies.map((r) => (
            <li key={r.id} style={{ fontSize: 13.5 }}>
              <span style={{ fontWeight: 600, color: ink }}>{r.authorName || r.authorUsername}</span>
              <span style={{ color: muted }}>
                {' '}
                · {r.authorRole?.toLowerCase()} · {new Date(r.createdAt).toLocaleString()}
              </span>
              <p style={{ margin: '3px 0 0', color: '#2b2b2b', lineHeight: 1.5 }}>{r.message}</p>
            </li>
          ))}
        </ul>
      )}

      {allowReplies ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a reply…"
            rows={2}
            style={{
              flex: 1,
              resize: 'vertical',
              padding: '8px 10px',
              border: `1px solid ${line}`,
              borderRadius: 6,
              fontSize: 13.5,
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleSend}
            disabled={sending || !draft.trim()}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: 'none',
              background: sending || !draft.trim() ? '#c9c4b8' : ink,
              color: '#fff',
              fontSize: 13.5,
              cursor: sending || !draft.trim() ? 'default' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {sending ? 'Sending…' : 'Reply'}
          </button>
        </div>
      ) : (
        <p style={{ fontSize: 13, color: muted, fontStyle: 'italic', margin: 0 }}>
          Replies are turned off for this announcement.
        </p>
      )}

      {error && <p style={{ fontSize: 12.5, color: '#c1495b', marginTop: 6 }}>{error}</p>}
    </div>
  );
}   