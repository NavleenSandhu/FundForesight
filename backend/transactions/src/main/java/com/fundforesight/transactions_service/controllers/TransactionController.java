package com.fundforesight.transactions_service.controllers;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fundforesight.transactions_service.database.PlaidAccountRepository;
import com.fundforesight.transactions_service.database.TransactionRepository;
import com.fundforesight.transactions_service.models.Transaction;
import com.fundforesight.transactions_service.services.PlaidService;
import com.fundforesight.transactions_service.utils.TransactionHelper;

import lombok.AllArgsConstructor;

/**
 * REST controller for managing transactions.
 * Provides endpoints to create, retrieve, update, and delete transactions.
 */
@RestController
@RequestMapping("/transactions")
@AllArgsConstructor
public class TransactionController {

    private TransactionRepository transactionRepository;
    private TransactionHelper transactionHelper;
    private PlaidAccountRepository plaidAccountRepository;
    private PlaidService plaidService;
    private KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * Retrieves all transactions for a user.
     * If transactions are not up-to-date, it fetches new ones using Plaid and
     * stores them in the database.
     *
     * @param userId The ID of the user whose transactions are being retrieved.
     * @return A ResponseEntity containing the list of transactions or an error
     *         message.
     */
    @GetMapping(value = { "/", "" })
    public ResponseEntity<?> getTransactions(
            @RequestParam(name = "user_id", defaultValue = "0", required = false) int userId,
            @RequestParam(name = "start_date", defaultValue = "", required = false) String startDate,
            @RequestParam(name = "end_date", defaultValue = "", required = false) String endDate) {
        try {
            // Validate user ID.
            transactionHelper.validateUserId(userId);

            // Fetch access tokens for the user and update transactions if necessary.
            List<String> accessTokens = plaidAccountRepository.findAccessTokensByUserId(userId);
            transactionHelper.addNewTransactions(accessTokens, transactionRepository, plaidService, userId);

            // Retrieve all transactions for the user.
            List<Transaction> transactions = new ArrayList<Transaction>();
            if (startDate.equals("") && endDate.equals("")) {
                transactions = transactionRepository.findByUserId(userId);
            } else {

                Timestamp startTime = Timestamp.valueOf(startDate.concat(" 00:00:00"));
                Timestamp endTime = Timestamp.valueOf(endDate.concat(" 00:00:00"));
                transactions = transactionRepository.getTransactionsBetweenDates(userId, startTime, endTime);
            }

            return new ResponseEntity<>(transactions, HttpStatus.OK);
        } catch (Exception e) {
            // Handle exceptions and return appropriate error response.
            String message = e.getMessage();
            System.err.println(message);
            if (e instanceof MissingServletRequestParameterException) {
                return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Adds new transactions to the database.
     *
     * @param transactions A list of transactions to be saved.
     * @return A ResponseEntity indicating the result of the operation.
     */
    @PostMapping(value = { "/", "" }, headers = { "Content-Type=application/json" })
    public ResponseEntity<?> addTransactions(@RequestBody List<Transaction> transactions) {
        try {
            // Save all transactions to the database.
            List<Transaction> transactionsSaved = transactionRepository.saveAll(transactions);

            // Send a message to notification service.
            kafkaTemplate.send("transactions", transactionsSaved);
            return new ResponseEntity<>(transactionsSaved, HttpStatus.CREATED);
        } catch (Exception e) {
            // Handle exceptions and return an error response.
            System.err.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Updates an existing transaction in the database.
     *
     * @param id The ID of the transaction to update.
     * @param t  The updated transaction details.
     * @return A ResponseEntity indicating the result of the operation.
     */
    @PutMapping(value = "/{id}", headers = { "Content-Type=application/json" })
    public ResponseEntity<?> updateTransaction(@PathVariable int id, @RequestBody Transaction t) {
        try {
            // Update the specified transaction in the database.
            transactionRepository.updateTransaction(t.getBudgetId(), t.getAmount(), t.getMerchantName(),
                    t.getTransactionType(), id, t.getUserId());
            // Send a message to notification service.
            List<Transaction> transactions = new ArrayList<Transaction>();
            transactions.add(t);
            kafkaTemplate.send("transactions", transactions);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            // Handle exceptions and return an error response.
            System.err.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes a transaction for a user.
     *
     * @param id     The ID of the transaction to delete.
     * @param userId The ID of the user to validate ownership of the transaction.
     * @return A ResponseEntity indicating the result of the operation.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable int id,
            @RequestParam(name = "user_id", defaultValue = "0", required = false) int userId) {
        try {
            // Validate user ID before deleting the transaction.
            transactionHelper.validateUserId(userId);

            // Delete the transaction for the specified user and transaction ID.
            transactionRepository.deleteByTransactionAndUserId(id, userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            // Handle exceptions and return an error response.
            System.err.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
