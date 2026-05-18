package com.medicare.app.dto;

import lombok.Data;

@Data
public class CaretakerRequest {
    private String name;
    private String relation;
    private String phone;
    private String email;
    private boolean notifyOnMissedDose = true;
}
