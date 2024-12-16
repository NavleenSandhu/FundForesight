import { View, Text, StyleSheet, useColorScheme, ScrollView } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import SavingGoalsList from '@/features/savingGoals/components/SavingGoalsList'
import SavingGoalsDialogButton from '@/features/savingGoals/components/SavingGoalsDialogButton'
import { SafeAreaView } from 'react-native-safe-area-context'

const SavingGoalsScreen = () => {
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
                <Text style={styles.title}>Savings</Text>
                <Text style={styles.description}>Manage goals here and save money.</Text>
                <View style={{ flexDirection: 'row-reverse', marginRight: 20, marginTop: 8 }}>
                    <SavingGoalsDialogButton formType='Create' />
                </View>
                <SavingGoalsList />
            </ScrollView>
        </SafeAreaView>
    )
}


export default SavingGoalsScreen