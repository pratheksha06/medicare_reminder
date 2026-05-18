package com.medicare.app.service;

import com.medicare.app.dto.AppointmentRequest;
import com.medicare.app.model.Appointment;
import com.medicare.app.model.User;
import com.medicare.app.repository.AppointmentRepository;
import com.medicare.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public Appointment bookAppointment(String patientId, AppointmentRequest request) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        if (doctor.getRole() != User.Role.DOCTOR) {
            throw new RuntimeException("Selected user is not a doctor");
        }

        LocalDateTime appointmentTime = parseDateTime(request.getAppointmentTime());

        Appointment appointment = new Appointment();
        appointment.setPatientId(patientId);
        appointment.setPatientName(patient.getName());
        appointment.setDoctorId(request.getDoctorId());
        appointment.setDoctorName(doctor.getName());
        appointment.setAppointmentTime(appointmentTime);
        appointment.setType(request.getType());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(Appointment.Status.PENDING);

        Appointment saved = appointmentRepository.save(appointment);
        notificationService.sendAppointmentConfirmation(
                patient.getEmail(), doctor.getName(), appointmentTime.toString());
        return saved;
    }

    private LocalDateTime parseDateTime(String dateTimeStr) {
        // Handle both "2025-05-10T10:30" and "2025-05-10T10:30:00"
        try {
            return LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (DateTimeParseException e) {
            return LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"));
        }
    }

    public List<Appointment> getPatientAppointments(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getDoctorAppointments(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public Appointment updateStatus(String appointmentId, Appointment.Status status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public void cancelAppointment(String appointmentId) {
        updateStatus(appointmentId, Appointment.Status.CANCELLED);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<User> getAvailableDoctors() {
        return userRepository.findByRole(User.Role.DOCTOR);
    }
}
