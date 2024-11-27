import TransactionList from '../components/TransactionList';
import BalanceCard from '../components/BalanceCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const TransactionsPage = () => {
	const { transactions } = useSelector((state: RootState) => state.transactions);

	return (
		<div className="p-6 h-screen">
			<h1 className="text-center text-2xl font-bold mb-4">Transactions</h1>
			<BalanceCard />
			<TransactionList transactions={transactions} />
		</div>
	)
}

export default TransactionsPage