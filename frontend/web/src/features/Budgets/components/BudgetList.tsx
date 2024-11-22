import { useSelector } from "react-redux"
import BudgetListItem from "./BudgetListItem"
import { RootState } from "@/store/store"

function BudgetList() {
    const { budgets } = useSelector((state: RootState) => state.budgets)

    return (
        <div className="space-y-4 p-4">
            {budgets.length > 0 ? (
                budgets.map((budget) => (
                    <BudgetListItem key={budget.budget_id} budget={budget} />
                ))
            ) : (
                <p className="text-center">No budgets available</p>
            )}
        </div>
    )
}
export default BudgetList
