package com.medicare.app.service;

import com.medicare.app.model.User;
import com.medicare.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicineRepository medicineRepository;
    private final DoseLogRepository doseLogRepository;

    public List<User> getAllPatients() {
        return userRepository.findByRole(User.Role.PATIENT);
    }

    public List<User> getAllDoctors() {
        return userRepository.findByRole(User.Role.DOCTOR);
    }

    public void toggleUserStatus(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", userRepository.findByRole(User.Role.PATIENT).size());
        stats.put("totalDoctors", userRepository.findByRole(User.Role.DOCTOR).size());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("pendingAppointments", appointmentRepository.countByStatus(
                com.medicare.app.model.Appointment.Status.PENDING));
        stats.put("totalMedicines", medicineRepository.count());
        return stats;
    }
}
