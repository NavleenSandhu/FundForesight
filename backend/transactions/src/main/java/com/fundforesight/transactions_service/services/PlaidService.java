package com.fundforesight.transactions_service.services;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.fundforesight.transactions_service.database.BudgetRepository;
import com.fundforesight.transactions_service.database.NotificationUserRepository;
import com.fundforesight.transactions_service.database.UserPreferenceRepository;
import com.fundforesight.transactions_service.models.NotificationUser;
import com.fundforesight.transactions_service.models.PlaidAccount;
import com.fundforesight.transactions_service.models.Transaction;
import com.fundforesight.transactions_service.models.UserPreference;
import com.fundforesight.transactions_service.utils.TransactionHelper;
import com.plaid.client.model.*;
import com.plaid.client.request.PlaidApi;

import lombok.AllArgsConstructor;
import retrofit2.Response;

@Service
@AllArgsConstructor
public class PlaidService {
    private PlaidApi plaidClient;
    private TransactionHelper transactionHelper;
    private BudgetRepository budgetRepository;
    private NotificationUserRepository userRepository;
    private UserPreferenceRepository userPreferenceRepository;
    private Environment env;

    /**
     * Creates a Plaid link token for the user to authenticate their financial
     * institution.
     * 
     * @param userId The ID of the user creating the link token.
     * @return The generated link token.
     * @throws Exception If the Plaid API request fails.
     */
    public String createLinkToken(int userId) throws Exception {
        // Configure the link token request with user and application details.
        Optional<UserPreference> userPreferenceOpt = userPreferenceRepository.findByUserId(userId);
        UserPreference userPreference;
        if (userPreferenceOpt.isPresent()) {
            userPreference = userPreferenceOpt.get();
        } else {
            throw new RuntimeException("Cannot find country code for user");
        }
        LinkTokenCreateRequestUser user = new LinkTokenCreateRequestUser().clientUserId(String.valueOf(userId));
        LinkTokenCreateRequest request = new LinkTokenCreateRequest()
                .clientName("Fund Foresight Inc")
                .user(user)
                .products(List.of(Products.TRANSACTIONS))
                .countryCodes(List.of(CountryCode.fromValue(userPreference.getCountryCode().toString())))
                .language("en")
                .webhook(env.getProperty("notifications.url"));

        // Make the API call to Plaid to generate the link token.
        Response<LinkTokenCreateResponse> response = plaidClient.linkTokenCreate(request).execute();

        // Return the link token if the request is successful.
        if (!response.isSuccessful()) {
            return null;
        }
        return response.body().getLinkToken();
    }

    /**
     * Exchanges a public token for an access token from Plaid.
     * 
     * @param publicToken The temporary token received from the Plaid frontend.
     * @return The access token to authenticate future API calls.
     * @throws Exception If the Plaid API request fails.
     */
    public String getAccessToken(String publicToken) throws Exception {
        // Prepare the request to exchange the public token for an access token.
        ItemPublicTokenExchangeRequest request = new ItemPublicTokenExchangeRequest().publicToken(publicToken);
        Response<ItemPublicTokenExchangeResponse> response = plaidClient.itemPublicTokenExchange(request).execute();

        // If the response is not successful, throw an error.
        if (!response.isSuccessful()) {
            throw new RuntimeException("Error exchanging public token");
        }

        // Return the access token from the response.
        return response.body().getAccessToken();
    }

