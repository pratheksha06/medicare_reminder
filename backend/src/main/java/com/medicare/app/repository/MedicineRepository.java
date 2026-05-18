package com.medicare.app.repository;

import com.medicare.app.model.Medicine;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MedicineRepository extends MongoRepository<Medicine, String> {
    List<Medicine> findByPatientId(String patientId);
    List<Medicine> findByPatientIdAndActive(String patientId, boolean active);
}
