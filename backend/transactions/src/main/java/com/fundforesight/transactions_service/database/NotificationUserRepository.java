package com.fundforesight.transactions_service.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fundforesight.transactions_service.models.NotificationUser;
import java.util.List;


@Repository
public interface NotificationUserRepository extends JpaRepository<NotificationUser, String> {
    List<NotificationUser> findByUserId(int userId);
}
