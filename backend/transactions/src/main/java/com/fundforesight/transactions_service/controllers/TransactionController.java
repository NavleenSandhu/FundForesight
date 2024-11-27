package com.fundforesight.transactions_service.controllers;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

@RestController
@RequestMapping("/transactions")
@AllArgsConstructor
public class TransactionController {
    private TransactionRepository transactionRepository;
    private TransactionHelper transactionHelper;
    private PlaidAccountRepository plaidAccountRepository;
    private PlaidService plaidService;

    @GetMapping(value = { "/", "" })
    public ResponseEntity<?> getTransactions(
            @RequestParam(name = "user_id", defaultValue = "0", required = false) int userId,
            @RequestParam(name = "start_date", defaultValue = "", required = false) String startDate,
            @RequestParam(name = "end_date", defaultValue = "", required = false) String endDate) {
        try {
            transactionHelper.validateUserId(userId);
            List<String> accessTokens = plaidAccountRepository.findAccessTokensByUserId(userId);
            transactionHelper.addNewTransactions(accessTokens, transactionRepository, plaidService, userId);
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
            String message = e.getMessage();
            System.err.println(message);
            if (e instanceof MissingServletRequestParameterException) {
                return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = { "/", "" }, headers = { "Content-Type=application/json" })
    public ResponseEntity<?> addTransactions(@RequestBody List<Transaction> transactions) {
        try {
            transactionRepository.saveAll(transactions);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{id}", headers = { "Content-Type=application/json" })
    public ResponseEntity<?> updateTransaction(@PathVariable int id, @RequestBody Transaction t) {
        try {
            transactionRepository.updateTransaction(t.getBudgetId(), t.getAmount(), t.getMerchantName(),
                    t.getTransactionType(), id, t.getUserId());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable int id,
            @RequestParam(name = "user_id", defaultValue = "0", required = false) int userId) {
        try {
            transactionHelper.validateUserId(userId);
            transactionRepository.deleteByTransactionAndUserId(id, userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
