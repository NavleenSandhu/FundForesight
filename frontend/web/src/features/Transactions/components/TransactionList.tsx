import TransactionItem from './TransactionItem'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Transaction } from '@/models/Transaction'

interface TransactionListProps {
    transactions: Transaction[]
}


const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {

    return (
        <div className="mt-6">
            <ScrollArea>
                <div className="mt-4 h-96 space-y-4 p-2 rounded-lg">

                    {transactions.length > 0 ?
                        (transactions.map(transaction =>
                            <TransactionItem key={transaction.transactionId} transaction={transaction} />
                        )) :
                        (<h2 className="text-center text-2xl font-semibold mb-4">No transactions to display.</h2>)
                    }
                </div>
            </ScrollArea>
        </div>
    )
}

export default TransactionList