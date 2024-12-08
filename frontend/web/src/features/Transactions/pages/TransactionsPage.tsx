import AlertBox from '@/components/AlertBox';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import BalanceCard from '../components/BalanceCard';
import TransactionList from '../components/TransactionList';
import { removeTransactionError } from '@/store/transactions/transactionsSlice';
import { useEffect } from 'react';

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
		<div className="p-6 h-screen">
			<AlertBox title="Transactions" message={error} />
			<h1 className="text-center text-2xl font-bold mb-4">Transactions</h1>
			<div className='mb-8'>
				<BalanceCard />
			</div>
			<TransactionList transactions={transactions} />
		</div>
	)
}

export default TransactionsPage