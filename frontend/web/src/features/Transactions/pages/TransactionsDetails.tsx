import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store'
import TransactionList from '../components/TransactionList';
import { fetchBalance, fetchTransactions } from '@/store/transactions/transactionsSlice';
import { useEffect } from 'react';
import BalanceCard from '../components/BalanceCard';

const TransactionsDetails = () => {
	const { transactions } = useSelector((state: RootState) => state.transactions)
	const { balance } = useSelector((state: RootState) => state.transactions);
	const dispatch = useDispatch<AppDispatch>()
	useEffect(() => {
		if (balance === 0) {
			dispatch(fetchBalance())
		}
		// dispatch(fetchTransactions())
	}, [dispatch])

	return (
		<div className="p-6 h-screen">
			<BalanceCard balance={balance} transactions={transactions} />
			<TransactionList transactions={transactions} />
		</div>
	)
}

export default TransactionsDetails