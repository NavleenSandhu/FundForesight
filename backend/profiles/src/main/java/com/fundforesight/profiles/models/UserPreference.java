package com.fundforesight.profiles.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_preferences")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserPreference {
    public enum CountryCode {
        US, GB, ES, NL, FR, IE, CA, DE, IT, PL, DK, NO, SE, EE, LT, LV, PT, BE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "preference_id")
    private int preferenceId;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "currency", length = 10, nullable = false)
    private String currency = "USD";

    @Column(name = "receive_notifications", nullable = false)
    private Boolean receiveNotifications = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "country_code", nullable = false, length = 2)
    private CountryCode countryCode;
}
