package com.fundforesight.transactions_service.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fundforesight.transactions_service.models.UserPreference;
import java.util.Optional;

@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Integer> {
    Optional<UserPreference> findByUserId(int userId);
}