    /**
     * Fetches Plaid transactions for a given access token and user.
     * 
     * @param accessToken           The user's Plaid access token.
     * @param userId                The ID of the user.
     * @param startDate             The start date for fetching transactions.
     * @param transactionsInDbExist Indicates if transactions already exist in the
     *                              database.
     * @param timestampResult       The most recent transaction timestamp, if
     *                              applicable.
     * @return A list of Transaction objects converted from Plaid transactions.
     * @throws Exception If the Plaid API request or data conversion fails.
     */
    public List<Transaction> getPlaidTransactions(String accessToken, int userId, LocalDate startDate,
            boolean transactionsInDbExist, Optional<Timestamp> timestampResult) throws Exception {
        try {
            // Define the end date as today.
            LocalDate endDate = LocalDate.now();

            // Create the request to fetch transactions.
            TransactionsGetRequest request = new TransactionsGetRequest()
                    .accessToken(accessToken)
                    .startDate(startDate)
                    .endDate(endDate)
                    .options(new TransactionsGetRequestOptions().includeOriginalDescription(true));

            // Execute the API call.
            Response<TransactionsGetResponse> response = plaidClient.transactionsGet(request).execute();

            // Check for successful response.
            if (response.isSuccessful() && response.body() != null) {
                List<com.plaid.client.model.Transaction> plaidTransactions = response.body().getTransactions();

                List<Transaction> transactions = new ArrayList<>();

                // Fetch the "Other" budget ID for uncategorized transactions.
                int otherBudgetId = budgetRepository.findBudgetByUserIdAndCategory(userId, "Other");

                // Convert Plaid transactions to the application's Transaction model.
                for (com.plaid.client.model.Transaction plaidTransaction : plaidTransactions) {
                    Transaction transaction = new Transaction();
                    transaction.setUserId(userId);
                    transaction.setBudgetId(otherBudgetId);
                    transaction.setAmount(Math.abs(plaidTransaction.getAmount()));
                    transaction.setMerchantName(plaidTransaction.getName());

                    // Parse and format transaction date.
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    transaction.setTransactionDate(
                            Timestamp.valueOf(plaidTransaction.getDate().format(formatter).concat(" 00:00:00")));

                    transaction.setTransactionType(
                            plaidTransaction.getAmount() > 0 ? Transaction.TransactionType.EXPENSE
                                    : Transaction.TransactionType.INCOME);

                    transactions.add(transaction);
                }

                // Filter out transactions that are already in the database, if applicable.
                if (transactionsInDbExist && timestampResult.isPresent()) {
                    Timestamp timestamp = timestampResult.get();
                    transactions.removeIf(transaction -> transaction.getTransactionDate().compareTo(timestamp) <= 0);
                    plaidTransactions.removeIf(transaction -> transaction.getDate()
                            .compareTo(timestamp.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()) <= 0);
                }

                // Update budget IDs for categorized transactions using AI.
                if (transactions.size() > 0) {
                    transactionHelper.updateBudgetIds(transactions, plaidTransactions, userId);
                }

                return transactions;
            } else {
                // Log and throw error for unsuccessful response.
                System.err.println("Error response: " + response.errorBody().string());
                throw new RuntimeException("Failed to fetch transactions: " + response.code());
            }
        } catch (Exception e) {
            // Log and propagate the exception.
            e.printStackTrace();
            throw new RuntimeException("An error occurred while fetching transactions: " + e.getMessage());
        }
    }

    /**
     * Fetches Plaid accounts associated with a user's access token.
     * 
     * @param accessToken The user's Plaid access token.
     * @param userId      The ID of the user.
     * @return A list of PlaidAccount objects containing account details.
     * @throws Exception If the Plaid API request fails.
     */
    public List<PlaidAccount> getPlaidAccounts(String accessToken, int userId) throws Exception {
        // Prepare the request to fetch accounts.
        AccountsGetRequest request = new AccountsGetRequest().accessToken(accessToken);

        // Execute the API call.
        Response<AccountsGetResponse> response = plaidClient.accountsGet(request).execute();

        // Check for successful response.
        if (!response.isSuccessful() || response.body() == null) {
            System.err.println("Error fetching accounts: " + response.errorBody().string());
            throw new RuntimeException("Could not fetch accounts: " + response.code());
        }

        // Add item id to notification user table to be able to retrieve user id with
        // item id later
        userRepository.save(new NotificationUser(response.body().getItem().getItemId(), userId));
        // Convert Plaid accounts to the application's PlaidAccount model.
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

    /**
     * Calculates the total bank balance for the given access tokens.
     * 
     * @param accessTokens A list of access tokens associated with the user's
     *                     accounts.
     * @return The total available balance for all accounts.
     * @throws Exception If the Plaid API request fails.
     */
    public double getBankBalance(List<String> accessTokens) throws Exception {
        double balance = 0;

        // Iterate over each access token to fetch account balances.
        for (String accessToken : accessTokens) {
            AccountsBalanceGetRequest request = new AccountsBalanceGetRequest().accessToken(accessToken);
            Response<AccountsGetResponse> response = plaidClient.accountsBalanceGet(request).execute();

            // Sum the available balance for depository accounts.
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
