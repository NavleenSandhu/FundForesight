import TransactionItem from './TransactionItem'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import TransactionItemSkeleton from './TransactionItemSkeleton';
import { Transaction } from '@/models/Transaction';
import React from 'react';

interface TransactionListProps {
    transactions: Transaction[]
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
    const { loading } = useSelector((state: RootState) => state.transactions);
    const transactionsSorted = [...transactions].sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
    return (
        <div className="mt-0">
            {loading && transactions && transactions.length === 0 ?
                (<div className="mt-4 h-96 space-y-4 p-2 rounded-lg">
                    {[...Array(5)].map((_, index) => (
                        <TransactionItemSkeleton key={index} />
                    ))}
                </div>) :
                (<ScrollArea>
                    <div className="mt-4 h-96 space-y-4 p-2 rounded-lg">
                        {transactions.length > 0 ?
                            (transactionsSorted.map(transaction =>
                                <TransactionItem key={transaction.transactionId} transaction={transaction} />
                            )) :
                            (<h2 className="text-center text-2xl font-semibold mb-4">No transactions to display.</h2>)
                        }
                    </div>
                </ScrollArea>)
            }
        </div>
    )
}

export default TransactionList