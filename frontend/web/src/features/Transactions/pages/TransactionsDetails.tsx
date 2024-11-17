import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import TransactionList from '../components/TransactionList';
import BalanceCard from '../components/BalanceCard';

const TransactionsDetails = () => {
	const { transactions } = useSelector((state: RootState) => state.transactions)
	const { balance } = useSelector((state: RootState) => state.transactions);



	return (
		<div className="p-6 h-screen">
			<BalanceCard balance={balance} transactions={transactions} />
			<TransactionList transactions={transactions} />
		</div>
	)
}

export default TransactionsDetails