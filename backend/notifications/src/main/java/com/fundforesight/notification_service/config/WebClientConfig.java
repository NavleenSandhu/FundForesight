package com.fundforesight.notification_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.AllArgsConstructor;

@Configuration
@AllArgsConstructor
public class WebClientConfig {
    private Environment env;

    @Bean
    public WebClient transactionsServiceClient(WebClient.Builder builder) {
        return builder
                .baseUrl(env.getProperty("transactions.api.url"))
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
    @Bean
    public WebClient budgetsServiceClient(WebClient.Builder builder) {
        return builder
                .baseUrl(env.getProperty("budgets.api.url"))
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
