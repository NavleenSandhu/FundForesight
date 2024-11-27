package com.fundforesight.transactions_service.database;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.fundforesight.transactions_service.models.Transaction;
import com.fundforesight.transactions_service.models.Transaction.TransactionType;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
        List<Transaction> findByUserId(int userId);

        @Query("SELECT MAX(t.transactionDate) FROM Transaction t WHERE t.userId = :userId")
        Optional<Timestamp> findMostRecentTimestamp(@Param("userId") int userId);

        @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND t.transactionDate BETWEEN :startDate AND :endDate")
        List<Transaction> getTransactionsBetweenDates(@Param("userId") int userId,
                        @Param("startDate") Timestamp startDate,
                        @Param("endDate") Timestamp endDate);

        @Modifying
        @Transactional
        @Query("UPDATE Transaction t SET t.budgetId = :budgetId, t.amount = :amount, t.merchantName = :merchantName, t.transactionType = :transactionType WHERE t.transactionId = :transactionId AND t.userId = :userId")
        void updateTransaction(@Param("budgetId") int budgetId, @Param("amount") double amount,
                        @Param("merchantName") String merchantName,
                        @Param("transactionType") TransactionType transactionType,
                        @Param("transactionId") int transactionId, @Param("userId") int userId);

        @Modifying
        @Transactional
        @Query("DELETE FROM Transaction t WHERE t.transactionId = :transactionId AND t.userId = :userId")
        void deleteByTransactionAndUserId(@Param("transactionId") int transactionId, @Param("userId") int userId);
}
