import AlertBox from '@/components/AlertBox';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import BalanceCard from '../components/BalanceCard';
import TransactionList from '../components/TransactionList';
import { removeTransactionError } from '@/store/transactions/transactionsSlice';
import { useEffect } from 'react';
import AddTransactionDialog from '../components/AddTransactionDialog';
import { Separator } from '@/components/ui/separator';

const TransactionsPage = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { transactions, error } = useSelector((state: RootState) => state.transactions);
	useEffect(() => {
		if (error) {
			const timeout = setTimeout(() => dispatch(removeTransactionError()), 5000);
			return () => clearTimeout(timeout);
		}
	}, [error, dispatch]);
	return (
		<div className="p-6 h-screen space-y-6">
			{error && <AlertBox title="Transactions" message={error} />}
			<h1 className="text-center text-2xl font-bold">Transactions</h1>
			<div>
				<BalanceCard />
			</div>
			<div className='flex flex-row-reverse'>
				<AddTransactionDialog />
			</div>
			<Separator />
			<TransactionList transactions={transactions} />
		</div>
	)
}

export default TransactionsPage