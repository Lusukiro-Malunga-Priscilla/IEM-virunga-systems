package com.iem.backend.repository;

import com.iem.backend.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByBookId(String bookId);

    List<Book> findByStatus(String status);

    List<Book> findByBookNameContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrBookIdContainingIgnoreCase(
            String name, String author, String bookId);
}