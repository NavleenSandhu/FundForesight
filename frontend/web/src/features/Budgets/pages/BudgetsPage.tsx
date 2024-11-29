import AlertBox from '@/components/AlertBox';
import { fetchBudgets, removeBudgetError } from '@/store/budgets/budgetsSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BudgetDialog from '../components/BudgetDialog';
import BudgetList from '../components/BudgetList';


function BudgetsPage() {
    const { budgets } = useSelector((state: RootState) => state.budgets);
    const dispatch = useDispatch<AppDispatch>();
    const { error} = useSelector((state:RootState)=> state.budgets);

    useEffect(() => {
        if (budgets.length === 0) {
            dispatch(fetchBudgets());
        }
    }, [dispatch, budgets.length]);

    if (error) { 
        setTimeout(() => { dispatch(removeBudgetError()) }, 5000);
    }
    return (
        <div className="container mx-auto p-6">
            <AlertBox message={ error} />
            <h1 className="text-2xl font-bold mb-4">Budgets</h1>
            <p className="text-sm mb-6">Manage and track your budgets here.</p>
            <BudgetDialog formType='Create' />
            <BudgetList />
        </div>
    );
}
export default BudgetsPage
