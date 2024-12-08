import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

const BudgetListItemSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-3 md:flex md:justify-between gap-8 items-center rounded-lg shadow p-4 mb-2">
            {/* Skeleton for category name and dates */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32 hidden md:block" />
                <Skeleton className="h-4 w-32 hidden md:block" />
            </div>

            {/* Skeleton for remaining and total amount */}
            <div className="space-y-2 text-center">
                <Skeleton className="h-6 w-16 mx-auto" />
                <Skeleton className="h-4 w-24 hidden md:block mx-auto" />
            </div>

            {/* Skeleton for button */}
            <div>
                <Skeleton className="h-8 w-20" />
            </div>
        </div>
    )
}

export default BudgetListItemSkeleton
