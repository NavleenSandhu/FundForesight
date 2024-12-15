import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import BudgetList from '@/features/budgets/components/BudgetList'
const BudgetsScreen = () => {
    return (
        <View style={{ marginTop: 50 }}>
            <Text style={styles.title}>Budgets</Text>
            <Text style={styles.description}>Manage and track your budgets here.</Text>
            <BudgetList />
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

export default BudgetsScreen