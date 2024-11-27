import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetsOverview from "@/features/Budgets/components/BudgetsOverview";
import SavingsOverview from "@/features/SavingGoals/components/SavingsOverview";
import BalanceCard from "@/features/Transactions/components/BalanceCard";
import TransactionsOverview from "@/features/Transactions/components/TransactionsOverview";
import { fetchBudgets } from "@/store/budgets/budgetsSlice";
import { fetchSavingGoals } from "@/store/savingGoals/savingGoalsSlice";
import { AppDispatch } from "@/store/store";
import { fetchBalance, fetchTransactions } from "@/store/transactions/transactionsSlice";
import { TabsContent } from "@radix-ui/react-tabs";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function Home() {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(fetchBudgets())
        dispatch(fetchBalance())
        dispatch(fetchTransactions())
        dispatch(fetchSavingGoals())
    }, [dispatch])
    return (
        <Tabs defaultValue="overview">
            <TabsList className="my-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
                <div className="p-6 space-y-6">
                    <BalanceCard />
                    <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
                        <BudgetsOverview />
                        <SavingsOverview />
                    </div>
                    <TransactionsOverview />
                </div>
            </TabsContent>
            <TabsContent value="notifications">
            </TabsContent>
        </Tabs>
    )
}

export default Home
