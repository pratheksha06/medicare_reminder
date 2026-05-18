package com.medicare.app.repository;

import com.medicare.app.model.DoseLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface DoseLogRepository extends MongoRepository<DoseLog, String> {
    List<DoseLog> findByPatientId(String patientId);
    List<DoseLog> findByMedicineId(String medicineId);
    List<DoseLog> findByPatientIdAndStatus(String patientId, DoseLog.Status status);
    List<DoseLog> findByPatientIdAndScheduledTimeBetween(String patientId, LocalDateTime from, LocalDateTime to);
    long countByPatientIdAndStatus(String patientId, DoseLog.Status status);
}
