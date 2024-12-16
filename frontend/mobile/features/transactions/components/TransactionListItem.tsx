import { View, Text } from 'react-native'
import React from 'react'
import { Transaction } from '@/models/Transaction'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from 'react-native';
import MoveTransactionDialogButton from './MoveTransactionDialogButton';
interface TransactionListItemProps {
    transaction: Transaction
}


const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction }) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const styles = {
        container: {
            padding: 16,
            borderWidth: 1,
            borderRadius: 10,
            margin: 10,
            marginHorizontal: 20,
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        row: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
        },
        merchantContainer: {
            flex: 1,
        },
        merchantName: {
            fontSize: 16,
            fontWeight: 'bold' as const,
            color: colors.cardForeground,
        },
        amount: {
            fontSize: 16,
            marginRight: 75,
        },
        income: {
            color: 'green',
        },
        expense: {
            color: 'red',
        },
        date: {
            fontSize: 12,
            marginTop: 5,
            color: colors.mutedForeground,
        },
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.merchantContainer}>
                    <Text style={styles.merchantName}>{transaction.merchantName}</Text>
                </View>
                <Text style={[
                    styles.amount,
                    transaction.transactionType === 'INCOME' ? styles.income : styles.expense,
                ]}>
                    {transaction.transactionType === 'INCOME' ? `+${transaction.amount.toFixed(2)}` : `-${Math.abs(transaction.amount).toFixed(2)}`}
                </Text>
                <MoveTransactionDialogButton transaction={transaction} />
            </View>
            <Text style={styles.date}>{new Date(transaction.transactionDate.toString()).toLocaleString()}</Text>
        </View>
    );
};


export default TransactionListItem