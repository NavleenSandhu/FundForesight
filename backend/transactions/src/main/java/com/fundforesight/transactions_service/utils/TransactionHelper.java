package com.fundforesight.transactions_service.utils;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.MissingServletRequestParameterException;

import com.fundforesight.transactions_service.database.BudgetRepository;
import com.fundforesight.transactions_service.database.TransactionRepository;
import com.fundforesight.transactions_service.models.Budget;
import com.fundforesight.transactions_service.models.Transaction;
import com.fundforesight.transactions_service.services.AIService;
import com.fundforesight.transactions_service.services.PlaidService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TransactionHelper {
    private BudgetRepository budgetRepository;
    private AIService aiService;

    public void validateUserId(int userId) throws MissingServletRequestParameterException {
        if (userId == 0) {
            throw new MissingServletRequestParameterException("user_id", "Integer");
        }
    }

    public void addNewTransactions(List<String> accessTokens, TransactionRepository transactionRepository,
            PlaidService plaidService, int userId) throws Exception {
        boolean transactionsInDbExist = transactionRepository.findByUserId(userId).size() > 0;
        LocalDate startDate = LocalDate.now().minusDays(30);
        ;
        Optional<Timestamp> timestampResult = transactionRepository.findMostRecentTimestamp(userId);
        if (transactionsInDbExist && timestampResult.isPresent()) {
            Timestamp timestamp = timestampResult.get();
            startDate = timestamp.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }
        for (String accessToken : accessTokens) {
            List<Transaction> transactions = plaidService.getPlaidTransactions(accessToken, userId, startDate);
            if (transactionsInDbExist && timestampResult.isPresent()) {
                Timestamp timestamp = timestampResult.get();
                transactions.removeIf(transaction -> transaction.getTransactionDate().compareTo(timestamp) <= 0);
            }
            /*
             * Using a messaging service, send transactions to see if the budget is still
             * above a threshold, if not, the messaging service will trigger a notification
             */
            transactionRepository.saveAll(transactions);
        }
    }

    public void updateBudgetIds(List<Transaction> transactions,
            List<com.plaid.client.model.Transaction> plaidTransactions, int userId) {
        String rawPrompt = "Return a json object containing budget_ids from db_input in same order of the objects in raw_input where category_name is similar to anything in the categories array of each object in raw_input:\n";
        JSONArray rawInput = new JSONArray();
        for (com.plaid.client.model.Transaction transaction : plaidTransactions) {
            JSONObject rawInputObject = new JSONObject();
            JSONArray categoryArray = new JSONArray();
            categoryArray.put(transaction.getCategory());
            rawInputObject.put("category", categoryArray);
            rawInput.put(rawInputObject);
        }
        List<Budget> budgets = budgetRepository.findByUserId(userId);
        JSONArray dbInput = new JSONArray();
        for (Budget budget : budgets) {
            JSONObject dbInputObject = new JSONObject();
            dbInputObject.put("budget_id", budget.getBudgetId());
            dbInputObject.put("category_name", budget.getCategoryName());
            dbInput.put(dbInputObject);
        }
        JSONObject promptObject = new JSONObject();
        promptObject.put("raw_input", rawInput);
        promptObject.put("db_input", dbInput);
        String prompt = rawPrompt.concat(promptObject.toString()).concat("\nOnly return a json array with ids.");
        try {
            JSONArray responseArray = aiService.getResponse(prompt, transactions.size());
            for (int i = 0; i < responseArray.length(); i++) {
                transactions.get(i).setBudgetId(responseArray.getInt(i));
            }
        } catch (IOException e) {
            System.err.println(e.getMessage());
        }
    }
}
