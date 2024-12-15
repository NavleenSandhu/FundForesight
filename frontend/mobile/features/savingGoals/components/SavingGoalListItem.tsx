import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { SavingGoal } from '@/models/SavingGoal';
import { formatDate } from '@/utils/dateUtils';

interface SavingGoalListItemProps {
    goal: SavingGoal,
    progress: number,
    handleDelete: (goalId: number) => void
}

const SavingGoalListItem: React.FC<SavingGoalListItemProps> = ({ goal, progress, handleDelete }) => {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{goal.goalName}</Text>
                <Text style={styles.status}>
                    Status: <Text style={[styles.statusText, goal.status === 'ACTIVE' ? styles.active : goal.status === 'COMPLETED' ? styles.completed : styles.inactive]}>
                        {goal.status.toLowerCase()}
                    </Text>
                </Text>
            </View>
            <View style={styles.cardContent}>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}><Text style={styles.bold}>Start Date:</Text> {formatDate(goal.startDate)}</Text>
                    <Text style={styles.dateText}><Text style={styles.bold}>End Date:</Text> {formatDate(goal.endDate)}</Text>
                </View>
                <Text style={styles.amountText}><Text style={styles.bold}>{goal.currentAmount.toFixed(2)}</Text>/<Text style={styles.mutedText}>{goal.targetAmount}</Text></Text>
                <Text style={styles.progressText}>{progress.toFixed(0)}% completed</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    status: {
        fontSize: 12,
        color: '#6c757d',
    },
    statusText: {
        textTransform: 'capitalize',
        fontWeight: '500',
    },
    active: {
        color: 'green',
    },
    completed: {
        color: 'blue',
    },
    inactive: {
        color: 'red',
    },
    cardContent: {
        paddingHorizontal: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateText: {
        fontSize: 12,
    },
    bold: {
        fontWeight: 'bold',
    },
    amountText: {
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    },
    mutedText: {
        color: '#6c757d',
    },
    progressBar: {
        marginTop: 10,
        height: 10,
        borderRadius: 5,
    },
    progressText: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
});

export default SavingGoalListItem;