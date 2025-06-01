package org.example.controllers;

import org.example.models.User;
import org.example.daos.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController//user controller allowing for front end requests
@CrossOrigin
@RequestMapping("/api/users")
//@PreAuthorize("hasAuthority('ADMIN')")//commenting out bc it blocked proifles being public
public class UserController {

    @Autowired    //controller fetches with UserDao
    private UserDao userDao;

    //gets all users
    @GetMapping
    public List<User> getAll() {
        return userDao.getUsers();
    }

    /**
     * gets user via username
     *
     * @param username
     * @return username of said user
     */
    @GetMapping("/{id}")
public User getById(@PathVariable Long id) {
    return userDao.getUserById(id); 
}

@GetMapping("/username/{username}")
public User getByUsername(@PathVariable String username) {
    return userDao.getUserByUsername(username);
}
    /**
     * new user created
     *
     * @param user user being created
     * @return created user
     */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    @PreAuthorize("permitAll()")
    public User create(@RequestBody User user) {
        // ensure role is not null and is uppercase
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("USER");
        } else {
            user.setRole(user.getRole().toUpperCase());
        }

        return userDao.createUser(user);
    }

    /**
     * update password of specific user
     *
     * @param password new password
     * @param username username of user
     * @return updated user
     */
    @PutMapping(path = "/{username}/password")
    public User updatePassword(@RequestBody String password, @PathVariable String username) {
        User user = userDao.getUserByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
        user.setPassword(password);
        return userDao.updatePassword(user);
    }

    /**
     * delete user
     *
     * @param username username being deleted
     */
    @DeleteMapping(path = "/{username}")
    public int delete(@PathVariable String username) {
        return userDao.deleteUser(username);
    }

    /**
     * Gets all of user's roles
     *
     * @return A list of all roles for user.
     */
    @GetMapping(path = "/{username}/roles")
    public List<String> getRoles(@PathVariable String username) {
        return userDao.getRoles(username);
    }

    /**

     * @param username username of the user
     * @param role     role added
     * @return list of all user roles
     */
    @PostMapping(path = "/{username}/roles")
    public List<String> addRole(@PathVariable String username, @RequestBody String role) {
        return userDao.addRole(username, role.toUpperCase());
    }

    /**
     * Deletes a role from a user.
     *
     * @param username 
     * @param role     //role being deleted
     */
    @DeleteMapping(path = "/{username}/roles/{role}")
    public int deleteRole(@PathVariable String username, @PathVariable String role) {
        var affectedRows = userDao.deleteRole(username, role.toUpperCase());
        if (affectedRows == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found");
        } else {
            return affectedRows;
        }
    }
    // endpoint for profile list page
}