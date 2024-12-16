import { View, Text, StyleSheet, useColorScheme, ScrollView } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import BudgetList from '@/features/budgets/components/BudgetList'
import CreateBudgetDialogButton from '@/features/budgets/components/CreateBudgetDialogButton'
import { SafeAreaView } from 'react-native-safe-area-context'
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
        <SafeAreaView>
            <ScrollView style={{ marginBottom: 60}}>
                <Text style={styles.title}>Budgets</Text>
                <Text style={styles.description}>Manage and track your budgets here.</Text>
                <View style={{ flexDirection: 'row-reverse', marginRight: 20, marginTop: 8 }}>
                    <CreateBudgetDialogButton />
                </View>
                <BudgetList />
            </ScrollView>
        </SafeAreaView>
    )
}

export default BudgetsScreen