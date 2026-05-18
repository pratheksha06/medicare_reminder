package com.medicare.app.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "medicines")
public class Medicine {

    @Id
    private String id;

    private String patientId;

    private String name;

    private String dosage;

    private String time;           // e.g. "08:00"

    private Frequency frequency;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean active = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Frequency {
        DAILY, TWICE_DAILY, WEEKLY, AS_NEEDED
    }
}
