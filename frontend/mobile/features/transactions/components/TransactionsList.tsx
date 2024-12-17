import { View } from 'react-native'
import React from 'react'
import TransactionListItem from './TransactionListItem';
import { Transaction } from '@/models/Transaction';
import { ThemedText } from '@/components/ThemedText';

interface TransactionsListProps {
    transactions: Transaction[]
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
    const transactionsSorted = [...transactions].sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
    return (
        <View>
            {
                transactions.length === 0 ?
                    <ThemedText type='subtitle'>No transactions to display here.</ThemedText>
                    :
                    transactionsSorted.map((transaction, index) =>
                        <TransactionListItem key={index} transaction={transaction} />
                    )
            }
        </View>
    )
}

export default TransactionsList