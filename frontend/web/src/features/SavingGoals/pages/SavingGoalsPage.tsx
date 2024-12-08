import {  useDispatch, useSelector } from "react-redux"
import SavingGoalsList from "../components/SavingGoalsList"
import {  AppDispatch, RootState } from "@/store/store"
import AlertBox from '@/components/AlertBox';
import { useEffect } from "react";
import { removeSavingError } from "@/store/savingGoals/savingGoalsSlice";


function SavingGoalsPage() {
    const dispatch = useDispatch<AppDispatch>()
    const { error } = useSelector((state:RootState) => state.savingGoals);
    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => dispatch(removeSavingError()), 5000);
            return () => clearTimeout(timeout);
        }
    }, [error, dispatch]);
    return (
        <div className="container mx-auto p-6 space-y-4">
            <AlertBox title="Saving Goals" message={ error} />
            <h1 className="text-2xl font-bold">Saving Goals</h1>
            <SavingGoalsList />
        </div>
    )
}

export default SavingGoalsPage
