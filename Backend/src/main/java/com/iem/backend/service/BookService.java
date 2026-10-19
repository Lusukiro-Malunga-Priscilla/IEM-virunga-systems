package com.iem.backend.service;

import com.iem.backend.model.Book;
import com.iem.backend.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookService {

    private final BookRepository repo;

    public BookService(BookRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<Book> findAll() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Book findById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Book not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Book> search(String q) {
        if (q == null || q.isBlank()) return repo.findAll();
        return repo.findByBookNameContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrBookIdContainingIgnoreCase(q, q, q);
    }

    @Transactional
    public Book create(Book book) {
        normalize(book);
        if (book.getBookId() != null && !book.getBookId().isBlank()) {
            repo.findByBookId(book.getBookId()).ifPresent(b -> {
                throw new RuntimeException("Book ID already exists: " + book.getBookId());
            });
        }
        return repo.save(book);
    }

    @Transactional
    public Book update(Long id, Book patch) {
        Book book = findById(id);
        if (patch.getBookName() != null)    book.setBookName(patch.getBookName());
        if (patch.getBookId() != null)      book.setBookId(patch.getBookId());
        if (patch.getAuthor() != null)      book.setAuthor(patch.getAuthor());
        if (patch.getStatus() != null)      book.setStatus(patch.getStatus());
        if (patch.getIssuerCardId() != null) book.setIssuerCardId(patch.getIssuerCardId());
        normalize(book);
        return repo.save(book);
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }

    private void normalize(Book b) {
        if (b.getStatus() == null || b.getStatus().isBlank()) b.setStatus("AVAILABLE");
        // If available, issuer card must be cleared
        if ("AVAILABLE".equalsIgnoreCase(b.getStatus())) {
            b.setIssuerCardId(null);
        }
    }
}