import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { Budget } from '@/models/Budget';
import { deleteBudget } from '@/store/budgets/budgetsSlice';
import { displayDate } from '@/utils/dateUtils';

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/RootStackParamList';
import TransactionsList from '@/features/transactions/components/TransactionsList';

type BudgetDetailsProps = {
    route: RouteProp<RootStackParamList, 'BudgetDetails'>;
    navigation: StackNavigationProp<RootStackParamList, 'BudgetDetails'>;
};

const BudgetDetails = ({ route, navigation }: BudgetDetailsProps) => {
    const { budget_id } = route.params;
    const dispatch = useDispatch<AppDispatch>();
    const { transactions } = useSelector((state: RootState) => state.transactions);
    const budget: Budget = useSelector((state: RootState) => state.budgets.budgets.find(b => b.budget_id === budget_id))!;
    const { profile } = useSelector((state: RootState) => state.profile);

    useEffect(() => {
        if (!budget) {
            navigation.navigate('Budgets');
        }
    }, [budget]);

    const transactionsByBudget = transactions.filter(transaction =>
        transaction.budgetId === budget.budget_id
    );

    const deleteBudgetById = () => {
        dispatch(deleteBudget(budget.budget_id));
        navigation.navigate('Budgets');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Button title="Back" onPress={() => navigation.goBack()} />
                {budget.category_name !== 'Other' && (
                    <Button title="Delete Budget" onPress={deleteBudgetById} />
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>{budget.category_name}</Text>
                <Text style={styles.description}>
                    Budget period: {displayDate(budget.start_date)} to {displayDate(budget.end_date)}
                </Text>
                <View style={styles.amounts}>
                    <View style={styles.amount}>
                        <Text style={styles.label}>Initial Amount</Text>
                        <Text style={styles.value}>{profile.currency} {budget.initial_amount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.amount}>
                        <Text style={styles.label}>Remaining Amount</Text>
                        <Text style={styles.value}>{profile.currency} {budget.remaining_amount.toFixed(2)}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.transactionsCount}>Transactions: {transactionsByBudget.length}</Text>
                <Button title="Edit Budget" onPress={() => Linking.openURL(`/view-budget/${budget.budget_id}`)} />
            </View>

            <TransactionsList transactions={transactionsByBudget} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    amounts: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    amount: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: '#999',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    transactionsCount: {
        fontSize: 12,
        color: '#999',
    },
});

export default BudgetDetails;