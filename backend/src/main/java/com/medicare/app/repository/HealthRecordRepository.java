package com.medicare.app.repository;

import com.medicare.app.model.HealthRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HealthRecordRepository extends MongoRepository<HealthRecord, String> {
    List<HealthRecord> findByPatientId(String patientId);
    List<HealthRecord> findByPatientIdAndType(String patientId, HealthRecord.RecordType type);
    List<HealthRecord> findByPatientIdOrderByRecordedAtDesc(String patientId);
}
