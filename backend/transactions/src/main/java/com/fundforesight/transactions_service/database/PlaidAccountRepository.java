package com.fundforesight.transactions_service.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fundforesight.transactions_service.models.PlaidAccount;
import java.util.List;

@Repository
public interface PlaidAccountRepository extends JpaRepository<PlaidAccount, Integer> {
    List<PlaidAccount> findByUserId(int userId);

    @Query("SELECT DISTINCT p.accessToken FROM PlaidAccount p WHERE userId= :userId")
    List<String> findAccessTokensByUserId(@Param("userId") int userId);
}
