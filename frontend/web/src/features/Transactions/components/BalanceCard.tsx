import { Skeleton } from '@/components/ui/skeleton';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';


const BalanceCard = () => {
    const { transactions, balance, error, loading } = useSelector((state: RootState) => state.transactions);
    if (loading && transactions && transactions.length === 0) {
        return (
            <div className="p-6 h-screen">
                <div className="rounded-lg shadow-lg p-6 text-center bg-card">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-36">
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="w-24">
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <div className="w-24">
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="w-24">
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    const income = transactions?.reduce<number>((totalIncome, transaction) => {
        if (transaction.transactionType === 'INCOME') {
            totalIncome += transaction.amount;
        }
        return totalIncome;
    }, 0);
    const expense = transactions?.reduce<number>((totalExpense, transaction) => {
        if (transaction.transactionType === 'EXPENSE') {
            totalExpense += transaction.amount;
        }
        return totalExpense;
    }, 0);


    return (
        <div>
            <div className="rounded-lg shadow-lg p-6 text-center bg-card">
                {
                    balance ?
                        <>
                            <p className="text-xl font-semibold text-primary">Total Balance</p>
                            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                ${balance}
                            </p>
                        </> : ''
                }
                <div className="flex justify-between mt-4">
                    <div>
                        <p className="text-primary">Income</p>
                        <p className="text-emerald-400">${income.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-primary">Expense</p>
                        <p className="text-red-400">${expense.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BalanceCard
