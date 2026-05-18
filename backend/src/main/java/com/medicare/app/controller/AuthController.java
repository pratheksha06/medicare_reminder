package com.medicare.app.controller;

import com.medicare.app.dto.*;
import com.medicare.app.model.User;
import com.medicare.app.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<User>>> getDoctors() {
        return ResponseEntity.ok(ApiResponse.ok(authService.getDoctors()));
    }

    @GetMapping("/patients")
    public ResponseEntity<ApiResponse<List<User>>> getPatients() {
        return ResponseEntity.ok(ApiResponse.ok(authService.getPatients()));
    }
}
