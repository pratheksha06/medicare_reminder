package com.medicare.app.service;

import com.medicare.app.dto.MedicineRequest;
import com.medicare.app.model.DoseLog;
import com.medicare.app.model.Medicine;
import com.medicare.app.repository.DoseLogRepository;
import com.medicare.app.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final DoseLogRepository doseLogRepository;
    private final NotificationService notificationService;

    public Medicine addMedicine(String patientId, MedicineRequest request) {
        Medicine medicine = new Medicine();
        medicine.setPatientId(patientId);
        medicine.setName(request.getName());
        medicine.setDosage(request.getDosage());
        medicine.setTime(request.getTime());
        medicine.setFrequency(request.getFrequency());
        medicine.setStartDate(request.getStartDate());
        medicine.setEndDate(request.getEndDate());
        return medicineRepository.save(medicine);
    }

    public List<Medicine> getPatientMedicines(String patientId) {
        return medicineRepository.findByPatientIdAndActive(patientId, true);
    }

    public Medicine updateMedicine(String medicineId, MedicineRequest request) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        medicine.setName(request.getName());
        medicine.setDosage(request.getDosage());
        medicine.setTime(request.getTime());
        medicine.setFrequency(request.getFrequency());
        medicine.setStartDate(request.getStartDate());
        medicine.setEndDate(request.getEndDate());
        return medicineRepository.save(medicine);
    }

    public void deleteMedicine(String medicineId) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        medicine.setActive(false);
        medicineRepository.save(medicine);
    }

    public DoseLog markDose(String medicineId, String patientId, DoseLog.Status status) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        DoseLog log = new DoseLog();
        log.setMedicineId(medicineId);
        log.setPatientId(patientId);
        log.setMedicineName(medicine.getName());
        log.setScheduledTime(LocalDateTime.now());
        log.setStatus(status);

        if (status == DoseLog.Status.TAKEN) {
            log.setTakenAt(LocalDateTime.now());
        } else if (status == DoseLog.Status.MISSED) {
            notificationService.notifyCaretakersOnMissedDose(patientId, medicine.getName());
        }

        return doseLogRepository.save(log);
    }

    public List<DoseLog> getDoseLogs(String patientId) {
        return doseLogRepository.findByPatientId(patientId);
    }

    public AdherenceStats getAdherenceStats(String patientId) {
        long taken = doseLogRepository.countByPatientIdAndStatus(patientId, DoseLog.Status.TAKEN);
        long missed = doseLogRepository.countByPatientIdAndStatus(patientId, DoseLog.Status.MISSED);
        long total = taken + missed;
        double rate = total > 0 ? (double) taken / total * 100 : 0;
        return new AdherenceStats(taken, missed, total, Math.round(rate));
    }

    public record AdherenceStats(long taken, long missed, long total, long adherencePercent) {}
}
