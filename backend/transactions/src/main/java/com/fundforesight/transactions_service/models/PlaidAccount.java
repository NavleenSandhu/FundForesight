package com.fundforesight.transactions_service.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "plaid_accounts")
public class PlaidAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plaid_account_id")
    private int plaidAccountId;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "access_token")
    private String accessToken;

    @Column(name = "account_id")
    private String accountId;

    @Column(name = "institution_name")
    private String institutionName;

    @Column(name = "account_type")
    private String accountType;

    @Column(name = "current_balance")
    private double currentBalance;

    private String currency;

}
