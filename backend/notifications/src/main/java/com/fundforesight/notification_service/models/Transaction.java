package com.fundforesight.notification_service.models;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Transaction {
    public enum TransactionType {
        EXPENSE, INCOME
    }

    private int transactionId;
    private int userId;
    private int budgetId;
    private double amount;
    private String merchantName;
    private Timestamp transactionDate;
    private TransactionType transactionType;

}
