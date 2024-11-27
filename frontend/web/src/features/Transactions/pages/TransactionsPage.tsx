import TransactionList from '../components/TransactionList';
import BalanceCard from '../components/BalanceCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import AlertBox from '@/components/AlertBox';

const TransactionsPage = () => {
	const { transactions, error } = useSelector((state: RootState) => state.transactions);

	return (
		<div className="p-6 h-screen">
			<AlertBox message={error}/>
			<h1 className="text-center text-2xl font-bold mb-4">Transactions</h1>
			<BalanceCard />
			<TransactionList transactions={transactions} />
		</div>
	)
}

export default TransactionsPage