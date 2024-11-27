package com.fundforesight.notification_service.services;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fundforesight.notification_service.models.Transaction;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TransactionsApiService {
    WebClient transactionsServiceClient;

    public List<Transaction> getTransactions(int userId) {
        return transactionsServiceClient.get().uri("/transactions?user_id=" + userId)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToFlux(Transaction.class)
                .collectList()
                .block();
    }
}
