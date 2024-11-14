import { Transaction } from '@/models/Transaction'
import React from 'react'
import MoveTransactionDialog from './MoveTransactionDialog'

interface TransactionItemProps {
    transaction: Transaction
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
    return (
        <div className="flex justify-between items-center rounded-lg shadow p-4 bg-card">
            <div>
                <p className="font-semibold">{transaction.merchantName}</p>
            </div>
            <p className="text-sm">{new Date(transaction.transactionDate.toString()).toLocaleString()}</p>
            <p className={`text-lg ${transaction.transactionType === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                {transaction.transactionType === 'INCOME' ? `+${transaction.amount.toFixed(2)}` : `-${Math.abs(transaction.amount).toFixed(2)}`}
            </p>
            <MoveTransactionDialog transaction={transaction} />
        </div>
    )
}

export default TransactionItem