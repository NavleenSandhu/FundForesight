package com.fundforesight.notification_service.models;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Budget {
    private int budget_id;
    private int user_id;
    private String category_name;
    private double initial_amount;
    private double remaining_amount;
    private LocalDate start_date;
    private LocalDate end_date;
}
