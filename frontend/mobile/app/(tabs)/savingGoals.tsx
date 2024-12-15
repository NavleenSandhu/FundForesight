import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import SavingGoalsList from '@/features/savingGoals/components/SavingGoalsList'

const SavingGoalsScreen = () => {
    return (
        <View style={{ marginTop: 50 }}>
            <Text style={styles.title}>Savings</Text>
            <Text style={styles.description}>Manage goals here and save money.</Text>
            <SavingGoalsList />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        textAlign: 'center',
        color: Colors.light.mutedForeground,
    }
})

export default SavingGoalsScreen