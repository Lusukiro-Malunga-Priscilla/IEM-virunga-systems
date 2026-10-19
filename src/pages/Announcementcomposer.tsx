import React, { useState } from 'react';
import { Announcement, AnnouncementDraft, Audience, AUDIENCE_HINT, AUDIENCE_LABEL } from '../types/announcement';

const ink = '#16233a';
const line = '#e4e0d6';
const muted = '#6b7280';

const AUDIENCES: Audience[] = ['ALL', 'STAFF', 'TEACHERS', 'STUDENTS'];

interface Props {
  authorUsername: string;
  authorName: string;
  editing?: Announcement | null;
  onSubmit: (draft: AnnouncementDraft) => Promise<void>;
  onCancelEdit?: () => void;
}

const EMPTY: AnnouncementDraft = {
  title: '',
  message: '',
  audience: 'ALL',
  allowReplies: true,
  sendEmail: true,
  sendSms: false,
};

export default function AnnouncementComposer({ authorUsername, authorName, editing, onSubmit, onCancelEdit }: Props) {
  const [draft, setDraft] = useState<AnnouncementDraft>(
    editing
      ? {
          title: editing.title,
          message: editing.message,
          audience: editing.audience,
          allowReplies: editing.allowReplies,
          sendEmail: editing.sendEmail,
          sendSms: editing.sendSms,
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof AnnouncementDraft>(key: K, value: AnnouncementDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.message.trim()) {
      setError('Give the announcement a title and a message.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ ...draft, authorUsername, authorName });
      if (!editing) setDraft(EMPTY);
    } catch {
      setError('Could not save the announcement. Try again.');
    } finally {
      setSaving(false);
    }
  }

  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: ink, display: 'block', marginBottom: 5 };
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 11px',
    border: `1px solid ${line}`,
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: `1px solid ${line}`,
        borderRadius: 10,
        padding: 20,
        background: '#fff',
        display: 'grid',
        gap: 14,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 17, color: ink, fontFamily: "Georgia, 'Iowan Old Style', serif" }}>
        {editing ? 'Edit announcement' : 'New announcement'}
      </h2>

      <div>
        <label style={labelStyle}>Title</label>
        <input
          style={inputStyle}
          value={draft.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g. Parent-teacher meeting moved to Friday"
        />
      </div>

      <div>
        <label style={labelStyle}>Message</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical' }}
          rows={4}
          value={draft.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Write the announcement…"
        />
      </div>

      <div>
        <label style={labelStyle}>Who should see this</label>
        <div style={{ display: 'grid', gap: 8 }}>
          {AUDIENCES.map((a) => (
            <label
              key={a}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                border: `1px solid ${draft.audience === a ? ink : line}`,
                borderRadius: 8,
                padding: '9px 12px',
                cursor: 'pointer',
                background: draft.audience === a ? '#f4f1ea' : '#fff',
              }}
            >
              <input
                type="radio"
                name="audience"
                checked={draft.audience === a}
                onChange={() => update('audience', a)}
              />
              <span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: ink }}>{AUDIENCE_LABEL[a]}</span>
                <span style={{ display: 'block', fontSize: 12, color: muted }}>{AUDIENCE_HINT[a]}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: ink }}>
          <input type="checkbox" checked={draft.allowReplies} onChange={(e) => update('allowReplies', e.target.checked)} />
          Allow replies
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: ink }}>
          <input type="checkbox" checked={draft.sendEmail} onChange={(e) => update('sendEmail', e.target.checked)} />
          Also send by email
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: ink }}>
          <input type="checkbox" checked={draft.sendSms} onChange={(e) => update('sendSms', e.target.checked)} />
          Also send by SMS
        </label>
      </div>

      {error && <p style={{ color: '#c1495b', fontSize: 13, margin: 0 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '10px 18px',
            borderRadius: 7,
            border: 'none',
            background: ink,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: saving ? 'default' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Post announcement'}
        </button>
        {editing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            style={{
              padding: '10px 18px',
              borderRadius: 7,
              border: `1px solid ${line}`,
              background: '#fff',
              color: ink,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}