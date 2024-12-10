package com.fundforesight.notification_service.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fundforesight.notification_service.database.UserPreferenceRepository;
import com.fundforesight.notification_service.models.Budget;
import com.fundforesight.notification_service.models.Transaction;
import com.fundforesight.notification_service.models.UserPreference;
import com.fundforesight.notification_service.services.BudgetsApiService;
import com.fundforesight.notification_service.utils.NotificationHelper;

import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class NotificationListener {
    private BudgetsApiService budgetsApiService;
    private NotificationHelper notificationHelper;
    private UserPreferenceRepository preferenceRepository;

    @KafkaListener(topics = "transactions", groupId = "notification-group")
    public void listen(String message) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            List<Transaction> transactions = mapper.readValue(message, new TypeReference<List<Transaction>>() {
            });
            int userId = transactions.get(0).getUserId();
            Optional<UserPreference> dbUserOptional = preferenceRepository.findByUserId(userId);
            if (!dbUserOptional.isPresent()) {
                return;
            } else {
                UserPreference dbUser = dbUserOptional.get();
                if (!dbUser.getReceiveNotifications()) {
                    return;
                }
            }
            List<Budget> budgets = budgetsApiService.getBudgets(userId);
            notificationHelper.handleBudgetNotifications(userId, budgets);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
