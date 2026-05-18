package com.medicare.app.service;

import com.medicare.app.dto.CaretakerRequest;
import com.medicare.app.model.Caretaker;
import com.medicare.app.repository.CaretakerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CaretakerService {

    private final CaretakerRepository caretakerRepository;

    public Caretaker addCaretaker(String patientId, CaretakerRequest request) {
        Caretaker caretaker = new Caretaker();
        caretaker.setPatientId(patientId);
        caretaker.setName(request.getName());
        caretaker.setRelation(request.getRelation());
        caretaker.setPhone(request.getPhone());
        caretaker.setEmail(request.getEmail());
        caretaker.setNotifyOnMissedDose(request.isNotifyOnMissedDose());
        return caretakerRepository.save(caretaker);
    }

    public List<Caretaker> getCaretakers(String patientId) {
        return caretakerRepository.findByPatientId(patientId);
    }

    public Caretaker toggleNotification(String caretakerId) {
        Caretaker caretaker = caretakerRepository.findById(caretakerId)
                .orElseThrow(() -> new RuntimeException("Caretaker not found"));
        caretaker.setNotifyOnMissedDose(!caretaker.isNotifyOnMissedDose());
        return caretakerRepository.save(caretaker);
    }

    public void removeCaretaker(String caretakerId) {
        caretakerRepository.deleteById(caretakerId);
    }
}
