package com.medicare.app.dto;

import com.medicare.app.model.Medicine;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MedicineRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String dosage;

    @NotBlank
    private String time;

    @NotNull
    private Medicine.Frequency frequency;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;
}
