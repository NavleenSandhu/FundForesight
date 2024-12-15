import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import TransactionsList from '@/features/transactions/components/TransactionsList'
import BalanceCard from '@/features/transactions/components/BalanceCard'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const TransactionsScreen = () => {
    const { transactions } = useSelector((state: RootState) => state.transactions)

    return (
        <View style={{ marginTop: 50 }}>
            <Text style={styles.title}>Transactions</Text>
            <BalanceCard />
            <TransactionsList transactions={transactions} />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
})

export default TransactionsScreen