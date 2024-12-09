package com.fundforesight.notification_service.database;

import com.fundforesight.notification_service.models.Notification;
import com.fundforesight.notification_service.models.Notification.NotificationType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserId(int userId);

    boolean existsByUserIdAndNotificationTypeAndTimestampAfter(int userId, NotificationType type, Timestamp timestamp);

}
