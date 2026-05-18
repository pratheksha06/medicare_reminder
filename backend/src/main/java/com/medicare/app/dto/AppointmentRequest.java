package com.medicare.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AppointmentRequest {

    @NotBlank
    private String doctorId;

    @NotBlank
    private String appointmentTime;   // received as String "2025-05-10T10:30"

    @NotBlank
    private String type;

    private String notes;
}
