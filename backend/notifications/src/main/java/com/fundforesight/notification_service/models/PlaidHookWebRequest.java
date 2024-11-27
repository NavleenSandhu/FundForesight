package com.fundforesight.notification_service.models;

import java.util.List;
import com.plaid.client.model.Transaction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PlaidHookWebRequest {
    private String webhook_code;
    private String item_id;
    private List<Transaction> new_transactions;
}
