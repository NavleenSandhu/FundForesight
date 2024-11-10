package com.fundforesight.transactions_service.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fundforesight.transactions_service.models.Budget;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Integer> {
    List<Budget> findByUserId(int userId);

    @Query("SELECT b.budgetId FROM Budget b WHERE b.userId=:userId AND b.categoryName=:categoryName")
    int findBudgetByUserIdAndCategory(@Param("userId") int userId, @Param("categoryName") String categoryName);
}
