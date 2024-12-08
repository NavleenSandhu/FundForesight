import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { RootState } from "@/store/store"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSelector } from "react-redux"
import { Skeleton } from "@/components/ui/skeleton"

function SavingsOverview() {
    const { savingGoals, loading } = useSelector((state: RootState) => state.savingGoals)

    return (
        <Card className="space-y-4">
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold text-primary">Savings Goals</CardTitle>
            </CardHeader>
            <CardContent>
                {loading && savingGoals.length === 0 ? (
                    // Case 1: Loading and no current saving goals -> Show skeletons
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : !loading && savingGoals.length === 0 ? (
                    // Case 2: Success and savingGoals length is 0 -> Show no saving goals
                    <div className="text-center text-muted-foreground">
                        No savings goals created. Add your first savings goal to get started!
                    </div>
                ) : (
                    // Case 3: Show saving goals
                    <ScrollArea className="h-48 md:h-36">
                        <div className="flex flex-col gap-4">
                            {savingGoals.map((goal) => (
                                <div
                                    key={goal.goalId}
                                    className="p-4 border rounded-lg shadow-sm"
                                >
                                    <div className="flex justify-between mx-2">
                                        <h3 className="text-lg font-medium">{goal.goalName}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            ${goal.currentAmount} of ${goal.targetAmount}
                                        </p>
                                    </div>
                                    <Progress
                                        value={(goal.currentAmount / goal.targetAmount) * 100}
                                        className="mt-2"
                                    />
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    )
}

export default SavingsOverview
