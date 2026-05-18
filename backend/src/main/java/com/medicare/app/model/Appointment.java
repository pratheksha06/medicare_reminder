package com.medicare.app.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "appointments")
public class Appointment {

    @Id
    private String id;

    private String patientId;

    private String patientName;

    private String doctorId;

    private String doctorName;

    private String specialization;

    private LocalDateTime appointmentTime;

    private String type;           // Follow-up, Consultation, Check-up

    private Status status;

    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING, CONFIRMED, REJECTED, CANCELLED, COMPLETED
    }
}
