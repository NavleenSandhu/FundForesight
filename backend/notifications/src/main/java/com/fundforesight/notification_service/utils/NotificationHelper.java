package com.fundforesight.notification_service.utils;

import org.springframework.stereotype.Service;

import com.fundforesight.notification_service.database.NotificationRepository;
import com.fundforesight.notification_service.models.Budget;
import com.fundforesight.notification_service.models.Notification;
import com.fundforesight.notification_service.models.Notification.NotificationType;
import com.fundforesight.notification_service.models.Transaction;
import com.fundforesight.notification_service.models.Transaction.TransactionType;

import lombok.AllArgsConstructor;

import java.util.List;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;

@Service
@AllArgsConstructor
public class NotificationHelper {

    private NotificationRepository notificationRepository;

    public boolean isSalaryTransaction(Transaction transaction) {
        String[] salaryKeywords = { "Pay", "Deposit", "Salary", "Payroll", "Income" };

        List<String> merchants = new ArrayList<>();
        merchants.add(transaction.getMerchantName());
        // Check if merchant name contains salary-related keywords
        return containsAny(merchants, salaryKeywords);
    }

    // Utility method to check if any string in the array is found in the given text
    public boolean containsAny(List<String> categories, String[] keywords) {
        if (categories.isEmpty())
            return false;
        for (String keyword : keywords) {
            for (String category : categories) {
                if (category.contains(keyword)) {
                    return true;
                }
            }
        }
        return false;
    }

    public void handleSalaryNotifications(int userId, List<Transaction> plaidTransactions) {
        for (Transaction transaction : plaidTransactions) {
            if (isSalaryTransaction(transaction)) {
                notificationRepository.save(
                        new Notification(userId, NotificationType.SALARY_RECEIVED, "Salary credited", String.format(
                                "Your salary of %.2f has been credited to your account.", transaction.getAmount())));
            }
        }
    }

    public void handleLargeTransactionNotifications(int userId,
            List<Transaction> plaidTransactions,
            List<Transaction> userTransactions) {
        double dynamicThreshold = calculateDynamicThreshold(userTransactions);
        for (Transaction transaction : plaidTransactions) {
            if (transaction.getAmount() > dynamicThreshold) {
                notificationRepository.save(
                        new Notification(userId, NotificationType.LARGE_TRANSACTION_ALERT, "Large Transaction Detected",
                                String.format("A transaction of %.2f has been detected. Review it now.",
                                        transaction.getAmount())));
            }
        }
    }

    public void handleBudgetNotifications(int userId,
            List<Transaction> transactions, List<Budget> budgets) {
        for (Budget budget : budgets) {
            // Calculate total spent for each budget
            double totalSpent = transactions.stream()
                    .filter(transaction -> transaction.getBudgetId() == budget.getBudget_id()
                            && transaction.getTransactionType() == TransactionType.EXPENSE)
                    .mapToDouble(Transaction::getAmount)
                    .sum();
            // Calculate remaining amount for each budget
            double remainingAmount = budget.getInitial_amount() - totalSpent;

            // Check if notifications already exist for the budget
            boolean overBudgetNotificationExists = notificationRepository
                    .existsByUserIdAndNotificationTypeAndTimestampAfter(
                            userId, NotificationType.OVER_BUDGET_ALERT,
                            Timestamp.valueOf(LocalDate.now().minusMonths(1).atStartOfDay()));
            boolean lowBudgetNotificationExists = notificationRepository
                    .existsByUserIdAndNotificationTypeAndTimestampAfter(
                            userId, NotificationType.LOW_BUDGET_WARNING,
                            Timestamp.valueOf(LocalDate.now().minusMonths(1).atStartOfDay()));

            // Check if budget has been exceeded or is running low
            if (remainingAmount <= 0 && !overBudgetNotificationExists) {
                // Save notification for budget overrun
                notificationRepository.save(
                        new Notification(userId, NotificationType.OVER_BUDGET_ALERT, "Budget Overrun Alert",
                                String.format(
                                        "Your budget '%s' has been exceeded. Total spent: %.2f, Budget limit: %.2f.",
                                        budget.getCategory_name(), totalSpent, budget.getInitial_amount())));
            } else if (remainingAmount <= budget.getInitial_amount() * 0.1 && !lowBudgetNotificationExists) {
                // Save notification for low budget warning
                notificationRepository.save(
                        new Notification(userId, NotificationType.LOW_BUDGET_WARNING, "Low Budget Warning",
                                String.format(
                                        "Your budget '%s' is running low. Remaining amount: %.2f (%.2f%% of your budget).",
                                        budget.getCategory_name(), remainingAmount,
                                        (remainingAmount / budget.getInitial_amount()) * 100)));
            }
        }
    }

    public void notifyNewTransactions(int userId, int transactionCount) {
        notificationRepository.save(
                new Notification(userId, NotificationType.NEW_TRANSACTIONS, "New Transactions",
                        "There are new transactions on your account."));
    }

    public double calculateDynamicThreshold(
            List<Transaction> transactions) {
        if (transactions == null || transactions.isEmpty()) {
            return 1000.0; // Default threshold
        }

        double average = transactions.stream()
                .mapToDouble(Transaction::getAmount)
                .average()
                .orElse(1000.0);

        double stdDev = Math.sqrt(transactions.stream()
                .mapToDouble(Transaction::getAmount)
                .map(amount -> Math.pow(amount - average, 2))
                .average()
                .orElse(0));

        return average + (1.5 * stdDev); // Customizable multiplier
    }
}
