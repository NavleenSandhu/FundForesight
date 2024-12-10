import AlertBox from "@/components/AlertBox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BudgetsOverview from "@/features/Budgets/components/BudgetsOverview";
import NotificationsPage from "@/features/Notifications/pages/NotificationsPage";
import SavingsOverview from "@/features/SavingGoals/components/SavingsOverview";
import BalanceCard from "@/features/Transactions/components/BalanceCard";
import TransactionsOverview from "@/features/Transactions/components/TransactionsOverview";
import { fetchBudgets, removeBudgetError } from "@/store/budgets/budgetsSlice";
import { fetchNotifications } from "@/store/notifications/notificationSlice";
import { fetchProfile, removeProfileError } from "@/store/profiles/profilesSlice";
import { fetchSavingGoals, removeSavingError } from "@/store/savingGoals/savingGoalsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { fetchBalance, fetchTransactions, removeTransactionError } from "@/store/transactions/transactionsSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Home() {
    const dispatch = useDispatch<AppDispatch>()
    const budgetsError = useSelector((state: RootState) => state.budgets.error)
    const transactionsError = useSelector((state: RootState) => state.transactions.error)
    const savingGoalsError = useSelector((state: RootState) => state.savingGoals.error)
    const profileError = useSelector((state: RootState) => state.profile.error)

    const errors = [
        { key: "Budgets", value: budgetsError },
        { key: "Transactions", value: transactionsError },
        { key: "Saving Goals", value: savingGoalsError },
        { key: "Profile", value: profileError },
    ];

    useEffect(() => {
        dispatch(fetchBudgets())
        dispatch(fetchBalance())
        dispatch(fetchTransactions())
        dispatch(fetchSavingGoals())
        dispatch(fetchProfile())
        dispatch(fetchNotifications())
    }, [dispatch])

    useEffect(() => {
        if (budgetsError) {
            const timeout = setTimeout(() => dispatch(removeBudgetError()), 5000);
            return () => clearTimeout(timeout);
        }
    }, [budgetsError, dispatch]);

    useEffect(() => {
        if (transactionsError) {
            const timeout = setTimeout(() => dispatch(removeTransactionError()), 5000);
            return () => clearTimeout(timeout);
        }
    }, [transactionsError, dispatch]);

    useEffect(() => {
        if (savingGoalsError) {
            const timeout = setTimeout(() => dispatch(removeSavingError()), 5000);
            return () => clearTimeout(timeout);
        }
    }, [savingGoalsError, dispatch]);

    useEffect(() => {
        if (profileError) {
            const timeout = setTimeout(() => dispatch(removeProfileError()), 5000);
            return () => clearTimeout(timeout);
        }
    }, [profileError, dispatch]);

    return (
        <>
            <Tabs defaultValue="overview">
                <TabsList className="my-4 mt-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                {errors.some((error) => error.value !== "") && (
                    <div className="space-y-2">
                        {errors
                            .filter((error) => error.value !== "")
                            .map((error) => (
                                <AlertBox key={error.key} title={error.key} message={error.value} />
                            ))}
                    </div>
                )}
                <TabsContent value="overview">
                    <div className="px-6 space-y-6">
                        <BalanceCard />
                        <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
                            <BudgetsOverview />
                            <SavingsOverview />
                        </div>
                        <TransactionsOverview />
                    </div>
                </TabsContent>
                <TabsContent value="notifications">
                    <NotificationsPage />
                </TabsContent>
            </Tabs>
        </>
    )
}

export default Home
