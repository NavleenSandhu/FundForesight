import { Transaction } from '@/models/Transaction'
import React from 'react'
import MoveTransactionDialog from './MoveTransactionDialog'

interface TransactionItemProps {
    transaction: Transaction
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
    return (
        <div className='rounded-lg shadow p-4 bg-card'>
            <div className="grid grid-cols-3 gap-2 items-center">
                <div className='flex flex-col text-left'>
                    <p className="font-semibold">{transaction.merchantName}</p>
                </div>
                <p className={`text-right sm:text-center text-lg ${transaction.transactionType === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {transaction.transactionType === 'INCOME' ? `+${transaction.amount.toFixed(2)}` : `-${Math.abs(transaction.amount).toFixed(2)}`}
                </p>
                <div className='ml-auto relative'>
                    <MoveTransactionDialog transaction={transaction} />
                </div>
            </div>
            <p className="text-sm text-left">{new Date(transaction.transactionDate.toString()).toLocaleString()}</p>
        </div>
    )
}

export default TransactionItem