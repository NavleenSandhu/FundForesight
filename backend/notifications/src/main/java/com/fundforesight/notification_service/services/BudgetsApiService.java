package com.fundforesight.notification_service.services;

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
        return budgetsServiceClient.get().uri("/budgets?user_id=" + userId)
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
