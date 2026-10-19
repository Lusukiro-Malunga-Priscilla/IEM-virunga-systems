import React from 'react';
import AnnouncementsBoard from './AnnouncementsBoard';

interface Props {
  currentTeacher: { username: string; fullName: string };
}

/** Wire this up with whatever gives you the logged-in teacher's identity today. */
export default function TeacherAnnouncementsPage({ currentTeacher }: Props) {
  return (
    <AnnouncementsBoard
      currentUser={{ ...currentTeacher, role: 'TEACHER' }}
      title="Announcements"
    />
  );
}