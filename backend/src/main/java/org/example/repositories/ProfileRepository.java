package org.example.repositories;

import org.example.models.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    //custom queries if needed
    Optional<Profile> findByUserId(Long userId);

}
