package org.example.controllers;

import org.example.daos.UserDao;
import org.example.models.User;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;


/**
 * Controller for the profile of the currently logged in user.
 */
@RestController
@RequestMapping("/api/profile")
//@PreAuthorize("isAuthenticated()")
public class ProfileController {
    
    //handles
    @Autowired
    private UserDao userDao;

    /**
     * Gets the profile of the currently logged in user.
     *
     * @param principal The currently logged in user.
     * @return The profile of the currently logged in user.
     */
    
@GetMapping
public User getProfile() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();  // returns the correct username for bearer token, manual auth opposed to principal
    System.out.println("USERNAME: " + username);
    return userDao.getUserByUsername(username);
}

    /**
     * Gets the roles of the currently logged in user.
     *
     * @param principal The currently logged in user.
     * @return The roles of the currently logged in user.
     */
    @GetMapping("/roles")
    public List<String> getRoles(Principal principal) {
        String username = principal.getName();
        return userDao.getRoles(username);
    }

    /**
     * Changes the password of the currently logged in user.
     *
     * @param principal   The currently logged in user.
     * @param newPassword The new password.
     * @return The updated user.
     */
    @PutMapping("/change-password")
    public User changePassword(Principal principal, @RequestBody String newPassword) {
        String username = principal.getName();
        User user = userDao.getUserByUsername(username);
        user.setPassword(newPassword);

        return userDao.updatePassword(user);
    }
}
