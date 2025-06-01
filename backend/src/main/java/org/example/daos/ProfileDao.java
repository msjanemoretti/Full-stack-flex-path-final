package org.example.daos;

import org.example.models.Profile;
import org.example.repositories.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;


@Component
public class ProfileDao {

    @Autowired
    private ProfileRepository profileRepository;

    //get profile by id
    public Optional<Profile> getProfileById(Long id) {
        return profileRepository.findById(id);
    }
    
    //save or update
    public Profile saveProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    //get by user id
    public Optional<Profile> getByUserId(Long userId) {
        return profileRepository.findByUserId(userId);
    }
}
