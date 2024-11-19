package com.fundforesight.savings_service.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fundforesight.savings_service.database.SavingGoalsRepository;
import com.fundforesight.savings_service.models.SavingGoal;

import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/savings")
@AllArgsConstructor
public class SavingsController {
    private SavingGoalsRepository savingsRepository;

    @GetMapping("/")
    public ResponseEntity<?> getSavingGoals(
            @RequestParam(name = "user_id", defaultValue = "0", required = true) int userId) {
        try {
            List<SavingGoal> savingGoals = savingsRepository.findByUserId(userId);
            return new ResponseEntity<>(savingGoals, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = { "/", "" }, headers = { "Content-Type=application/json" })
    public ResponseEntity<?> addSavingGoals(@RequestBody List<SavingGoal> savingGoals) {
        try {
            savingsRepository.saveAll(savingGoals);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = { "/{goalId}" }, headers = { "Content-Type=application/json" })
    public ResponseEntity<?> putMethodName(@PathVariable int goalId, @RequestBody SavingGoal s) {
        try {
            savingsRepository.updateSavingGoal(s.getGoalName(), s.getTargetAmount(), s.getCurrentAmount(),
                    s.getStartDate(), s.getEndDate(), s.getStatus(), s.getGoalId(), s.getUserId());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<?> putMethodName(@PathVariable int goalId,
            @RequestParam(name = "user_id", defaultValue = "0", required = true) int userId) {
        try {
            savingsRepository.deleteByGoalAndUserId(goalId, userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
