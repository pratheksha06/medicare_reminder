package com.medicare.app.controller;

import com.medicare.app.dto.*;
import com.medicare.app.dto.CaretakerRequest;
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
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final MedicineService medicineService;
    private final AppointmentService appointmentService;
    private final PrescriptionService prescriptionService;
    private final HealthRecordService healthRecordService;
    private final CaretakerService caretakerService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    private String extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }

    // ── Medicine Reminders ──────────────────────────────────────────────────

    @PostMapping("/medicines")
    public ResponseEntity<ApiResponse<Medicine>> addMedicine(
            @Valid @RequestBody MedicineRequest req, HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(medicineService.addMedicine(extractUserId(request), req)));
    }

    @GetMapping("/medicines")
    public ResponseEntity<ApiResponse<List<Medicine>>> getMedicines(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(medicineService.getPatientMedicines(extractUserId(request))));
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<ApiResponse<Medicine>> updateMedicine(
            @PathVariable String id, @Valid @RequestBody MedicineRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(medicineService.updateMedicine(id, req)));
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMedicine(@PathVariable String id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok(ApiResponse.ok("Medicine removed", null));
    }

    @PatchMapping("/medicines/{id}/dose")
    public ResponseEntity<ApiResponse<DoseLog>> markDose(
            @PathVariable String id,
            @RequestParam DoseLog.Status status,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(medicineService.markDose(id, extractUserId(request), status)));
    }

    @GetMapping("/medicines/dose-logs")
    public ResponseEntity<ApiResponse<List<DoseLog>>> getDoseLogs(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(medicineService.getDoseLogs(extractUserId(request))));
    }

    @GetMapping("/medicines/adherence")
    public ResponseEntity<ApiResponse<MedicineService.AdherenceStats>> getAdherence(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(medicineService.getAdherenceStats(extractUserId(request))));
    }

    // ── Appointments ────────────────────────────────────────────────────────

    @PostMapping("/appointments")
    public ResponseEntity<ApiResponse<Appointment>> bookAppointment(
            @Valid @RequestBody AppointmentRequest req, HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.bookAppointment(extractUserId(request), req)));
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<Appointment>>> getAppointments(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.getPatientAppointments(extractUserId(request))));
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<User>>> getAvailableDoctors() {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.getAvailableDoctors()));
    }

    @PatchMapping("/appointments/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(@PathVariable String id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.ok(ApiResponse.ok("Appointment cancelled", null));
    }

    @GetMapping("/prescriptions")
    public ResponseEntity<ApiResponse<List<Prescription>>> getPrescriptions(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(prescriptionService.getPatientPrescriptions(extractUserId(request))));
    }

    // ── Health Records ──────────────────────────────────────────────────────

    @PostMapping("/health-records")
    public ResponseEntity<ApiResponse<HealthRecord>> addRecord(
            @RequestBody HealthRecordRequest req, HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(healthRecordService.addRecord(extractUserId(request), req)));
    }

    @GetMapping("/health-records")
    public ResponseEntity<ApiResponse<List<HealthRecord>>> getRecords(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(healthRecordService.getPatientRecords(extractUserId(request))));
    }

    @DeleteMapping("/health-records/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRecord(@PathVariable String id) {
        healthRecordService.deleteRecord(id);
        return ResponseEntity.ok(ApiResponse.ok("Record deleted", null));
    }

    // ── Caretakers ──────────────────────────────────────────────────────────

    @PostMapping("/caretakers")
    public ResponseEntity<ApiResponse<Caretaker>> addCaretaker(
            @RequestBody CaretakerRequest req, HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(caretakerService.addCaretaker(extractUserId(request), req)));
    }

    @GetMapping("/caretakers")
    public ResponseEntity<ApiResponse<List<Caretaker>>> getCaretakers(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(caretakerService.getCaretakers(extractUserId(request))));
    }

    @PatchMapping("/caretakers/{id}/toggle-notify")
    public ResponseEntity<ApiResponse<Caretaker>> toggleNotify(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(caretakerService.toggleNotification(id)));
    }

    @DeleteMapping("/caretakers/{id}")
    public ResponseEntity<ApiResponse<Void>> removeCaretaker(@PathVariable String id) {
        caretakerService.removeCaretaker(id);
        return ResponseEntity.ok(ApiResponse.ok("Caretaker removed", null));
    }

    // ── Emergency SOS ───────────────────────────────────────────────────────

    @PostMapping("/emergency/sos")
    public ResponseEntity<ApiResponse<Void>> sendSOS(HttpServletRequest request) {
        String patientId = extractUserId(request);
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        notificationService.sendEmergencyAlert(patient.getName(), caretakerService.getCaretakers(patientId));
        return ResponseEntity.ok(ApiResponse.ok("SOS alert sent to all caretakers", null));
    }
}
