package com.iem.backend.repository;

import com.iem.backend.model.Announcement;
import com.iem.backend.model.AnnouncementAudience;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findByAudienceIn(List<AnnouncementAudience> audiences, Sort sort);
}