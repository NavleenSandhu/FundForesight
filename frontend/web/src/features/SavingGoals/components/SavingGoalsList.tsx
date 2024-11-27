import { useSelector, useDispatch } from "react-redux";
import { SavingGoal } from "@/models/SavingGoal";
import { AppDispatch, RootState } from "@/store/store";
import { deleteSavingGoal } from "@/store/savingGoals/savingGoalsSlice";
import SavingGoalListItem from "./SavingGoalListItem";
import SavingGoalDialog from "./SavingGoalDialog";

export default function SavingGoalsList() {
    const dispatch = useDispatch<AppDispatch>();
    const { savingGoals, error } = useSelector((state: RootState) => state.savingGoals);

    const handleDelete = (goalId: number) => {
        dispatch(deleteSavingGoal(goalId));
    };

    return (
        <>
            <SavingGoalDialog formType="Create" />
            {/* Display error */}
            {savingGoals.length > 0 ?
                (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {savingGoals.map((goal: SavingGoal) => {
                            const progress = (goal.currentAmount / goal.targetAmount) * 100;
                            return (
                                <SavingGoalListItem key={goal.goalId} goal={goal} progress={progress} handleDelete={handleDelete} />
                            );
                        })}
                    </div>
                ) :
                (<h2 className="text-center text-2xl font-semibold mb-4">No Saving goals to display.</h2>)}
        </>
    );
}
