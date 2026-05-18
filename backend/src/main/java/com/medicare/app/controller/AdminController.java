package com.medicare.app.controller;

import com.medicare.app.dto.ApiResponse;
import com.medicare.app.model.*;
import com.medicare.app.service.AdminService;
import com.medicare.app.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AppointmentService appointmentService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getDashboardStats()));
    }

    @GetMapping("/patients")
    public ResponseEntity<ApiResponse<List<User>>> getAllPatients() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllPatients()));
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<User>>> getAllDoctors() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllDoctors()));
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(@PathVariable String id) {
        adminService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.ok("User status updated", null));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted", null));
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<Appointment>>> getAllAppointments() {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.getAllAppointments()));
    }
}
