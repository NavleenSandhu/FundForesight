package com.fundforesight.notification_service.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fundforesight.notification_service.models.Budget;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class BudgetsApiService {
    WebClient budgetsServiceClient;

    public List<Budget> getBudgets(int userId) {
        // Calculate start and end date for the current month
        String startDate = LocalDate.now().withDayOfMonth(1).minusDays(1).atStartOfDay().toString().split("T")[0];
        String endDate = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atStartOfDay().toString()
                .split("T")[0];
        return budgetsServiceClient.get()
                .uri("/budgets?user_id=" + userId + "&start_date=" + startDate + "&end_date=" + endDate)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToFlux(Budget.class)
                .collectList()
                .block();
    }

    public List<Budget> getAllBudgetsBetweenDates(String startDate, String endDate) {
        return budgetsServiceClient.get().uri("/budgets/all?start_date=" + startDate + "&end_date=" + endDate)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToFlux(Budget.class)
                .collectList()
                .block();
    }
}
