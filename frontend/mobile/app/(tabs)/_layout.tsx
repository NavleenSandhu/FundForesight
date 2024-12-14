import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './home';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            initialRouteName="home"
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }: { color: string }) => <IconSymbol name="house.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: 'Transactions',
                    tabBarIcon: ({ color }: { color: string }) => <IconSymbol name="list.bullet" color={color} />,
                }}
            />
            <Tabs.Screen
                name="budgets"
                options={{
                    title: 'Budgets',
                    tabBarIcon: ({ color }: { color: string }) => <IconSymbol name="chart.pie.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="savingGoals"
                options={{
                    title: 'Saving Goals',
                    tabBarIcon: ({ color }: { color: string }) => <IconSymbol name="target" color={color} />,
                }}
            />
        </Tabs>
    );
}