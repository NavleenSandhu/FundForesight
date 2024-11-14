import BalanceCard from "@/features/Transactions/components/BalanceCard";
import { fetchBudgets } from "@/store/budgets/budgetsSlice";
import { RootState, AppDispatch } from "@/store/store";
import { fetchBalance, fetchTransactions } from "@/store/transactions/transactionsSlice";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

function Home() {
    const { transactions } = useSelector((state: RootState) => state.transactions)
    const { balance } = useSelector((state: RootState) => state.transactions);
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(fetchBudgets())
        if (balance === 0) {
            dispatch(fetchBalance())
        }
        // dispatch(fetchTransactions())
    }, [dispatch])
    return (
        <div className="p-6">
            <BalanceCard transactions={transactions} balance={balance} />
        </div>
    )
}

export default Home
