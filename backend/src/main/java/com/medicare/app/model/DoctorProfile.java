package com.medicare.app.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "doctor_profiles")
public class DoctorProfile {

    @Id
    private String id;

    private String userId;

    private String specialization;

    private String qualification;

    private int experienceYears;

    private String hospitalName;

    private String licenseNumber;

    private String bio;

    private LocalDateTime updatedAt = LocalDateTime.now();
}
