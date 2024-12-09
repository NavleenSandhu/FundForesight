package com.fundforesight.notification_service.scheduler;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fundforesight.notification_service.database.NotificationRepository;
import com.fundforesight.notification_service.models.Budget;
import com.fundforesight.notification_service.models.Notification;
import com.fundforesight.notification_service.models.Notification.NotificationType;
import com.fundforesight.notification_service.services.BudgetsApiService;

@Component
public class NotificationScheduler {
    @Autowired
    private BudgetsApiService budgetsApiService;
    @Autowired
    private NotificationRepository notificationRepository;

    @Scheduled(cron = "0 0 0 1 * ?")
    public void deleteNotificationsAtStartOfMonth() {
        // Delete all notifications at the start of the month
        notificationRepository.deleteAll();
    }

    @Scheduled(cron = "0 0 0 1 * ?")
    public void getBudgetsAndSendSpendingDetailsNotification() {
        // Formatter for the required date format
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Get the previous month
        YearMonth lastMonth = YearMonth.now().minusMonths(1);

        // Get the first and last dates of the previous month as Strings
        String firstDateOfLastMonth = lastMonth.atDay(1).format(formatter); // First day of last month

        String lastDateOfLastMonth = lastMonth.atEndOfMonth().format(formatter); // Last day of last month

        // Get budgets and send spending details notification
        List<Budget> budgets = budgetsApiService.getAllBudgetsBetweenDates(firstDateOfLastMonth, lastDateOfLastMonth);

        // Group budgets by user and calculate total initial amount and expenditure
        Map<Integer, Double[]> totalAmountsByUser = budgets.stream()
                .collect(Collectors.groupingBy(
                        Budget::getUser_id,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    double totalInitialAmount = list.stream()
                                            .mapToDouble(Budget::getInitial_amount)
                                            .sum();
                                    double totalExpenditure = list.stream()
                                            .mapToDouble(
                                                    Budget::getExpenditure)
                                            .sum();
                                    return new Double[] { totalInitialAmount, totalExpenditure };
                                })));

        // Send notifications to users based on their expenditure
        totalAmountsByUser.forEach((userId, amounts) -> {
            double difference = amounts[0] - amounts[1];
            String message;
            if (difference < 0) {
                message = "You overspent by " + Math.abs(difference) + " last month.";
            } else {
                message = "You saved " + difference + " last month. We recommend adding this to your savings.";
            }
            notificationRepository.save(new Notification(userId, NotificationType.EXPENDITURE_REVIEW,
                    "Last month expense overview", message));
        });
    }
}
