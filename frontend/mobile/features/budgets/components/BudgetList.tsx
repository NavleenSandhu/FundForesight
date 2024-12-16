import React from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import BudgetListItem from './BudgetListItem';
import { RootState } from '@/store/store';
// import BudgetListItemSkeleton from './BudgetListItemSkeleton';

function BudgetList() {
    const { budgets, loading } = useSelector((state: RootState) => state.budgets);

    return (
        <View style={styles.container}>
            {loading && budgets.length === 0 ? (
                // Case 1: Loading and no current budgets -> Show skeletons
                <View style={styles.skeletonContainer}>
                    {/* {[...Array(5)].map((_, index) => (
                        <BudgetListItemSkeleton key={index} />
                    ))} */}
                </View>
            ) : !loading && budgets.length === 0 ? (
                // Case 2: Success and budgets length is 0 -> Show no budgets available
                <Text style={styles.noBudgetsText}>No budgets available</Text>
            ) : (
                // Case 3: Show budgets
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