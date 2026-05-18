package com.medicare.app.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "caretakers")
public class Caretaker {

    @Id
    private String id;

    private String patientId;

    private String name;

    private String relation;

    private String phone;

    private String email;

    private boolean notifyOnMissedDose = true;

    private LocalDateTime addedAt = LocalDateTime.now();
}
