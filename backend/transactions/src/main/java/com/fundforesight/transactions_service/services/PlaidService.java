package com.fundforesight.transactions_service.services;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fundforesight.transactions_service.database.BudgetRepository;
import com.fundforesight.transactions_service.models.PlaidAccount;
import com.fundforesight.transactions_service.models.Transaction;
import com.fundforesight.transactions_service.utils.TransactionHelper;
import com.plaid.client.model.AccountBalance;
import com.plaid.client.model.AccountBase;
import com.plaid.client.model.AccountType;
import com.plaid.client.model.AccountsBalanceGetRequest;
import com.plaid.client.model.AccountsGetRequest;
import com.plaid.client.model.AccountsGetResponse;
import com.plaid.client.model.CountryCode;
import com.plaid.client.model.ItemPublicTokenExchangeRequest;
import com.plaid.client.model.ItemPublicTokenExchangeResponse;
import com.plaid.client.model.LinkTokenCreateRequest;
import com.plaid.client.model.LinkTokenCreateRequestUser;
import com.plaid.client.model.LinkTokenCreateResponse;
import com.plaid.client.model.Products;
import com.plaid.client.model.TransactionsGetRequest;
import com.plaid.client.model.TransactionsGetRequestOptions;
import com.plaid.client.model.TransactionsGetResponse;
import com.plaid.client.request.PlaidApi;

import lombok.AllArgsConstructor;
import retrofit2.Response;

@Service
@AllArgsConstructor
public class PlaidService {
    private PlaidApi plaidClient;
    private TransactionHelper transactionHelper;
    private BudgetRepository budgetRepository;

    public String createLinkToken(int userId) throws Exception {
        LinkTokenCreateRequestUser user = new LinkTokenCreateRequestUser().clientUserId(String.valueOf(userId));
        LinkTokenCreateRequest request = new LinkTokenCreateRequest().clientName("Fund Foresight Inc").user(user)
                .products(List.of(Products.TRANSACTIONS)).countryCodes(List.of(CountryCode.CA)).language("en");
        Response<LinkTokenCreateResponse> response = plaidClient.linkTokenCreate(request).execute();
        if (!response.isSuccessful()) {
            return null;
        }
        return response.body().getLinkToken();
    }

    public String getAccessToken(String publicToken) throws Exception {
        ItemPublicTokenExchangeRequest request = new ItemPublicTokenExchangeRequest().publicToken(publicToken);
        Response<ItemPublicTokenExchangeResponse> response = plaidClient.itemPublicTokenExchange(request).execute();
        if (!response.isSuccessful()) {
            throw new RuntimeException("Error exchanging public token");
        }
        return response.body().getAccessToken();

    }

    public List<Transaction> getPlaidTransactions(String accessToken, int userId,
            LocalDate startDate, boolean transactionsInDbExist, Optional<Timestamp> timestampResult) throws Exception {
        try {
            LocalDate endDate = LocalDate.now();
            TransactionsGetRequest request = new TransactionsGetRequest()
                    .accessToken(accessToken)
                    .startDate(startDate)
                    .endDate(endDate)
                    .options(new TransactionsGetRequestOptions().includeOriginalDescription(true));

            // Execute the request
            Response<TransactionsGetResponse> response = plaidClient.transactionsGet(request).execute();

            // Check if the response was successful
            if (response.isSuccessful() && response.body() != null) {
                List<com.plaid.client.model.Transaction> plaidTransactions = response.body().getTransactions();
                List<Transaction> transactions = new ArrayList<>();
                int otherBudgetId = budgetRepository.findBudgetByUserIdAndCategory(userId, "Other");
                // Convert Plaid transactions to your Transaction model
                for (com.plaid.client.model.Transaction plaidTransaction : plaidTransactions) {
                    Transaction transaction = new Transaction();
                    transaction.setUserId(userId);
                    transaction.setBudgetId(otherBudgetId);
                    transaction.setAmount(Math.abs(plaidTransaction.getAmount()));
                    transaction.setMerchantName(plaidTransaction.getName());
                    // Parse transaction date
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    transaction.setTransactionDate(
                            Timestamp.valueOf(plaidTransaction.getDate().format(formatter).concat(" 00:00:00")));

                    transaction
                            .setTransactionType(plaidTransaction.getAmount() > 0 ? Transaction.TransactionType.EXPENSE
                                    : Transaction.TransactionType.INCOME);
                    transactions.add(transaction);
                }
                if (transactionsInDbExist && timestampResult.isPresent()) {
                    Timestamp timestamp = timestampResult.get();
                    transactions.removeIf(transaction -> transaction.getTransactionDate().compareTo(timestamp) <= 0);
                }
                if (transactions.size() > 0) {
                    transactionHelper.updateBudgetIds(transactions, plaidTransactions, userId);
                }
                return transactions;
            } else {
                // Log the error response
                System.err.println("Error response: " + response.errorBody().string());
                throw new RuntimeException("Failed to fetch transactions: " + response.code());
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("An error occurred while fetching transactions: " + e.getMessage());
        }

    }

    public List<PlaidAccount> getPlaidAccounts(String accessToken, int userId) throws Exception {
        AccountsGetRequest request = new AccountsGetRequest().accessToken(accessToken);
        Response<AccountsGetResponse> response = plaidClient.accountsGet(request).execute();
        if (!response.isSuccessful() || response.body() == null) {
            System.err.println("Error fetching accounts: " + response.errorBody().string());
            throw new RuntimeException("Could not fetch accounts: " + response.code());
        }
        List<AccountBase> accounts = response.body().getAccounts();
        List<PlaidAccount> plaidAccounts = new ArrayList<>();
        for (AccountBase account : accounts) {
            PlaidAccount plaidAccount = new PlaidAccount();
            plaidAccount.setUserId(userId);
            plaidAccount.setAccessToken(accessToken);
            plaidAccount.setAccountId(account.getAccountId());
            plaidAccount.setInstitutionName(account.getName());
            plaidAccount.setAccountType(account.getType().toString());
            plaidAccount.setCurrentBalance(account.getBalances().getCurrent());
            plaidAccount.setCurrency(account.getBalances().getIsoCurrencyCode());
            plaidAccounts.add(plaidAccount);
        }
        return plaidAccounts;
    }

    public double getBankBalance(List<String> accessTokens) throws Exception {
        double balance = 0;
        for (String accessToken : accessTokens) {
            AccountsBalanceGetRequest request = new AccountsBalanceGetRequest().accessToken(accessToken);
            Response<AccountsGetResponse> response = plaidClient.accountsBalanceGet(request).execute();
            List<AccountBase> accounts = response.body().getAccounts();
            for (AccountBase account : accounts) {
                if (account.getType().equals(AccountType.DEPOSITORY)) {
                    AccountBalance accountBalance = account.getBalances();
                    if (accountBalance.getAvailable() != null) {
                        balance += accountBalance.getAvailable();
                    }
                }
            }
        }
        return balance;
    }

}
