package com.medicare.app.controller;

import com.medicare.app.dto.*;
import com.medicare.app.model.*;
import com.medicare.app.repository.UserRepository;
import com.medicare.app.security.JwtUtil;
import com.medicare.app.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final AppointmentService appointmentService;
    private final PrescriptionService prescriptionService;
    private final MedicineService medicineService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    private String extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }

    // ── Appointments ────────────────────────────────────────────────────────

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<Appointment>>> getAppointments(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.getDoctorAppointments(extractUserId(request))));
    }

    @PatchMapping("/appointments/{id}/status")
    public ResponseEntity<ApiResponse<Appointment>> updateAppointmentStatus(
            @PathVariable String id, @RequestParam Appointment.Status status) {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.updateStatus(id, status)));
    }

    // ── Prescriptions ────────────────────────────────────────────────────────

    @PostMapping("/prescriptions")
    public ResponseEntity<ApiResponse<Prescription>> issuePrescription(
            @Valid @RequestBody PrescriptionRequest req, HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(prescriptionService.issuePrescription(extractUserId(request), req)));
    }

    @GetMapping("/prescriptions")
    public ResponseEntity<ApiResponse<List<Prescription>>> getPrescriptions(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(prescriptionService.getDoctorPrescriptions(extractUserId(request))));
    }

    // ── Patients ─────────────────────────────────────────────────────────────

    @GetMapping("/patients")
    public ResponseEntity<ApiResponse<List<User>>> getMyPatients(HttpServletRequest request) {
        String doctorId = extractUserId(request);
        // Get unique patient IDs from appointments
        List<String> patientIds = appointmentService.getDoctorAppointments(doctorId)
                .stream()
                .map(Appointment::getPatientId)
                .distinct()
                .toList();

        List<User> patients = patientIds.stream()
                .map(id -> userRepository.findById(id).orElse(null))
                .filter(u -> u != null)
                .toList();

        return ResponseEntity.ok(ApiResponse.ok(patients));
    }

    @GetMapping("/registered-patients")
    public ResponseEntity<ApiResponse<List<User>>> getRegisteredPatients() {
        return ResponseEntity.ok(ApiResponse.ok(userRepository.findByRole(User.Role.PATIENT)));
    }

    @GetMapping("/patients/{patientId}/adherence")
    public ResponseEntity<ApiResponse<MedicineService.AdherenceStats>> getPatientAdherence(
            @PathVariable String patientId) {
        return ResponseEntity.ok(ApiResponse.ok(medicineService.getAdherenceStats(patientId)));
    }
}
