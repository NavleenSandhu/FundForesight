import { Text, useColorScheme, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { persistor } from '@/store/store';

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
        }
    })
    const handleLogout = async () => {
        persistor.purge();
    }
    return (
        <SafeAreaView>
            <ScrollView>
                <Text style={styles.title}>Profile</Text>
                <TouchableOpacity style={styles.row} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                    <MaterialIcons name='exit-to-app' color={colors.destructive} size={28} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default profile