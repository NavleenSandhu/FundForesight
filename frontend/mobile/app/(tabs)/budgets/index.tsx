import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import BudgetList from '@/features/budgets/components/BudgetList'
import CreateBudgetDialogButton from '@/features/budgets/components/CreateBudgetDialogButton'
const BudgetsScreen = () => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const styles = StyleSheet.create({
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 10,
            color: colors.foreground,
        },
        description: {
            textAlign: 'center',
            color: Colors.light.mutedForeground,
        }
    })
    return (
        <View style={{ marginTop: 50 }}>
            <Text style={styles.title}>Budgets</Text>
            <Text style={styles.description}>Manage and track your budgets here.</Text>
            <View style={{ flexDirection: 'row-reverse', marginRight: 20, marginTop:8 }}>
                <CreateBudgetDialogButton />
            </View>
            <BudgetList />
        </View>
    )
}

export default BudgetsScreen