import BottomNavigation from "@/components/BottomNavigation";
import TopNavigation from "@/components/TopNavigation";
import BudgetDetails from "@/features/Budgets/pages/BudgetDetails";
import BudgetsPage from "@/features/Budgets/pages/BudgetsPage";
import SavingGoalsPage from "@/features/SavingGoals/pages/SavingGoalsPage";
import TransactionsPage from "@/features/Transactions/pages/TransactionsPage";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import NotFound from "./NotFound";

function Dashboard() {
    return (
        <>
            <TopNavigation />
            <main className="pb-12 md:pb-0 md:pt-12">
                <Routes>
                    <Route path="/home" Component={Home} />
                    <Route path="/transactions" Component={TransactionsPage} />
                    <Route path="/budgets" Component={BudgetsPage} />
                    <Route path="/budgets/viewBudget" Component={BudgetDetails} />
                    <Route path="/savingGoals" Component={SavingGoalsPage} />
                    <Route path="/*" Component={NotFound} />
                </Routes>
            </main>
            <BottomNavigation />
        </ >
    )
}

export default Dashboard;