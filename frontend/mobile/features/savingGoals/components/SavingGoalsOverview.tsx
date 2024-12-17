import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';

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
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
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
            color: colors.cardForeground,
        },
        amounts: {
            color: colors.mutedForeground
        },
        progressBar: {
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
                {savingGoals.length === 0 ?
                    <ThemedText>No goals yet.</ThemedText>
                    :
                    savingGoals.slice(0, 2).map((goal) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        return (
                            <View style={styles.card} key={goal.goalId}>
                                <View style={styles.row}>
                                    <Text style={styles.goalName}>{goal.goalName}</Text>
                                    <Text style={styles.amounts}>{profile.currency} {goal.currentAmount} of {goal.targetAmount}</Text>
                                </View>
                                <View style={[styles.progressBar, { backgroundColor: colors.muted, marginTop: 10 }]}>
                                    <View style={[styles.progressBar, { width: `${progress >= 1 ? progress : 0}%`, backgroundColor: progress >= 100 ? 'green' : colors.primary }]} />
                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
    );
};

export default SavingGoalsOverview;