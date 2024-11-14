import { useEffect } from 'react'
import BudgetList from '../components/BudgetList';
import { fetchBudgets } from '@/store/budgets/budgetsSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import BudgetDialog from '../components/BudgetDialog';

function BudgetsPage() {
    const { budgets } = useSelector((state: RootState) => state.budgets);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (budgets.length === 0) {
            dispatch(fetchBudgets());
        }
    }, [dispatch, budgets.length]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Budgets</h1>
            <p className="text-sm mb-6">Manage and track your budgets here.</p>
            <BudgetDialog formType='Create' />
            <BudgetList />
        </div>
    );
}
export default BudgetsPage
