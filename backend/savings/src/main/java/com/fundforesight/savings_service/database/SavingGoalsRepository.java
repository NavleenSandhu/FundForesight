package com.fundforesight.savings_service.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fundforesight.savings_service.models.SavingGoal;
import com.fundforesight.savings_service.models.SavingGoal.Status;

import jakarta.transaction.Transactional;

import java.sql.Date;
import java.util.List;

@Repository
public interface SavingGoalsRepository extends JpaRepository<SavingGoal, Integer> {
    List<SavingGoal> findByUserId(int userId);

    @Modifying
    @Transactional
    @Query("UPDATE SavingGoal s SET s.goalName=:goalName, s.targetAmount=:targetAmount, s.currentAmount=:currentAmount, s.startDate=:startDate, s.endDate=:endDate, s.status=:status WHERE s.goalId=:goalId AND s.userId=:userId")
    void updateSavingGoal(@Param("goalName") String goalName, @Param("targetAmount") double targetAmount,
            @Param("currentAmount") double currentAmount, @Param("startDate") Date startDate,
            @Param("endDate") Date endDate, @Param("status") Status status, @Param("goalId") int goalId,
            @Param("userId") int userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM SavingGoal s WHERE s.goalId=:goalId AND s.userId=:userId")
    void deleteByGoalAndUserId(@Param("goalId") int goalId, @Param("userId") int userId);
}
