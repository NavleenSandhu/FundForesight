import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { fetchBalance, fetchTransactions } from '@/store/transactions/transactionsSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetchBudgets } from '@/store/budgets/budgetsSlice'
import { fetchSavingGoals } from '@/store/savingGoals/savingGoalsSlice'
import { fetchProfile } from '@/store/profile/profileSlice'
import { fetchNotifications } from '@/store/notifications/notificationsSlice'
import BalanceCard from '@/features/transactions/components/BalanceCard'

const HomeScreen = () => {
    const dispatch = useDispatch<AppDispatch>()
    const GATEWAY_URL = process.env.EXPO_PUBLIC_GATEWAY_URL
    useEffect(() => {
        (async () => {
            const res = await fetch(`${GATEWAY_URL}/login`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: 'navleensandhu2007@gmail.com', password: 'II95J8pH@N' })
            })
            if (res.status === 200) {
                const cookies = res.headers.get('set-cookie')

                AsyncStorage.setItem('token', cookies?.split(';')[0] || '')
            }
        }
        )()
        dispatch(fetchBalance())
        dispatch(fetchSavingGoals())
        dispatch(fetchBudgets())
        dispatch(fetchProfile())
        dispatch(fetchNotifications())
        dispatch(fetchTransactions())
    }, [])
    return (
        <View style={{ marginTop: 50 }}>
            <BalanceCard />
        </View>
    )
}

export default HomeScreen