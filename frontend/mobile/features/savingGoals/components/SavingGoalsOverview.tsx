import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Colors } from '@/constants/Colors';

const SavingGoalsOverview: React.FC = () => {
    const { savingGoals } = useSelector((state: RootState) => state.savingGoals);
    const { profile } = useSelector((state: RootState) => state.profile);
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const styles = StyleSheet.create({
        container: {
            padding: 10,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            margin: 15,
        },
        header: {
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: 20,
        },
        noGoalsText: {
            textAlign: 'center',
            color: colors.mutedForeground,
        },
        card: {
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            margin: 5,
            padding: 15,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        goalName: {
            fontSize: 18,
            fontWeight: '600',
        },
        amounts: {
            color: colors.mutedForeground
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
    });

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Savings Goals</Text>
            <ScrollView>
                {savingGoals.slice(0, 2).map((goal) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    return (
                        <View style={styles.card} key={goal.goalId}>
                            <View style={styles.row}>
                                <Text style={styles.goalName}>{goal.goalName}</Text>
                                <Text style={styles.amounts}>{profile.currency} {goal.currentAmount} of {goal.targetAmount}</Text>
                            </View>
                            <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
                                <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: progress >= 100 ? 'green' : 'blue' }]} />
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    );
};

export default SavingGoalsOverview;