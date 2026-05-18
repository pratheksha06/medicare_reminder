package com.medicare.app.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "prescriptions")
public class Prescription {

    @Id
    private String id;

    private String patientId;

    private String patientName;

    private String doctorId;

    private String doctorName;

    private String diagnosis;

    private List<PrescribedMedicine> medicines;

    private String notes;

    private LocalDateTime issuedAt = LocalDateTime.now();

    @Data
    @NoArgsConstructor
    public static class PrescribedMedicine {
        private String name;
        private String dosage;
        private String frequency;
        private String duration;
    }
}
