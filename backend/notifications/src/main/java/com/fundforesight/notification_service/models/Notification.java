package com.fundforesight.notification_service.models;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Table(name = "notifications")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Notification {

    public enum NotificationType {
        NEW_TRANSACTIONS, OVER_BUDGET_ALERT, LARGE_TRANSACTION_ALERT, SALARY_RECEIVED
    }

    public Notification(int userId, NotificationType notificationType, String title, String message) {
        this.userId = userId;
        this.notificationType = notificationType;
        this.title = title;
        this.message = message;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private int notificationId;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "notification_type")
    private NotificationType notificationType;

    private String title;

    private String message;

    private Timestamp timestamp;

    private boolean read;

}
