import React from 'react';
import { View, Text, StyleSheet, Button, useColorScheme, TouchableOpacity } from 'react-native';
import { SavingGoal } from '@/models/SavingGoal';
import { formatDate } from '@/utils/dateUtils';
import { Colors } from '@/constants/Colors';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import SavingGoalsDialogButton from './SavingGoalsDialogButton';

interface SavingGoalListItemProps {
    goal: SavingGoal,
    progress: number,
    handleDelete: (goalId: number) => void
}

const SavingGoalListItem: React.FC<SavingGoalListItemProps> = ({ goal, progress, handleDelete }) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const styles = StyleSheet.create({
        card: {
            borderWidth: 1,
            borderRadius: 10,
            borderColor: colors.border,
            padding: 10,
            marginBottom: 10,
            backgroundColor: colors.card,
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
            color: colors.cardForeground,
        },
        status: {
            fontSize: 12,
            color: colors.mutedForeground,
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
        cancelled: {
            color: 'red',
        },
        cardContent: {
            paddingHorizontal: 10,
        },
        goalInfo: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        dateContainer: {
            flexDirection: 'column',
        },
        dateText: {
            fontSize: 12,
            color: colors.cardForeground,
        },
        bold: {
            fontWeight: 'bold',
        },
        amountText: {
            marginTop: 10,
            fontSize: 14,
            textAlign: 'center',
            color: colors.cardForeground,
        },
        targetAmount: {
            color: colors.mutedForeground,
        },
        progressBar: {
            marginTop: 10,
            height: 10,
            borderRadius: 5,
        },
        progressText: {
            fontSize: 12,
            color: colors.mutedForeground,
            textAlign: 'center',
            marginTop: 5,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
        },
        button: {
            padding: 10,
            backgroundColor: colors.destructive,
            borderRadius: 10,
            marginLeft:10
        },
        buttonText: {
            color: colors.destructiveForeground,
            fontSize: 14,
            fontWeight: "600",
        },
    });

    const { profile } = useSelector((state: RootState) => state.profile);

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{goal.goalName}</Text>
                <Text style={styles.status}>
                    Status: <Text style={[styles.statusText, goal.status === 'ACTIVE' ? styles.active : goal.status === 'COMPLETED' ? styles.completed : styles.cancelled]}>
                        {goal.status.toLowerCase()}
                    </Text>
                </Text>
            </View>
            <View style={styles.cardContent}>
                <View style={styles.goalInfo}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}><Text style={styles.bold}>Start Date:</Text> {formatDate(goal.startDate)}</Text>
                        <Text style={styles.dateText}><Text style={styles.bold}>End Date:</Text> {formatDate(goal.endDate)}</Text>
                    </View>
                    <Text style={styles.amountText}><Text style={styles.bold}>{profile.currency} {goal.currentAmount.toFixed(2)}</Text>/<Text style={styles.targetAmount}>{goal.targetAmount}</Text></Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
                    <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: progress >= 100 ? 'green' : 'blue' }]} />
                </View>
                <Text style={styles.progressText}>{progress.toFixed(0)}% completed</Text>
            </View>
            <View style={styles.buttonContainer}>
                <SavingGoalsDialogButton formType='Edit' goalId={goal.goalId}/>
                <TouchableOpacity style={styles.button} onPress={() => handleDelete(goal.goalId)}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SavingGoalListItem;