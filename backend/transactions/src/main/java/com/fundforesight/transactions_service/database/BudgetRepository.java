package com.fundforesight.transactions_service.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fundforesight.transactions_service.models.Budget;

import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Integer> {
    List<Budget> findByUserIdAndStartDateAndEndDate(int userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT b.budgetId FROM Budget b WHERE b.userId=:userId AND b.categoryName=:categoryName")
    int findBudgetByUserIdAndCategory(@Param("userId") int userId, @Param("categoryName") String categoryName);

    @Modifying
    @Transactional
    @Query("UPDATE Budget b SET b.remainingAmount = b.remainingAmount - :remainingAmount WHERE b.budgetId = :budgetId")
    void updateBudgetAmountById(@Param("budgetId") int budgetId, @Param("remainingAmount") BigDecimal remainingAmount);
}
