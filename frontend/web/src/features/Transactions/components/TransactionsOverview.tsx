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
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold text-primary">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                {loading && transactions.length === 0 ?
                    // Case 1: Loading and transactions length is 0 -> Show Skeleton
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
                    ) : !loading && transactions.length === 0 ? (
                        // Case 2: Success and transactions length is 0 -> Show no transactions
                        <div className="text-center text-muted-foreground">
                            <p>No transactions. <Link to="/dashboard/transactions" className="text-base font-semibold text-primary hover:underline">Add</Link> a transaction or link with <Link to="/auth/plaidAccount" className="text-base font-semibold text-primary hover:underline">plaid</Link> to get started!</p>
                        </div>
                ) :
                        (<>
                            <ScrollArea>
                                <div className="mt-4 h-96 space-y-4 p-2 rounded-lg">
                                    {(transactions.slice(0, 5).map(transaction =>
                                        (<TransactionItem key={transaction.transactionId} transaction={transaction} />)
                                    ))}
                                    <Link to="/dashboard/transactions" className={buttonVariants({
                                        variant: "default"
                                    })}>View More</Link>
                                </div>
                            </ScrollArea>
                        </>)}
            </CardContent>
        </Card>
    )
}

export default TransactionsOverview
