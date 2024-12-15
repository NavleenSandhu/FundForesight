import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Budget } from '@/models/Budget';
import { displayDate } from '@/utils/dateUtils';
import { Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface BudgetListItemProps {
    budget: Budget;
}

const BudgetListItem: React.FC<BudgetListItemProps> = ({ budget }) => {
    const { profile } = useSelector((state: RootState) => state.profile);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.categoryName}>{budget.category_name}</Text>
                <Text style={styles.date}>Start Date: {displayDate(budget.start_date)}</Text>
                <Text style={styles.date}>End Date: {displayDate(budget.end_date)}</Text>
            </View>
            <View style={styles.amounts}>
                <Text style={styles.remainingAmount}>
                    {profile.currency} {budget.remaining_amount.toFixed(2)}
                    <Text style={styles.initialAmount}> of {budget.initial_amount.toFixed(2)}</Text>
                </Text>
                <Text
                    style={[
                        styles.remainingPercentage,
                        budget.remaining_amount < budget.initial_amount * 0.2 ? styles.lowRemaining : styles.highRemaining,
                    ]}
                >
                    Remaining: {((budget.remaining_amount / budget.initial_amount) * 100).toFixed(0)}%
                </Text>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL(`/view-budget/${budget.budget_id}`)} style={styles.button}>
                <MaterialIcons name='arrow-right-alt' style={styles.buttonText} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginBottom: 20,
        backgroundColor: Colors.light.background,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    amounts: {
        flex: 1,
        alignItems: 'center',
    },
    remainingAmount: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    initialAmount: {
        fontSize: 12,
        color: '#666',
    },
    remainingPercentage: {
        fontSize: 12,
    },
    lowRemaining: {
        color: 'red',
    },
    highRemaining: {
        color: 'green',
    },
    button: {
        padding: 8,
        backgroundColor: Colors.light.primary,
        borderRadius: 4,
    },
    buttonText: {
        color: Colors.light.primaryForeground,
        fontSize: 14,
    },
});

export default BudgetListItem;