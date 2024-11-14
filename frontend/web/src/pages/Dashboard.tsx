import BottomNavigation from "@/components/BottomNavigation";
import TopNavigation from "@/components/TopNavigation";
import BudgetDetails from "@/features/Budgets/pages/BudgetDetails";
import BudgetsPage from "@/features/Budgets/pages/BudgetsPage";
import TransactionsDetails from "@/features/Transactions/pages/TransactionsDetails";
import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import Home from "./Home";

function Dashboard() {
    return (
        <>
            <TopNavigation />
            <Routes>
                <Route path="/transactions" Component={TransactionsDetails} />
                <Route path="/budgets" Component={BudgetsPage} />
                <Route path="/budgets/viewBudget" Component={BudgetDetails} />
                <Route path="/home" Component={Home} />
                <Route path="/*" Component={NotFound} />
            </Routes>
            <BottomNavigation />
        </ >
    )
}

export default Dashboard;