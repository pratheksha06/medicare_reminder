package com.medicare.app.repository;

import com.medicare.app.model.DoctorProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface DoctorProfileRepository extends MongoRepository<DoctorProfile, String> {
    Optional<DoctorProfile> findByUserId(String userId);
}
