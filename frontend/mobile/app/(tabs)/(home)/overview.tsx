import { ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchBalance, fetchTransactions } from '@/store/transactions/transactionsSlice'
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
    const { transactions, loading: transactionsLoading } = useSelector((state: RootState) => state.transactions)
    const { budgets, loading: budgetsLoading } = useSelector((state: RootState) => state.budgets)
    const { savingGoals, loading: savingsLoading } = useSelector((state: RootState) => state.savingGoals)
    const { loading: profileLoading } = useSelector((state: RootState) => state.profile)
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
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
                {(transactionsLoading && transactions.length === 0) ||
                    (budgetsLoading && budgets.length === 0) ||
                    (savingsLoading && savingGoals.length === 0) ||
                    profileLoading ?
                    (<ActivityIndicator />)
                    :
                    (<>
                        <BalanceCard />
                        <BudgetsOverview />
                        <SavingGoalsOverview />
                        <TransactionsOverview />
                    </>)
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default Overview