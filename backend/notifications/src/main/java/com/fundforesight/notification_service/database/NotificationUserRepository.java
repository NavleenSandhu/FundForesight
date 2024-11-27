package com.fundforesight.notification_service.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fundforesight.notification_service.models.NotificationUser;

@Repository
public interface NotificationUserRepository extends JpaRepository<NotificationUser, String> {
}
