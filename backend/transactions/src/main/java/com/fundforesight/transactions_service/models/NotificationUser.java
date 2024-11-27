package com.fundforesight.transactions_service.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notification_users")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class NotificationUser {
    @Id
    @Column(name = "item_id")
    private String itemId;

    @Column(name = "user_id")
    private int userId;
}
