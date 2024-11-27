import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TransactionList from "@/features/Transactions/components/TransactionList";
import { Budget } from "@/models/Budget";
import { deleteBudget } from "@/store/budgets/budgetsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { displayDate } from "@/utils/dateUtils";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BudgetDialog from "../components/BudgetDialog";



function BudgetDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { transactions } = useSelector((state: RootState) => state.transactions)
    const dispatch = useDispatch<AppDispatch>();
    const { budget_id, referer } = location.state
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

        <div className="container mx-auto p-6 space-y-6">

            <div className="flex items-center justify-between">
                <Link
                    to={referer}
                    className={buttonVariants({
                        variant: "default"
                    })}>
                    <ArrowLeft />
                </Link>

                <ConfirmationDialog
                    name="Delete Budget"
                    prompt={`Are you sure you want to delete "${budget.category_name}" budget?`}
                    func={deleteBudgetById}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{budget.category_name}</CardTitle>
                    <CardDescription>
                        Budget period: {displayDate(budget.start_date)} to {displayDate(budget.end_date)}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 justify-between md:justify-start">
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Initial Amount</span>
                            <span className="text-lg font-semibold">${budget.initial_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Remaining Amount</span>
                            <span className="text-lg font-semibold">
                                ${budget.remaining_amount.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                    Transactions: {transactionsByBudget.length}
                </Badge>
                <BudgetDialog formType="Edit" budget_id={budget.budget_id} />
            </div>

            <Separator />
            <TransactionList transactions={transactionsByBudget} />
        </div>
    );
}

export default BudgetDetails
