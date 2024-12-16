import { View, Text, useColorScheme, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import TransactionsList from './TransactionsList'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

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
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 16,
            color: colors.primary
        },
    })
    const { transactions } = useSelector((state: RootState) => state.transactions)
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transactions</Text>
            <TransactionsList transactions={transactions.slice(0, 5)} />
        </View>
    )
}

export default TransactionsOverview