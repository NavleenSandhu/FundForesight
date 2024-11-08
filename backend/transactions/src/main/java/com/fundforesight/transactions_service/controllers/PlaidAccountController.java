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

@RestController
@RequestMapping("/plaidAccounts")
@AllArgsConstructor
public class PlaidAccountController {
    private TransactionHelper transactionHelper;
    private PlaidService plaidService;
    private PlaidAccountRepository plaidAccountRepository;

    @GetMapping("/link-token")
    public ResponseEntity<?> getLinkToken(
            @RequestParam(name = "user_id", defaultValue = "0", required = false) int userId) {
        try {
            transactionHelper.validateUserId(userId);
            String linkToken = plaidService.createLinkToken(userId);
            return new ResponseEntity<>(linkToken, HttpStatus.OK);
        } catch (Exception e) {
            String message = e.getMessage();
            System.err.println(message);
            if (e instanceof MissingServletRequestParameterException) {
                return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/addPlaidAccount", headers = { "Content-Type=application/json" })
    public ResponseEntity<?> addPlaidAccounts(@RequestBody Map<String, Object> body) {
        try {
            int userId = (int) body.get("user_id");
            transactionHelper.validateUserId(userId);
            String accessToken = plaidService.getAccessToken((String) body.get("public_token"));
            List<PlaidAccount> plaidAccounts = plaidService.getPlaidAccounts(accessToken, userId);
            plaidAccountRepository.saveAll(plaidAccounts);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            String message = e.getMessage();
            System.err.println(message);
            if (e instanceof MissingServletRequestParameterException) {
                return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
