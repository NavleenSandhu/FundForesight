import { Text, ScrollView, useColorScheme, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import NotificationList from '@/features/notifications/components/NotificationList'
import { Colors } from '@/constants/Colors'
import Switch from '@/components/Switch'

const notifications = () => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const styles = StyleSheet.create({
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 10,
            color: colors.foreground,
        },
    })
    return (
        <SafeAreaView>
            <ScrollView>
                <Switch active='notifications' />
                <Text style={styles.title}>Notifications</Text>
                <NotificationList />
            </ScrollView>
        </SafeAreaView>
    )
}

export default notifications