package com.fundforesight.transactions_service.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fundforesight.transactions_service.database.PlaidAccountRepository;
import com.fundforesight.transactions_service.models.PlaidAccount;
import com.fundforesight.transactions_service.services.PlaidService;
import com.fundforesight.transactions_service.utils.TransactionHelper;

import lombok.AllArgsConstructor;

/**
 * Controller for managing Plaid accounts.
 * Provides endpoints for creating link tokens, adding Plaid accounts, and
 * fetching account balances.
 */
@RestController
@RequestMapping("/plaidAccounts")
@AllArgsConstructor
public class PlaidAccountController {

    private TransactionHelper transactionHelper;
    private PlaidService plaidService;
    private PlaidAccountRepository plaidAccountRepository;

    /**
     * Generates a Plaid link token for a user.
     * 
     * @param userId The ID of the user for whom the link token is generated.
     * @return A ResponseEntity containing the link token or an error message.
     */
    @CrossOrigin("${API_GATEWAY_URL}")
    @GetMapping("/link-token")
    public ResponseEntity<?> getLinkToken(
            @RequestParam(name = "user_id", defaultValue = "0", required = false) int userId) {
        try {
            // Validate the provided user ID.
            transactionHelper.validateUserId(userId);

            // Generate a Plaid link token for the user.
            String linkToken = plaidService.createLinkToken(userId);
            return new ResponseEntity<>(linkToken, HttpStatus.OK);
        } catch (Exception e) {
            // Handle exceptions and return an appropriate error response.
            String message = e.getMessage();
            System.err.println(message);
            if (e instanceof MissingServletRequestParameterException) {
                return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Adds new Plaid accounts for a user using a public token.
     * 
     * @param body A map containing the user's public token and ID.
     * @return A ResponseEntity indicating the result of the operation.
     */
    @CrossOrigin("${API_GATEWAY_URL}")
    @PostMapping(value = "/addPlaidAccount", headers = { "Content-Type=application/json" })
    public ResponseEntity<?> addPlaidAccounts(@RequestBody Map<String, Object> body) {
        try {
            // Extract user ID and validate it.
            int userId = (int) body.get("user_id");
            transactionHelper.validateUserId(userId);

            // Exchange the public token for an access token.
            String accessToken = plaidService.getAccessToken((String) body.get("public_token"));

            // Fetch the user's Plaid accounts using the access token.
            List<PlaidAccount> plaidAccounts = plaidService.getPlaidAccounts(accessToken, userId);

            // Save the fetched Plaid accounts to the database.
            plaidAccountRepository.saveAll(plaidAccounts);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            // Handle exceptions and return an appropriate error response.
            String message = e.getMessage();
            System.err.println(message);
            if (e instanceof MissingServletRequestParameterException) {
                return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves the total balance across all Plaid accounts for a user.
     * 
     * @param userId The ID of the user whose total balance is being calculated.
     * @return A ResponseEntity containing the total balance or an error message.
     */
    @GetMapping("/balance")
    public ResponseEntity<?> getTotalBalance(
            @RequestParam(name = "user_id", defaultValue = "0", required = false) int userId) {
        try {
            // Validate the provided user ID.
            transactionHelper.validateUserId(userId);

            // Fetch all access tokens associated with the user.
            List<String> accessTokens = plaidAccountRepository.findAccessTokensByUserId(userId);

            // Calculate the total balance across all accounts using the access tokens.
            double balance = plaidService.getBankBalance(accessTokens);
            return new ResponseEntity<>(balance, HttpStatus.OK);
        } catch (Exception e) {
            // Handle exceptions and return an appropriate error response.
            System.err.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
