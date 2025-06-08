package org.example.controllers;

import org.example.models.Book;
import org.example.repositories.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List; 
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/books")

public class BookController {

    @Autowired
    private BookRepository bookRepository;
    

    // Get all books
    @GetMapping
    public List<Book> getAllBooks() { //returns all books in database
        return bookRepository.findAll();
    }

    //get book by id
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
public ResponseEntity<Book> getBookById(@PathVariable Long id) {
    return bookRepository.findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
}

    // Create new book
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public Book createBook(@RequestBody Book book) {
        return bookRepository.save(book);
    }

    // Delete  by ID
    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
     if (!bookRepository.existsById(id)) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Title not found"); //returns this message when deleting nonexistent book
     }   
        bookRepository.deleteById(id);
    }

    //updating info on a book by id
    
   @PutMapping("/{id}")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public Book updateBook(@PathVariable Long id, @RequestBody Book updatedBook) {
    return bookRepository.findById(id)
        .map(book -> {
            book.setTitle(updatedBook.getTitle());
            book.setAuthor(updatedBook.getAuthor());
            book.setDescription(updatedBook.getDescription());
            book.setGenre(updatedBook.getGenre()); // ✅ this was missing!

            return bookRepository.save(book);
        })
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Title not found"));
}
}