package com.iem.backend.repository;

import com.iem.backend.model.AnnouncementReply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementReplyRepository extends JpaRepository<AnnouncementReply, Long> {

    List<AnnouncementReply> findByAnnouncementIdOrderByCreatedAtAsc(Long announcementId);
}