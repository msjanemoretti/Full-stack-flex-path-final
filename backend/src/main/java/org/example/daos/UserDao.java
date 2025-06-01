package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.User;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * data access object for useRs
 */
@Component
public class UserDao {
    /**
     * the JDBC template for querying the database
     */
    private final JdbcTemplate jdbcTemplate;

    /**
     *  password encoder for the DAO
     */
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates new user data access object
     *
     * @param dataSource The data source for the DAO
     * @param passwordEncoder The password encoder for the DAO
     */
    public UserDao(DataSource dataSource, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Gets all users
     *
     * @return List of User
     */
    public List<User> getUsers() {
        return jdbcTemplate.query("SELECT * FROM users ORDER BY username;", this::mapToUser);
    }

    /**
     * Gets a user by username.
     *
     * @param username 
     * @return User
     */
    public User getUserByUsername(String username) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM users WHERE username = ?", this::mapToUser, username);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public User getUserById(Long id) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM users WHERE id = ?", this::mapToUser, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * creates a new user
     * @param user user being created
     * @return User The created user
     */
    public User createUser(User user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        String sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?);";
        try {
            jdbcTemplate.update(sql, user.getUsername(), hashedPassword, user.getRole());
            return getUserByUsername(user.getUsername());
        } catch (EmptyResultDataAccessException e) {
            throw new DaoException("Failed to create user.");
        }
    }

    /**
     * Updates a user's password
     *
     * @param user user being updated
     * @return User
     */
    public User updatePassword(User user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        String sql = "Update users Set password = ? WHERE username = ?";
        int rowsAffected = jdbcTemplate.update(sql, hashedPassword, user.getUsername());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        } else {
            return getUserByUsername(user.getUsername());
        }
    }

    /**
     * DeLetes a user
     *
     * @param username The username of the user
     */
    public int deleteUser(String username) {
        String sql = "DELETE FROM users WHERE username = ? ";
        return jdbcTemplate.update(sql, username);
    }

    /**
     * Gets all roles for a user
     *
     * @param username 
     * @return List of String
     */
    public List<String> getRoles(String username) {
        // find user to get id
        User user = getUserByUsername(username);
        
        
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        
        // query with user_id instead of username
        String sql = "SELECT role FROM roles WHERE user_id = ?";
        return jdbcTemplate.queryForList(sql, String.class, user.getId());
    }

    /**
     * Adds a role to a user.
     *
     * @param username 
     * @param role The role to add
     * @return list of xstring
     */
    public List<String> addRole(String username, String role) {
        try {
            User user = getUserByUsername(username);
            System.out.println("DEBUG: user = " + user);
            System.out.println("DEBUG: user.getId() = " + user.getId());//gives message in terminal as to why empty array returned
    
            if (user == null || user.getId() == null) {
                throw new IllegalArgumentException("User not found or missing ID for: " + username);
            }
    
            String sql = "INSERT INTO roles (user_id, role) VALUES (?, ?)";
            jdbcTemplate.update(sql, user.getId(), role);
        } catch (DataAccessException e) {
            System.err.println("Error adding role: " + e.getMessage());
        }
    
        return getRoles(username); // this is safe to leave here
    }
    /**
     * Delete  role from specific user.
     *
     * @param username user's username
     * @param role role being deleted
     */
    public int deleteRole(String username, String role) {
        User user = getUserByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
    
        String sql = "DELETE FROM roles WHERE user_id = ? AND role = ?";
        return jdbcTemplate.update(sql, user.getId(), role);
    }
    /**
     * Maps row in ResultSet to User object
     *
     * @param resultSet The result set to map
     * @param rowNumber The row number
     * @return User The user object
     * @throws SQLException errors that occur while mapping
     */
    private User mapToUser(ResultSet resultSet, int rowNumber) throws SQLException {
        User user = new User();
        user.setId(resultSet.getLong("id")); //solves blank array
        user.setUsername(resultSet.getString("username"));
        user.setPassword(resultSet.getString("password"));
        user.setRole(resultSet.getString("role"));
        return user;
    }
}
