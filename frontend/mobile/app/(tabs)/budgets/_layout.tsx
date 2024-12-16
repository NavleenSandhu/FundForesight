import React from 'react'
import { Stack } from 'expo-router'

const BudgetLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="[budget_id]" options={{ headerShown: false }} />
        </Stack>
    )
}

export default BudgetLayout