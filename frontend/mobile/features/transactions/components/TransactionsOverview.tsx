import { View, Text, useColorScheme, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import TransactionsList from './TransactionsList'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useRouter } from 'expo-router'

const TransactionsOverview = () => {
    const colorScheme = useColorScheme()
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light
    const styles = StyleSheet.create({
        container: {
            padding: 16,
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: colors.card,
            borderColor: colors.border,
            margin: 15,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 16,
            color: colors.primary
        },
        button: {
            padding: 8,
            paddingHorizontal: 10,
            backgroundColor: colors.primary,
            borderRadius: 10,
        },
        buttonText: {
            color: colors.primaryForeground,
            fontSize: 14,
            fontWeight: "600"
        },
    })

    const router = useRouter()
    const { transactions } = useSelector((state: RootState) => state.transactions)
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transactions</Text>
            <TransactionsList transactions={transactions.slice(0, 5)} />
            {transactions.length > 5
                &&
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <TouchableOpacity style={styles.button} onPress={() => { router.push('/transactions') }}>
                        <Text style={styles.buttonText}>View More</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export default TransactionsOverview