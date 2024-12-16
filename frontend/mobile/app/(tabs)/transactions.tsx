import { View, Text, StyleSheet, useColorScheme } from 'react-native'
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
        }
    })

    const { transactions } = useSelector((state: RootState) => state.transactions)

    return (
        <SafeAreaView>
            <View>
                <Text style={styles.title}>Transactions</Text>
                <BalanceCard />
                <View style={{ flexDirection: 'row-reverse', marginRight: 20 }}>
                    <AddTransactionDialogButton />
                </View>
                <TransactionsList transactions={transactions} />
            </View>
        </SafeAreaView>
    )
}


export default TransactionsScreen