import { buttonVariants } from "@/components/ui/button";
import { Budget } from "@/models/Budget";
import { Link, useLocation, useNavigate } from "react-router-dom"
import BudgetDialog from "../components/BudgetDialog";
import { useState } from "react";
import { displayDate } from "@/utils/dateUtils";
import TransactionList from "@/features/Transactions/components/TransactionList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { deleteBudget } from "@/store/budgets/budgetsSlice";

function BudgetDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { transactions } = useSelector((state: RootState) => state.transactions)
    const [budget, setBudget] = useState<Budget>(location.state?.budget as Budget)
    const dispatch = useDispatch<AppDispatch>();
    const updateBudget = (updatedBudget: Budget) => {
        setBudget(updatedBudget)
    }
    if (!budget) {
        navigate('/dashboard/budgets');
        return null;
    }
    const transactionsByBudget = transactions.filter(transaction =>
        transaction.budgetId === budget.budget_id
    )
    const deleteBudgetById = () => {
        dispatch(deleteBudget(budget.budget_id))
        navigate('/dashboard/budgets');
    }
    return (
        <div className="container mx-auto p-6">
            <Link to='/dashboard/budgets' className={buttonVariants({
                variant: 'default'
            })}>Back to Budgets</Link>
            <h2>{budget.category_name}</h2>
            <p>
                Budget period: {displayDate(budget.start_date)} - {displayDate(budget.end_date)}
            </p>
            <p>Initial Amount: ${budget.initial_amount.toFixed(2)}</p>
            <p>Remaining Amount: ${budget.remaining_amount.toFixed(2)}</p>
            <div className="flex flex-col items-center space-y-4">
                <BudgetDialog formType="Edit" budget={budget} setBudget={updateBudget} />
                <ConfirmationDialog name="Delete budget" prompt={`Are you sure you want to delete "${budget.category_name}" budget?`} func={deleteBudgetById} />
            </div>
            <TransactionList transactions={transactionsByBudget} />
        </div>
    )
}

export default BudgetDetails
