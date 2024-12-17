import { View, Text, StyleSheet, useColorScheme, ScrollView, ActivityIndicator, } from 'react-native'
import React from 'react'
import TransactionsList from '@/features/transactions/components/TransactionsList'
import BalanceCard from '@/features/transactions/components/BalanceCard'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Colors } from '@/constants/Colors'
import AddTransactionDialogButton from '@/features/transactions/components/AddTransactionDialogButton'
import { SafeAreaView } from 'react-native-safe-area-context'

const TransactionsScreen = () => {
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
        description: {
            textAlign: 'center',
            color: Colors.light.mutedForeground,
        },
    })

    const { transactions, loading } = useSelector((state: RootState) => state.transactions)

    return (
        <SafeAreaView>
            <ScrollView style={{ marginBottom: 60 }}>
                <Text style={styles.title}>Transactions</Text>
                {loading && transactions.length === 0 ?
                    <ActivityIndicator />
                    :
                    <>
                        <BalanceCard />
                        <View style={{ flexDirection: 'row-reverse', marginRight: 20 }}>
                            <AddTransactionDialogButton />
                        </View>
                        <TransactionsList transactions={transactions} />
                    </>
                }
            </ScrollView>
        </SafeAreaView>
    )
}


export default TransactionsScreen