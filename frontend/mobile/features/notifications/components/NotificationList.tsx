import React from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { RootState } from '@/store/store';
import NotificationListItem from './NotificationListItem';
import { Notification } from '@/models/Notification';

const NotificationList = () => {
    const { notifications } = useSelector((state: RootState) => state.notifications);

    return (
        <View style={styles.container}>
            {notifications.map((notification: Notification) => (
                <NotificationListItem key={notification.notificationId} notification={notification} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

export default NotificationList;