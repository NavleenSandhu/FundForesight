import { Skeleton } from '@/components/ui/skeleton'

function TransactionItemSkeleton() {
    return (
        <div className="flex justify-between items-center rounded-lg shadow p-4">
            {/* Merchant Name Skeleton */}
            <div className="w-48">
                <Skeleton className="h-4 w-full" />
            </div>

            {/* Transaction Date Skeleton */}
            <div className="w-32">
                <Skeleton className="h-4 w-full" />
            </div>

            {/* Transaction Amount Skeleton */}
            <div className="w-24">
                <Skeleton className="h-5 w-full" />
            </div>
        </div>
    )
}

export default TransactionItemSkeleton