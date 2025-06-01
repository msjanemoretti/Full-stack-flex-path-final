package org.example.controllers;

import org.example.models.User;
import org.example.security.JwtAuthenticationFilter;

import org.example.daos.UserDao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;


import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.example.security.JwtAuthenticationFilter;

// load ONLY the web layer
@ActiveProfiles("test")
@WebMvcTest(controllers = UserController.class,
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = JwtAuthenticationFilter.class
    )
)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc; // allows for running requests against controller

    @MockBean
    private UserDao userDao; // mocks DAO dependency

    private List<User> mockUsers;

    @BeforeEach
    public void setup() {
        // cfeate fake list of users
        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("user1");
        user1.setRole("USER");

        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("admin");
        user2.setRole("ADMIN");

        mockUsers = List.of(user1, user2);
    }

    @Test
    public void testGetAllUsers() throws Exception {
        // return fake users list from mock DAO
        when(userDao.getUsers()).thenReturn(mockUsers);

        // run GET request and check for OK status and the response returns usernames
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("user1"))
                .andExpect(jsonPath("$[1].username").value("admin"));
    }
}