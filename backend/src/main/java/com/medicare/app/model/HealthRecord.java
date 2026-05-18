package com.medicare.app.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "health_records")
public class HealthRecord {

    @Id
    private String id;

    private String patientId;

    private RecordType type;

    private String title;

    private String fileUrl;        // stored file path or cloud URL

    private Double systolic;       // blood pressure

    private Double diastolic;

    private Double sugarLevel;

    private Double heartRate;

    private String notes;

    private LocalDateTime recordedAt = LocalDateTime.now();

    public enum RecordType {
        LAB_REPORT, SCAN, ECG, BLOOD_PRESSURE, SUGAR_LEVEL, HEART_RATE, OTHER
    }
}
