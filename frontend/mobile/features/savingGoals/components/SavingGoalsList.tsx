import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { deleteSavingGoal } from '@/store/savingGoals/savingGoalsSlice';
import SavingGoalListItem from './SavingGoalListItem';

export default function SavingGoalsList() {
    const dispatch = useDispatch<AppDispatch>();
    const { savingGoals } = useSelector((state: RootState) => state.savingGoals);

    const handleDelete = (goalId: number) => {
        dispatch(deleteSavingGoal(goalId));
    };

    return (
        <View style={styles.container}>
            {savingGoals.length === 0 ? (
                <Text style={styles.noGoalsText}>No Saving Goals to Display.</Text>
            ) : (
                savingGoals.map((goal) => (
                    <SavingGoalListItem
                        key={goal.goalId}
                        goal={goal}
                        progress={(goal.currentAmount / goal.targetAmount) * 100}
                        handleDelete={handleDelete}
                    />
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    noGoalsText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
    },
});
