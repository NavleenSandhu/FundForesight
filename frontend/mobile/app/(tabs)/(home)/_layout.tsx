import React from 'react'
import { Stack } from 'expo-router'

const HomeLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="overview" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
        </Stack>
    )
}

export default HomeLayout