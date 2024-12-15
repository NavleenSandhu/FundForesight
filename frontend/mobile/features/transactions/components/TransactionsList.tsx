import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { RootState } from '@/store/store';
import TransactionListItem from './TransactionListItem';
import { useSelector } from 'react-redux';
import TransactionListItemSkeleton from './TransactionListItemSkeleton';
import { Transaction } from '@/models/Transaction';

interface TransactionsListProps {
    transactions: Transaction[]
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
    const { loading } = useSelector((state: RootState) => state.transactions)
    const transactionsSorted = [...transactions].sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
    return (

        <View style={{ marginTop: 0 }}>
            {loading && transactions && transactions.length === 0 ? (
                <View className="mt-4 h-96 p-2 rounded-lg">
                    {[...Array(5)].map((_, index) => (
                        <TransactionListItemSkeleton key={index} />
                    ))}
                </View>
            ) : (
                <ScrollView>
                    {transactionsSorted.map((transaction, index) =>
                        <TransactionListItem key={index} transaction={transaction} />
                    )
                    }
                </ScrollView>
            )}
        </View>
    )
}

export default TransactionsList