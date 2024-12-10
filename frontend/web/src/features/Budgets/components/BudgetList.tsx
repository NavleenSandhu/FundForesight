import { useSelector } from "react-redux"
import BudgetListItem from "./BudgetListItem"
import { RootState } from "@/store/store"
import BudgetListItemSkeleton from "./BudgetListItemSkeleton"

function BudgetList() {
    const { budgets, loading } = useSelector((state: RootState) => state.budgets)

    return (
        <div className="space-y-4 p-4">
            {loading && budgets.length === 0 ? (
                // Case 1: Loading and no current budgets -> Show skeletons
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) =>
                        <BudgetListItemSkeleton key={index} />
                    )}
                </div>
            ) : !loading && budgets.length === 0 ? (
                // Case 2: Success and budgets length is 0 -> Show no budgets available
                <p className="text-center text-muted-foreground">No budgets available</p>
            ) : (
                // Case 3: Show budgets
                <>
                    {budgets.map((budget) => (
                        <BudgetListItem key={budget.budget_id} budget={budget} />
                    ))}
                </>
            )}
        </div>
    )
}
export default BudgetList
