import React from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import BudgetListItem from './BudgetListItem';
import { RootState } from '@/store/store';
// import BudgetListItemSkeleton from './BudgetListItemSkeleton';

function BudgetList() {
    const { budgets } = useSelector((state: RootState) => state.budgets);

    return (
        <View style={styles.container}>
            {budgets.length === 0 ? (
                <Text style={styles.noBudgetsText}>No budgets available</Text>
            ) : (
                budgets.map((budget) => (
                    <BudgetListItem key={budget.budget_id} budget={budget} />
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    skeletonContainer: {
        marginBottom: 16,
    },
    noBudgetsText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default BudgetList;