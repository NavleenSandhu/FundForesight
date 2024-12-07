import { Skeleton } from '@/components/ui/skeleton';
import { RootState } from '@/store/store';
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
import { useSelector } from 'react-redux';

const BalanceCard = () => {
    const cardStyle = {
    background: 'linear-gradient(45deg, rgba(109, 128, 254, 1) 0%, rgba(35, 210, 253, 1) 100%)',


  };

    const { transactions, balance, error, loading } = useSelector((state: RootState) => state.transactions);
    if (loading && transactions && transactions.length === 0) {
        return (
            <div className="p-6 h-screen z-30">
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
            <div className="rounded-lg shadow-lg shadow-slate-500 p-6 text-center" style={cardStyle}>
                {
                    balance ?
                        <>
                            <p className="text-xl font-semibold text-secondary">Total Balance</p>
                            <p className={`text-3xl font-bold text-white`}>
                                ${balance}
                            </p>
                        </> : ''
                }
                <div className="flex justify-between mt-4">
                    <div className=' bg-secondary py-1 px-5 shadow-sm shadow-slate-700 rounded-sm'>
                        <div className='flex justify-center items-end gap-1'>
                            <p className="text-primary inline">Income</p>
                            <IoIosTrendingUp />
                        </div>
                        
                        <p className="text-emerald-400 font-bold text-lg">${income.toFixed(2)}</p>
                    </div>
                    <div className=' bg-secondary py-1 px-5 shadow-sm shadow-slate-700 rounded-sm'>
                       <div className='flex items-center gap-1 m-0 p-0'>
                            <p className="text-primary inline">Expense</p>
                            <IoIosTrendingDown />
                        </div>
                        <p className="text-red-400 font-bold text-lg">${expense.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BalanceCard
