package com.medicare.app.service;

import com.medicare.app.model.Caretaker;
import com.medicare.app.repository.CaretakerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class NotificationService {

    // Optional — app works without SMTP configured
    @Autowired(required = false)
    private JavaMailSender mailSender;

    private final CaretakerRepository caretakerRepository;

    public NotificationService(CaretakerRepository caretakerRepository) {
        this.caretakerRepository = caretakerRepository;
    }

    public void sendEmail(String to, String subject, String body) {
        if (mailSender == null) {
            log.info("[EMAIL SKIPPED - SMTP not configured] To: {} | Subject: {}", to, subject);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    public void sendMedicineReminder(String email, String medicineName, String dosage, String time) {
        String subject = "Medicine Reminder: " + medicineName;
        String body = String.format(
                "Hello,\n\nThis is a reminder to take your medicine:\n\nMedicine: %s\nDosage: %s\nTime: %s\n\nStay healthy!\n\nMediCare Team",
                medicineName, dosage, time
        );
        sendEmail(email, subject, body);
    }

    public void sendAppointmentConfirmation(String email, String doctorName, String appointmentTime) {
        String subject = "Appointment Booked";
        String body = String.format(
                "Hello,\n\nYour appointment has been booked.\n\nDoctor: %s\nTime: %s\n\nPlease arrive 10 minutes early.\n\nMediCare Team",
                doctorName, appointmentTime
        );
        sendEmail(email, subject, body);
    }

    public void notifyCaretakersOnMissedDose(String patientId, String medicineName) {
        List<Caretaker> caretakers = caretakerRepository.findByPatientIdAndNotifyOnMissedDose(patientId, true);
        caretakers.forEach(c -> {
            String subject = "Missed Dose Alert";
            String body = String.format(
                    "Hello %s,\n\nYour patient has missed their dose of %s.\n\nPlease check on them.\n\nMediCare Team",
                    c.getName(), medicineName
            );
            sendEmail(c.getEmail(), subject, body);
        });
    }

    public void sendEmergencyAlert(String patientName, List<Caretaker> caretakers) {
        caretakers.forEach(c -> {
            String subject = "EMERGENCY SOS Alert";
            String body = String.format(
                    "URGENT: %s has triggered an emergency SOS alert.\n\nPlease contact them immediately or call emergency services.\n\nMediCare Team",
                    patientName
            );
            sendEmail(c.getEmail(), subject, body);
        });
    }
}
