package com.fundforesight.transactions_service.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fundforesight.transactions_service.models.Transaction;
import com.fundforesight.transactions_service.models.Transaction.TransactionType;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByUserId(int userId);

    @Query("SELECT MAX(t.transactionDate) FROM Transaction t WHERE t.userId = :userId")
    Optional<Timestamp> findMostRecentTimestamp(@Param("userId") int userId);

    @Query("UPDATE Transaction t SET t.budgetId = :budgetId, t.amount = :amount, t.merchantName = :merchantName, t.transactionType = :transactionType WHERE t.transactionId = :transactionId")
    void updateTransaction(@Param("budgetId") int budgetId, @Param("amount") double amount,
            @Param("merchantName") String merchantName, @Param("transactionType") TransactionType transactionType,
            @Param("transactionId") int transactionId);
}
