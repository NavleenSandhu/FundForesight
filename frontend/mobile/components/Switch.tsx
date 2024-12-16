import { View, Text, useColorScheme, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const Switch = ({ active }: { active: string }) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const styles = StyleSheet.create({
        switchContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
            backgroundColor: colors.muted,
            borderRadius: 25,
            padding: 6,
        },
        active: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.foreground,
            backgroundColor: colors.background,
            borderRadius: 25,
            padding: 8
        },
        inactive: {
            fontSize: 18,
            fontWeight: 'bold',
            marginHorizontal: 10,
            color: colors.foreground,
        }
    })

    const router = useRouter();
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity style={styles.switchContainer} onPress={() => { active === 'overview' ? router.replace('/notifications') : router.replace('/overview') }}>
                <Text style={active === 'overview' ? styles.active : styles.inactive}>
                    Overview
                </Text>
                <Text style={active === 'notifications' ? styles.active : styles.inactive}>
                    Notifications
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default Switch