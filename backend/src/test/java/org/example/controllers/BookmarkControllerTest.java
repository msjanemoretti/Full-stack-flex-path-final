package org.example.controllers;

import org.example.repositories.BookmarkRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;

@WebMvcTest(BookmarkController.class)
@ActiveProfiles("test")
public class BookmarkControllerTest {

    @Autowired
    private MockMvc mockMvc;

  @MockBean
    private BookmarkRepository bookmarkRepository;

        @Test
    public void testGetAllBookmarks() throws Exception {
        when(bookmarkRepository.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/bookmarks"))
               .andExpect(status().isOk());
    }
}
