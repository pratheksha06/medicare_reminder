package com.medicare.app.service;

import com.medicare.app.model.Medicine;
import com.medicare.app.model.User;
import com.medicare.app.repository.MedicineRepository;
import com.medicare.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReminderSchedulerService {

    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // Runs every minute to check for due reminders
    @Scheduled(fixedRate = 60000)
    public void checkAndSendReminders() {
        String currentTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));
        LocalDate today = LocalDate.now();

        List<Medicine> activeMedicines = medicineRepository.findAll().stream()
                .filter(m -> m.isActive()
                        && !today.isBefore(m.getStartDate())
                        && !today.isAfter(m.getEndDate())
                        && m.getTime().equals(currentTime))
                .toList();

        activeMedicines.forEach(medicine -> {
            userRepository.findById(medicine.getPatientId()).ifPresent(patient -> {
                log.info("Sending reminder to {} for {}", patient.getEmail(), medicine.getName());
                notificationService.sendMedicineReminder(
                        patient.getEmail(),
                        medicine.getName(),
                        medicine.getDosage(),
                        medicine.getTime()
                );
            });
        });
    }
}
