import { AppDispatch, RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import BudgetListItem from "./BudgetListItem"
import { useEffect } from "react"
import { fetchBudgets } from "@/store/budgets/budgetsSlice"

function BudgetList() {
    const { budgets } = useSelector((state: RootState) => state.budgets)
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(fetchBudgets())
    }, [dispatch])

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
