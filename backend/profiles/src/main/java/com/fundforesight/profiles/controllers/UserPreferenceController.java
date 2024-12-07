package com.fundforesight.profiles.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fundforesight.profiles.database.UserPreferenceRepository;
import com.fundforesight.profiles.models.UserPreference;

@RestController
@RequestMapping("/userPreferences")
public class UserPreferenceController {
    @Autowired
    private UserPreferenceRepository userPreferenceRepository;

    // Get user preference by user ID
    @GetMapping("")
    public ResponseEntity<UserPreference> getUserPreferenceByUserId(
            @RequestParam(name = "user_id", required = true) int userId) {
        Optional<UserPreference> userPreference = userPreferenceRepository.findByUserId(userId);
        if (userPreference.isPresent()) {
            return ResponseEntity.ok(userPreference.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Add a new user preference
    @PostMapping("")
    public ResponseEntity<UserPreference> addUserPreference(@RequestBody UserPreference userPreference) {
        UserPreference savedPreference = userPreferenceRepository.save(userPreference);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPreference);
    }

    // Edit an existing user preference
    @PutMapping("/{preferenceId}")
    public ResponseEntity<UserPreference> editUserPreference(
            @PathVariable int preferenceId,
            @RequestBody UserPreference userPreferenceDetails) {
        Optional<UserPreference> existingPreference = userPreferenceRepository.findById(preferenceId);
        if (existingPreference.isPresent()) {
            UserPreference userPreference = existingPreference.get();
            userPreference.setCurrency(userPreferenceDetails.getCurrency());
            userPreference.setReceiveNotifications(userPreferenceDetails.getReceiveNotifications());
            userPreference.setCountryCode(userPreferenceDetails.getCountryCode());
            UserPreference updatedPreference = userPreferenceRepository.save(userPreference);
            return ResponseEntity.ok(updatedPreference);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Delete user preference by user ID
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUserPreference(@PathVariable int userId) {
        Optional<UserPreference> userPreference = userPreferenceRepository.findByUserId(userId);
        if (userPreference.isPresent()) {
            userPreferenceRepository.delete(userPreference.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
