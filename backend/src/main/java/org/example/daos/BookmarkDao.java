package org.example.daos;

import org.example.models.Bookmark;
import org.example.repositories.BookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class BookmarkDao {
    

    @Autowired
    private BookmarkRepository bookmarkRepository;

    //create/update bookmarks
    public Bookmark saveBookmark(Bookmark bookmark) {
         return bookmarkRepository.save(bookmark);
    }

    //get all bookmarks
    public List<Bookmark> getAllBookMarks() {
        return bookmarkRepository.findAll();
    }

    //get by id
    public Optional<Bookmark> getBookmarkById(Long id) {
        return bookmarkRepository.findById(id);
    }

    public void deleteBookMark(Long id) {
        bookmarkRepository.deleteById(id);
    }

    //all bookmarks for a user

    public List<Bookmark> getBookMarksByUserId(Long userId) {
        return bookmarkRepository.findByUserId(userId);
    }





}
