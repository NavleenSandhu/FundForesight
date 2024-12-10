package com.fundforesight.notification_service.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fundforesight.notification_service.database.NotificationRepository;
import com.fundforesight.notification_service.database.NotificationUserRepository;
import com.fundforesight.notification_service.database.UserPreferenceRepository;
import com.fundforesight.notification_service.models.Budget;
import com.fundforesight.notification_service.models.Notification;
import com.fundforesight.notification_service.models.NotificationUser;
import com.fundforesight.notification_service.models.Transaction;
import com.fundforesight.notification_service.models.UserPreference;
import com.fundforesight.notification_service.services.BudgetsApiService;
import com.fundforesight.notification_service.services.TransactionsApiService;
import com.fundforesight.notification_service.utils.NotificationHelper;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@AllArgsConstructor
@RequestMapping("/notifications")
@Slf4j
public class NotificationController {
    private NotificationRepository notificationRepository;
    private NotificationHelper notificationHelper;
    private NotificationUserRepository userRepository;
    private TransactionsApiService transactionsApiService;
    private BudgetsApiService budgetsApiService;
    private UserPreferenceRepository preferenceRepository;

    /**
     * Retrieves all notifications for a user.
     * 
     * @param userId The ID of the user whose notifications are being retrieved.
     * @return A ResponseEntity containing the list of notifications or an error
     *         message.
     */
    @GetMapping(value = { "/", "" })
    public ResponseEntity<?> getNotificationsByUserId(
            @RequestParam(name = "user_id", required = true) int userId) {
        try {
            List<Notification> notifications = notificationRepository.findByUserIdOrderByTimestampDesc(userId);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Adds a new notification for a user based on the webhook code and item ID.
     * 
     * @param map The map containing the webhook code and item ID.
     * @return A ResponseEntity containing the status of the operation.
     */
    @PostMapping(value = { "/", "" })
    public ResponseEntity<?> addNotification(@RequestBody Map<String, Object> map) {
        try {
            // Null check for map and webhook_code
            if (map == null || !map.containsKey("webhook_code")
                    || !"DEFAULT_UPDATE".equals((String) map.get("webhook_code"))) {
                return new ResponseEntity<>("Invalid webhook code", HttpStatus.BAD_REQUEST);
            }

            // Null check for item_id and ensure it is present
            if (!map.containsKey("item_id")) {
                return new ResponseEntity<>("Item ID is missing", HttpStatus.BAD_REQUEST);
            }
            String itemId = (String) map.get("item_id");
            Optional<NotificationUser> userOptional = userRepository.findById(itemId);
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>("Could not validate item id", HttpStatus.BAD_REQUEST);
            }

            // Fetch the user ID and the transactions
            int userId = userOptional.get().getUserId();

            Optional<UserPreference> dbUserOptional = preferenceRepository.findByUserId(userId);
            if (!dbUserOptional.isPresent()) {
                return new ResponseEntity<>("Could not validate item id", HttpStatus.BAD_REQUEST);
            } else {
                UserPreference dbUser = dbUserOptional.get();
                if (!dbUser.getReceiveNotifications()) {
                    return new ResponseEntity<>("Not required for this user", HttpStatus.MOVED_PERMANENTLY);
                }
            }
            Integer newTransactionsCount = (Integer) map.get("new_transactions");
            if (newTransactionsCount == null || newTransactionsCount <= 0) {
                return new ResponseEntity<>("No new transactions to process", HttpStatus.BAD_REQUEST);
            }

            // Fetch the existing transactions and budgets
            List<Transaction> transactions = transactionsApiService.getTransactions(userId);
            // Use streams to get the last `newTransactionsCount` new transactions
            List<Transaction> newTransactions = transactions.stream()
                    .sorted(Comparator.comparing(Transaction::getTransactionDate).reversed()) // Sort by date descending
                    .limit(newTransactionsCount) // Take only the most recent ones based on the count
                    .collect(Collectors.toList()); // Collect into a new list
            List<Budget> budgets = budgetsApiService.getBudgets(userId);

            // Delegate specific tasks to helper methods
            notificationHelper.handleSalaryNotifications(userId, newTransactions);
            notificationHelper.handleLargeTransactionNotifications(userId, newTransactions, transactions);
            notificationHelper.handleBudgetNotifications(userId, budgets);
            notificationHelper.notifyNewTransactions(userId, newTransactionsCount);

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes a notification by its ID using a path variable.
     * 
     * @param notificationId The ID of the notification to be deleted.
     * @return A ResponseEntity containing the status of the operation.
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@PathVariable int notificationId, @RequestParam(name = "user_id") int userId) {
        try {
            Optional<Notification> notificationOptional = notificationRepository.findById(notificationId);
            if (!notificationOptional.isPresent()) {
                return new ResponseEntity<>("Notification not found", HttpStatus.NOT_FOUND);
            }
            Notification notification = notificationOptional.get();
            if (notification.getUserId() != userId) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }
            notificationRepository.deleteById(notificationId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
