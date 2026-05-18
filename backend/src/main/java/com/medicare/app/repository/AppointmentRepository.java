package com.medicare.app.repository;

import com.medicare.app.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByPatientId(String patientId);
    List<Appointment> findByDoctorId(String doctorId);
    List<Appointment> findByDoctorIdAndStatus(String doctorId, Appointment.Status status);
    List<Appointment> findByPatientIdAndStatus(String patientId, Appointment.Status status);
    List<Appointment> findByAppointmentTimeBetween(LocalDateTime from, LocalDateTime to);
    long countByStatus(Appointment.Status status);
}
