import { Text, useColorScheme, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { persistor } from '@/store/store';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const profile = () => {
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
        row: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
        },
        logoutText: {
            color: colors.destructive,
            textAlign: 'center',
            fontSize: 20,
            marginRight: 10,
        },
        linkAccountText: {
            textAlign: 'center',
            fontSize: 20,
            marginRight: 10,
            color: colors.text
        }
    })

    const GATEWAY_URL = process.env.EXPO_PUBLIC_GATEWAY_URL

    const handleLogout = async () => {
        const res = await fetch(`${GATEWAY_URL}/logout`, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (res.status === 200) {
            persistor.purge()
            AsyncStorage.removeItem("token")
            router.replace('/login')
        }
    }
    return (
        <SafeAreaView>
            <ScrollView style={{ marginBottom: 60 }}>
                <Text style={styles.title}>Profile</Text>
                <TouchableOpacity style={styles.row} onPress={() => { Linking.openURL('http://192.168.248.32:4000/auth/login') }}>
                    <Text style={styles.linkAccountText}>Link bank account</Text>
                    <MaterialIcons name='subdirectory-arrow-right' color={colors.text} size={28} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.row} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                    <MaterialIcons name='exit-to-app' color={colors.destructive} size={28} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default profile