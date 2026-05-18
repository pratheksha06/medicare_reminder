package com.medicare.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class PrescriptionRequest {

    @NotBlank
    private String patientId;

    @NotBlank
    private String diagnosis;

    private List<MedicineItem> medicines;

    private String notes;

    @Data
    public static class MedicineItem {
        private String name;
        private String dosage;
        private String frequency;
        private String duration;
    }
}
