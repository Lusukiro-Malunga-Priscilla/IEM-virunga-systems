import React from 'react';
import AnnouncementsBoard from './AnnouncementsBoard';

interface Props {
  currentStudent: { username: string; fullName: string };
}

/** Wire this up with whatever gives you the logged-in student's identity today. */
export default function StudentAnnouncementsPage({ currentStudent }: Props) {
  return (
    <AnnouncementsBoard
      currentUser={{ ...currentStudent, role: 'STUDENT' }}
      title="Announcements"
    />
  );
}