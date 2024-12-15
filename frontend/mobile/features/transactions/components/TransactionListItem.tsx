import { View, Text } from 'react-native'
import React from 'react'
import { Transaction } from '@/models/Transaction'
import { Colors } from '@/constants/Colors'
interface TransactionListItemProps {
    transaction: Transaction
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction }) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.merchantContainer}>
                    <Text style={styles.merchantName}>{transaction.merchantName}</Text>
                </View>
                <Text style={[styles.amount, transaction.transactionType === 'INCOME' ? styles.income : styles.expense]}>
                    {transaction.transactionType === 'INCOME' ? `+${transaction.amount.toFixed(2)}` : `-${Math.abs(transaction.amount).toFixed(2)}`}
                </Text>
            </View>
            <Text style={styles.date}>{new Date(transaction.transactionDate.toString()).toLocaleString()}</Text>
        </View>
    )
}

const styles = {
    container: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: Colors.light.background,
        margin: 10,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    row: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
    },
    merchantContainer: {
        flex: 1,
    },
    merchantName: {
        fontSize: 16,
        fontWeight: 'bold' as const,
    },
    amount: {
        fontSize: 16,
    },
    income: {
        color: 'green',
    },
    expense: {
        color: 'red',
    },
    date: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
}

export default TransactionListItem