package com.fundforesight.notification_service.kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fundforesight.notification_service.models.Budget;
import com.fundforesight.notification_service.models.Transaction;
import com.fundforesight.notification_service.services.BudgetsApiService;
import com.fundforesight.notification_service.utils.NotificationHelper;

import java.util.List;

@Service
public class NotificationListener {
    @Autowired
    private BudgetsApiService budgetsApiService;
    @Autowired
    private NotificationHelper notificationHelper;

    @KafkaListener(topics = "transactions", groupId = "notification-group")
    public void listen(String message) {
        System.out.println("Received message: " + message);
        ObjectMapper objectMapper = new ObjectMapper();
        List<Transaction> transactions;
        try {
            transactions = objectMapper.readValue(message, new TypeReference<List<Transaction>>() {
            });
            System.out.println(transactions);
            int userId = transactions.get(0).getUserId();
            List<Budget> budgets = budgetsApiService.getBudgets(userId);
            notificationHelper.handleBudgetNotifications(userId, transactions, budgets);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

}
