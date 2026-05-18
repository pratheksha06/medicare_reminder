package com.medicare.app.service;

import com.medicare.app.dto.PrescriptionRequest;
import com.medicare.app.model.Medicine;
import com.medicare.app.model.Prescription;
import com.medicare.app.model.User;
import com.medicare.app.repository.MedicineRepository;
import com.medicare.app.repository.PrescriptionRepository;
import com.medicare.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    private final MedicineRepository medicineRepository;

    public Prescription issuePrescription(String doctorId, PrescriptionRequest request) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        if (doctor.getRole() != User.Role.DOCTOR) {
            throw new RuntimeException("Only doctors can issue prescriptions");
        }
        User patient = userRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        if (patient.getRole() != User.Role.PATIENT) {
            throw new RuntimeException("Selected user is not a patient");
        }
        if (request.getMedicines() == null || request.getMedicines().isEmpty()) {
            throw new RuntimeException("At least one medicine is required");
        }

        Prescription prescription = new Prescription();
        prescription.setDoctorId(doctorId);
        prescription.setDoctorName(doctor.getName());
        prescription.setPatientId(request.getPatientId());
        prescription.setPatientName(patient.getName());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setNotes(request.getNotes());

        List<Prescription.PrescribedMedicine> medicines = request.getMedicines().stream()
                .filter(Objects::nonNull)
                .map(m -> {
            if (m.getName() == null || m.getName().isBlank() ||
                    m.getDosage() == null || m.getDosage().isBlank() ||
                    m.getFrequency() == null || m.getFrequency().isBlank() ||
                    m.getDuration() == null || m.getDuration().isBlank()) {
                throw new RuntimeException("All medicine fields are required");
            }
            Prescription.PrescribedMedicine pm = new Prescription.PrescribedMedicine();
            pm.setName(m.getName());
            pm.setDosage(m.getDosage());
            pm.setFrequency(m.getFrequency());
            pm.setDuration(m.getDuration());
            return pm;
        }).collect(Collectors.toList());

        if (medicines.isEmpty()) {
            throw new RuntimeException("At least one valid medicine is required");
        }

        prescription.setMedicines(medicines);
        Prescription saved = prescriptionRepository.save(prescription);

        // Auto-add prescribed medicines to patient's reminder schedule
        request.getMedicines().forEach(m -> {
            Medicine med = new Medicine();
            med.setPatientId(request.getPatientId());
            med.setName(m.getName());
            med.setDosage(m.getDosage());
            med.setFrequency(Medicine.Frequency.DAILY);
            med.setTime("08:00");
            med.setStartDate(LocalDate.now());
            med.setEndDate(LocalDate.now().plusDays(30));
            medicineRepository.save(med);
        });

        return saved;
    }

    public List<Prescription> getPatientPrescriptions(String patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getDoctorPrescriptions(String doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }
}
