import ConfirmationDialog from '@/components/ConfirmationDialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SavingGoal } from '@/models/SavingGoal'
import { Progress } from '@/components/ui/progress'
import React from 'react'
import SavingGoalDialog from './SavingGoalDialog'
interface SavingGoalListItemProps {
    goal: SavingGoal,
    progress: number,
    handleDelete: (goalId: number) => void
}
const SavingGoalListItem: React.FC<SavingGoalListItemProps> = ({ goal, progress, handleDelete }) => {
    return (
        <Card key={goal.goalId}>
            <CardHeader>
                <CardTitle>{goal.goalName}</CardTitle>
                <p className="text-sm text-gray-500">
                    Status: <span className="capitalize">{goal.status.toLowerCase()}</span>
                </p>
            </CardHeader>
            <CardContent>
                <p>Target Amount: ${goal.targetAmount.toFixed(2)}</p>
                <p>Current Amount: ${goal.currentAmount.toFixed(2)}</p>
                <p>Start Date: {new Date(goal.startDate).toLocaleDateString()}</p>
                <p>End Date: {new Date(goal.endDate).toLocaleDateString()}</p>
                <Progress value={progress} className="mt-2 h-2" />
                <div className="flex justify-between items-center mt-4">
                    <SavingGoalDialog formType='Edit' goalId={goal.goalId} />
                    <ConfirmationDialog
                        name="Delete Goal"
                        prompt={`Are you sure you want to delete the goal "${goal.goalName}"?`}
                        func={() => handleDelete(goal.goalId)}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default SavingGoalListItem
