import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { deleteBudget } from '@/store/budgets/budgetsSlice';
import TransactionsList from '@/features/transactions/components/TransactionsList';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import EditBudgetDialogButton from '@/features/budgets/components/EditBudgetDialogButton';


const BudgetDetails = () => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const styles = StyleSheet.create({
        container: {
            padding: 16,
            marginBottom: 60
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        card: {
            padding: 16,
            backgroundColor: colors.card,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 16,
        },
        backButton: {
            fontSize: 24,
            color: 'hsl(211.2, 83.2%, 53.3%)',
        },
        title: {
            color: colors.cardForeground,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            borderRadius: 10,
            borderColor: colors.primary,
        },
        badge: {
            fontSize: 16,
            color: colors.text,
            fontWeight: '600',
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 16,
            backgroundColor: colors.card,
            padding: 8,
        },
        amounts: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
        },
        amount: {
            flex: 1,
        },
        deleteButton: {
            backgroundColor: colors.destructive,
            borderRadius: 10,
            padding: 8,
        },
        deleteButtonText: {
            color: colors.destructiveForeground,
            fontWeight: '600',
        }
    });

    const { budget_id } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const id = parseInt(budget_id as string)
    const budget = useSelector((state: RootState) => state.budgets.budgets.find(b => b.budget_id === id));
    const transactions = useSelector((state: RootState) => state.transactions.transactions.filter(t => t.budgetId === id));
    const profile = useSelector((state: RootState) => state.profile.profile);

    if (!budget) {
        router.push('/budgets');
        return null;
    }

    const deleteBudgetById = () => {
        dispatch(deleteBudget(budget.budget_id));
        router.push('/budgets');
    };

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.replace('/budgets')}>
                        <MaterialIcons name='arrow-back-ios' style={styles.backButton} />
                    </TouchableOpacity>
                    {budget.category_name !== 'Other' && (
                        <TouchableOpacity style={styles.deleteButton} onPress={deleteBudgetById} >
                            <Text style={styles.deleteButtonText}>Delete Budget</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.card}>
                    <Text style={styles.title}>{budget.category_name}</Text>
                    <Text style={{ textAlign: 'center', color: colors.cardForeground }}>Budget period: {new Date(budget.start_date).toLocaleDateString()} to {new Date(budget.end_date).toLocaleDateString()}</Text>
                    <View style={styles.amounts}>
                        <View style={styles.amount}>
                            <Text style={{ color: colors.mutedForeground }}>Initial Amount</Text>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.cardForeground }}>{profile.currency} {budget.initial_amount.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.amount]}>
                            <Text style={{ color: colors.mutedForeground, textAlign: 'right' }}>Remaining Amount</Text>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.cardForeground, textAlign: 'right' }}>{profile.currency} {budget.remaining_amount.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                    <Text style={styles.badge}>Transactions: {transactions.length}</Text>
                    <EditBudgetDialogButton budget_id={id} />
                </View>
                <View style={{ borderBottomColor: colors.border, borderBottomWidth: 1, marginVertical: 16 }} />
                <TransactionsList transactions={transactions} />
            </ScrollView>
        </SafeAreaView>

    );
};

export default BudgetDetails;