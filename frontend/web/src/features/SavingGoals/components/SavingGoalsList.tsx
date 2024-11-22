import { useSelector, useDispatch } from "react-redux";
import { SavingGoal } from "@/models/SavingGoal";
import { useEffect } from "react";
import { AppDispatch, RootState } from "@/store/store";
import { deleteSavingGoal, fetchSavingGoals } from "@/store/savingGoals/savingGoalsSlice";
import SavingGoalListItem from "./SavingGoalListItem";
import SavingGoalDialog from "./SavingGoalDialog";

export default function SavingGoalsList() {
    const dispatch = useDispatch<AppDispatch>();
    const { savingGoals, error } = useSelector((state: RootState) => state.savingGoals);

    useEffect(() => {
        if (savingGoals.length === 0) {
            dispatch(fetchSavingGoals());
        }
    }, [dispatch, savingGoals.length]);

    const handleDelete = (goalId: number) => {
        dispatch(deleteSavingGoal(goalId));
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Saving Goals</h1>
            <SavingGoalDialog formType="Create" />
            {/* Display error */}
            {savingGoals.length > 0 ?
                (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savingGoals.map((goal: SavingGoal) => {
                            const progress = (goal.currentAmount / goal.targetAmount) * 100;
                            console.log(progress);

                            return (
                                <SavingGoalListItem key={goal.goalId} goal={goal} progress={progress} handleDelete={handleDelete} />
                            );
                        })}
                    </div>
                ) :
                (<h2 className="text-center text-2xl font-semibold mb-4">No Saving goals to display.</h2>)}
        </div>
    );
}
