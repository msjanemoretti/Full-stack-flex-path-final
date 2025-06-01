package org.example.models;

import jakarta.persistence.*;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String displayName;

    private String bio;
    private String profileImageUrl;
    @OneToOne
    @JoinColumn(name = "user_id", 
    referencedColumnName = "id", 
    columnDefinition = "BIGINT UNSIGNED",        // to not create conflicting fk's
nullable = false)
    

private User user;
    // getters n setters

    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public String getDisplayName() {
        return displayName;

    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getBio() {
        return bio;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
