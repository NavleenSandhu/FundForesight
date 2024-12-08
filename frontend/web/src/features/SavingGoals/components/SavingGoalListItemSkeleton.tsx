import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import React from "react"

const SavingGoalListItemSkeleton: React.FC = () => {
    return (
        <Card className="border rounded-lg shadow-md p-2">
            {/* Header Skeleton */}
            <CardHeader className="text-center mb-2">
                <CardTitle>
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                </CardTitle>
                <p className="text-sm">
                    Status: <Skeleton className="h-4 w-1/3 inline-block ml-2" />
                </p>
            </CardHeader>

            <CardContent>
                {/* Details Skeleton */}
                <div className="grid grid-cols-3">
                    <div className="text-sm text-left col-span-2 space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-1/2 mt-4" />
                    </div>
                </div>

                {/* Progress Skeleton */}
                <div className="mt-4">
                    <Progress value={0} className="bg-muted-foreground" />
                    <p className="text-xs text-muted-foreground mt-1">
                        <Skeleton className="h-3 w-1/4" />
                    </p>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex justify-center gap-4 mt-6">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </CardContent>
        </Card>
    )
}

export default SavingGoalListItemSkeleton
