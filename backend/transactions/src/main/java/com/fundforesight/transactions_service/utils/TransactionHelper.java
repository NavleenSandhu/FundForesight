package com.fundforesight.transactions_service.utils;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.MissingServletRequestParameterException;

import com.fundforesight.transactions_service.database.BudgetRepository;
import com.fundforesight.transactions_service.database.TransactionRepository;
import com.fundforesight.transactions_service.models.Budget;
import com.fundforesight.transactions_service.models.Transaction;
import com.fundforesight.transactions_service.models.Transaction.TransactionType;
import com.fundforesight.transactions_service.services.AIService;
import com.fundforesight.transactions_service.services.PlaidService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TransactionHelper {

    private BudgetRepository budgetRepository;
    private AIService aiService;

    /**
     * Validates the provided user ID.
     * Throws an exception if the user ID is invalid (0).
     *
     * @param userId The user ID to validate.
     * @throws MissingServletRequestParameterException if the user ID is missing or
     *                                                 invalid.
     */
    public void validateUserId(int userId) throws MissingServletRequestParameterException {
        if (userId == 0) {
            throw new MissingServletRequestParameterException("user_id", "Integer");
        }
    }

    /**
     * Fetches and adds new transactions for the given user.
     * Uses Plaid to retrieve transactions starting from either the most recent
     * transaction
     * date in the database or the past 30 days. Transactions are then saved to the
     * database,
     * and the corresponding budgets are updated based on the transaction amounts.
     *
     * @param accessTokens          The list of Plaid access tokens for the user.
     * @param transactionRepository The repository to store transactions.
     * @param plaidService          The service to fetch transactions from Plaid.
     * @param userId                The ID of the user whose transactions are being
     *                              fetched.
     * @throws Exception if an error occurs during the process.
     */
    public void addNewTransactions(List<String> accessTokens, TransactionRepository transactionRepository,
            PlaidService plaidService, int userId) throws Exception {
        // Check if transactions exist in the database for this user.
        boolean transactionsInDbExist = transactionRepository.findByUserId(userId).size() > 0;

        // Set the start date to either 30 days ago or the most recent transaction date.
        LocalDate startDate = LocalDate.now().minusDays(30);
        Optional<Timestamp> timestampResult = transactionRepository.findMostRecentTimestamp(userId);
        if (transactionsInDbExist && timestampResult.isPresent()) {
            Timestamp timestamp = timestampResult.get();
            startDate = timestamp.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }

        // Iterate through each access token and fetch transactions from Plaid.
        for (String accessToken : accessTokens) {
            List<Transaction> transactions = plaidService.getPlaidTransactions(
                    accessToken, userId, startDate, transactionsInDbExist, timestampResult);

            // Save all fetched transactions to the database.
            transactionRepository.saveAll(transactions);

            // Group transactions by budget ID and calculate the total amount for each
            // budget.
            Map<Integer, Double> totalAmounts = transactions.stream()
                    .collect(Collectors.groupingBy(
                            Transaction::getBudgetId,
                            Collectors.summingDouble(
                                    transaction -> transaction.getTransactionType() == TransactionType.EXPENSE
                                            ? transaction.getAmount()
                                            : -transaction.getAmount())));

            // Update the budget amounts based on the calculated totals.
            totalAmounts.forEach((budgetId, totalAmount) -> {
                budgetRepository.updateBudgetAmountById(budgetId, totalAmount);
            });
        }
    }

    /**
     * Updates the budget IDs for a list of transactions using AI categorization.
     * This method sends a structured prompt to the AI service to map Plaid
     * transaction categories
     * to corresponding budget IDs in the database.
     *
     * @param transactions      The list of transactions to update.
     * @param plaidTransactions The corresponding Plaid transactions.
     * @param userId            The ID of the user to whom the transactions belong.
     */
    public void updateBudgetIds(List<Transaction> transactions,
            List<com.plaid.client.model.Transaction> plaidTransactions, int userId) {
        // Base prompt for the AI categorization logic.
        String rawPrompt = "Return a json object containing budget_ids from db_input in same order of the objects in raw_input where category_name is similar to anything in the categories array of each object in raw_input:\n";

        // Prepare the input data for the AI prompt.
        JSONArray rawInput = new JSONArray();
        for (com.plaid.client.model.Transaction transaction : plaidTransactions) {
            JSONObject rawInputObject = new JSONObject();
            JSONArray categoryArray = new JSONArray();
            categoryArray.put(transaction.getCategory());
            rawInputObject.put("category", categoryArray);
            rawInput.put(rawInputObject);
        }

        // Get startDate and endDate of current month
        LocalDate startDate = LocalDate.now().withDayOfMonth(1);
        LocalDate endDate = LocalDate.now().plusMonths(1).withDayOfMonth(1).minusDays(1);
        // Fetch budgets from the database and prepare the db_input for the AI prompt.
        List<Budget> budgets = budgetRepository.findByUserIdAndStartDateAndEndDate(userId, startDate, endDate);
        JSONArray dbInput = new JSONArray();
        for (Budget budget : budgets) {
            JSONObject dbInputObject = new JSONObject();
            dbInputObject.put("budget_id", budget.getBudgetId());
            dbInputObject.put("category_name", budget.getCategoryName());
            dbInput.put(dbInputObject);
        }

        // Combine raw_input and db_input into the final AI prompt.
        JSONObject promptObject = new JSONObject();
        promptObject.put("raw_input", rawInput);
        promptObject.put("db_input", dbInput);
        String prompt = rawPrompt.concat(promptObject.toString()).concat("\nOnly return a json array with ids.");

        try {
            // Send the prompt to the AI service and parse the response.
            JSONArray responseArray = aiService.getResponse(prompt, transactions.size());

            // Update the budget IDs for each transaction based on the AI response.
            for (int i = 0; i < responseArray.length(); i++) {
                transactions.get(i).setBudgetId(responseArray.getInt(i));
            }
        } catch (IOException e) {
            // Log any errors that occur during the AI request.
            System.err.println(e.getMessage());
        }
    }
}
