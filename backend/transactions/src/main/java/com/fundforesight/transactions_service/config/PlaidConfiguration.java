package com.fundforesight.transactions_service.config;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.plaid.client.ApiClient;
import com.plaid.client.request.PlaidApi;

@Configuration
public class PlaidConfiguration {
    @Value("${PLAID_CLIENT_ID}")
    private String plaidClientId;

    @Value("${PLAID_SECRET}")
    private String plaidSecret;

    @Bean
    public PlaidApi plaidClient() {
        HashMap<String, String> apiKeys = new HashMap<>();
        apiKeys.put("clientId", plaidClientId);
        apiKeys.put("secret", plaidSecret);
        ApiClient apiClient = new ApiClient(apiKeys);
        apiClient.setPlaidAdapter(ApiClient.Sandbox);
        return apiClient.createService(PlaidApi.class);
    }
}
