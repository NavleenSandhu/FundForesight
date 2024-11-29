import AlertBox from '@/components/AlertBox';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import BalanceCard from '../components/BalanceCard';
import TransactionList from '../components/TransactionList';

const TransactionsPage = () => {
	const { transactions, error } = useSelector((state: RootState) => state.transactions);

	return (
		<div className="p-6 h-screen">
			<AlertBox message={error}/>
			<h1 className="text-center text-2xl font-bold mb-4">Transactions</h1>
			<div className='mb-8'>
			<BalanceCard />

			</div>
			<TransactionList transactions={transactions} />
		</div>
	)
}

export default TransactionsPage