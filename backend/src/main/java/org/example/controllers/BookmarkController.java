package org.example.controllers;

import org.example.models.Book;
import org.example.models.Bookmark;
import org.example.models.User;
import org.example.repositories.BookRepository;
import org.example.repositories.BookmarkRepository;
import org.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")//route for front end requests and Postman
@CrossOrigin(origins = "http://localhost:5173")
public class BookmarkController {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    // get all bookMarks
    @GetMapping
    public List<Bookmark> getAllBookmarks() {
        return bookmarkRepository.findAll();
    }

    // add a bookmark
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;


    
    @PostMapping
    public Bookmark createBookmark(@RequestBody Bookmark bookmark) {
        User fullUser = userRepository.findById(bookmark.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Book fullBook = bookRepository.findById(bookmark.getBook().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

        bookmark.setUser(fullUser);
        bookmark.setBook(fullBook);

        return bookmarkRepository.save(bookmark);
    }

    // by id
    @GetMapping("/{id}")
    public Bookmark getBookmarkById(@PathVariable Long id) {
        return bookmarkRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bookmark not found"));
    }

    //by user id
    @GetMapping("/user/{userId}")
    public List<Bookmark> getBookmarksByUserId(@PathVariable Long userId) {
        return bookmarkRepository.findByUserId(userId);
    }

    
    
    // delete by bookmark id
    @DeleteMapping("/{id}")
    public void deleteBookmark(@PathVariable Long id) {
        bookmarkRepository.deleteById(id);
    }
}
