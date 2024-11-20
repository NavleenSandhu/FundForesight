import ConfirmationDialog from "@/components/ConfirmationDialog";
import { buttonVariants } from "@/components/ui/button";
import TransactionList from "@/features/Transactions/components/TransactionList";
import { deleteBudget } from "@/store/budgets/budgetsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { displayDate } from "@/utils/dateUtils";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BudgetDialog from "../components/BudgetDialog";
import { Budget } from "@/models/Budget";


function BudgetDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { transactions } = useSelector((state: RootState) => state.transactions)
    const dispatch = useDispatch<AppDispatch>();
    const budget_id: number = location.state.budget_id
    const budget: Budget = useSelector((state: RootState) => state.budgets.budgets.find(b => b.budget_id === budget_id))!

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
                <BudgetDialog formType="Edit" budget_id={budget.budget_id} />
                <ConfirmationDialog name="Delete budget" prompt={`Are you sure you want to delete "${budget.category_name}" budget?`} func={deleteBudgetById} />
            </div>
            <TransactionList transactions={transactionsByBudget} />
        </div>
    )
}

export default BudgetDetails
