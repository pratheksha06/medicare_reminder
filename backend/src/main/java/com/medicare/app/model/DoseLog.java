package com.medicare.app.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "dose_logs")
public class DoseLog {

    @Id
    private String id;

    private String medicineId;

    private String patientId;

    private String medicineName;

    private LocalDateTime scheduledTime;

    private LocalDateTime takenAt;

    private Status status;

    public enum Status {
        TAKEN, MISSED, PENDING
    }
}
