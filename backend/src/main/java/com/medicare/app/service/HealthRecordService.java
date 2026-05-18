package com.medicare.app.service;

import com.medicare.app.dto.HealthRecordRequest;
import com.medicare.app.model.HealthRecord;
import com.medicare.app.repository.HealthRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;

    public HealthRecord addRecord(String patientId, HealthRecordRequest request) {
        HealthRecord record = new HealthRecord();
        record.setPatientId(patientId);
        record.setType(request.getType());
        record.setTitle(request.getTitle());
        record.setSystolic(request.getSystolic());
        record.setDiastolic(request.getDiastolic());
        record.setSugarLevel(request.getSugarLevel());
        record.setHeartRate(request.getHeartRate());
        record.setNotes(request.getNotes());
        return healthRecordRepository.save(record);
    }

    public List<HealthRecord> getPatientRecords(String patientId) {
        return healthRecordRepository.findByPatientIdOrderByRecordedAtDesc(patientId);
    }

    public List<HealthRecord> getRecordsByType(String patientId, HealthRecord.RecordType type) {
        return healthRecordRepository.findByPatientIdAndType(patientId, type);
    }

    public void deleteRecord(String recordId) {
        healthRecordRepository.deleteById(recordId);
    }
}
