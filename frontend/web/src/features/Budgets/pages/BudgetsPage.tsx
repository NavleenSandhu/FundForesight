import AlertBox from '@/components/AlertBox';
import { removeBudgetError } from '@/store/budgets/budgetsSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreateBudgetDialog from '../components/CreateBudgetDialog';
import BudgetList from '../components/BudgetList';


function BudgetsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { error } = useSelector((state: RootState) => state.budgets);

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => dispatch(removeBudgetError()), 5000);
            return () => clearTimeout(timeout);
        }
    }, [error, dispatch]);
    return (
        <div className="container mx-auto p-6">
            {error && <AlertBox title="Budgets" message={error} />}
            <h1 className="text-2xl font-bold mb-4">Budgets</h1>
            <p className="text-sm mb-6 text-muted-foreground">Manage and track your budgets here.</p>
            <div className="flex flex-row-reverse">
                <CreateBudgetDialog />
            </div>
            <BudgetList />
        </div>
    );
}
export default BudgetsPage
