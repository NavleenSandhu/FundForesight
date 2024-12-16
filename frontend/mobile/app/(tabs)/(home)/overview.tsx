import { ScrollView } from 'react-native'
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
import BudgetsOverview from '@/features/budgets/components/BudgetsOverview'
import SavingGoalsOverview from '@/features/savingGoals/components/SavingGoalsOverview'
import TransactionsOverview from '@/features/transactions/components/TransactionsOverview'
import { SafeAreaView } from 'react-native-safe-area-context'
import Switch from '@/components/Switch'

const Overview = () => {


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
        <SafeAreaView>
            <ScrollView style={{ marginBottom: 60 }}>
                <Switch active='overview' />
                <BalanceCard />
                <BudgetsOverview />
                <SavingGoalsOverview />
                <TransactionsOverview />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Overview