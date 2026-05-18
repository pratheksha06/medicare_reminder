package com.medicare.app.repository;

import com.medicare.app.model.Caretaker;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CaretakerRepository extends MongoRepository<Caretaker, String> {
    List<Caretaker> findByPatientId(String patientId);
    List<Caretaker> findByPatientIdAndNotifyOnMissedDose(String patientId, boolean notify);
}
