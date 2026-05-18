package com.medicare.app.dto;

import com.medicare.app.model.HealthRecord;
import lombok.Data;

@Data
public class HealthRecordRequest {

    private HealthRecord.RecordType type;

    private String title;

    private Double systolic;

    private Double diastolic;

    private Double sugarLevel;

    private Double heartRate;

    private String notes;
}
