import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import TransactionItemSkeleton from "./TransactionItemSkeleton";
import TransactionItem from "./TransactionItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function TransactionsOverview() {
    const { transactions, loading } = useSelector((state: RootState) => state.transactions);

    return (
        <Card className="space-y-4">
            {loading && transactions && transactions.length === 0 ?
                (<>
                    <div className="w-36">
                        <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="mt-4 h-96 space-y-4 p-2 rounded-lg">
                        {[...Array(5)].map((_, index) => (
                            <TransactionItemSkeleton key={index} />
                        ))}
                    </div>
                </>
                ) :
                (<>
                    <CardHeader>
                        <CardTitle className="text-center text-xl font-semibold text-primary">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea>
                            <div className="mt-4 h-96 space-y-4 p-2 rounded-lg">
                                {transactions.length > 0 ?
                                    (transactions.slice(0, 5).map(transaction =>
                                        <TransactionItem key={transaction.transactionId} transaction={transaction} />
                                    )) :
                                    (<h2 className="text-center text-2xl font-semibold mb-4">No transactions to display.</h2>)
                                }
                                <Link to="/dashboard/transactions" className={buttonVariants({
                                    variant: "default"
                                })}>View More</Link>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </>)
            }
        </Card>
    )
}

export default TransactionsOverview
