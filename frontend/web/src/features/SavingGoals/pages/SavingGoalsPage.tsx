import {  useSelector } from "react-redux"
import SavingGoalsList from "../components/SavingGoalsList"
import {  RootState } from "@/store/store"
import AlertBox from '@/components/AlertBox';


function SavingGoalsPage() {
    const { error } = useSelector((state:RootState) => state.savingGoals);
    return (
        <div className="container mx-auto p-6 space-y-4">
            <AlertBox message={ error} />
            <h1 className="text-2xl font-bold">Saving Goals</h1>
            <SavingGoalsList />
        </div>
    )
}

export default SavingGoalsPage
