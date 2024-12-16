import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Notification } from '@/models/Notification';
import { formatDateAndTime } from '@/utils/dateUtils';
import { Colors } from '@/constants/Colors';
import AddToSavingsDialog from '@/features/savingGoals/components/AddToSavingsDialog';

interface NotificationListItemProps {
    notification: Notification;
}

const NotificationListItem: React.FC<NotificationListItemProps> = ({ notification }) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const styles = StyleSheet.create({
        card: {
            margin: 16,
            padding: 16,
            backgroundColor: colors.card,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
        },
        cardTitle: {
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 8,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.cardForeground,
        },
        timestamp: {
            fontSize: 12,
            color: colors.mutedForeground,
        },
        message: {
            fontSize: 14,
            color: colors.cardForeground,
        },
    });

    return (
        <View style={styles.card}>
            <View style={styles.cardTitle}>
                <Text style={styles.title}>{notification.title}</Text>
                <Text style={styles.timestamp}>{formatDateAndTime(notification.timestamp)}</Text>
            </View>
            <Text style={styles.message}>{notification.message}</Text>
            {notification.notificationType === "EXPENDITURE_REVIEW" &&
                notification.message.includes("saved") && (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>

                        <AddToSavingsDialog
                            notificationId={notification.notificationId}
                            initialAmount={parseFloat(notification.message.match(/(\d+(\.\d+)?)/)![0])}
                        />
                    </View>
                )}
        </View>
    );
};

export default NotificationListItem;