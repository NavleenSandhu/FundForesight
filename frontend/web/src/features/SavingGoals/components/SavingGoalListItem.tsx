import ConfirmationDialog from '@/components/ConfirmationDialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SavingGoal } from '@/models/SavingGoal'
import { Progress } from '@/components/ui/progress'
import React from 'react'
import SavingGoalDialog from './SavingGoalDialog'
import { formatDate } from '@/utils/dateUtils'
interface SavingGoalListItemProps {
    goal: SavingGoal,
    progress: number,
    handleDelete: (goalId: number) => void
}
const SavingGoalListItem: React.FC<SavingGoalListItemProps> = ({ goal, progress, handleDelete }) => {
    return (
        <Card key={goal.goalId} className="border rounded-lg shadow-md p-2">
            <CardHeader className="text-center mb-2">
                <CardTitle className="text-xl font-semibold">{goal.goalName}</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Status: <span className={`capitalize font-medium ${goal.status === 'ACTIVE' ? 'text-green-600' : goal.status === 'COMPLETED' ? 'text-blue-600' : 'text-red-600'}`}>
                        {goal.status.toLowerCase()}
                    </span>
                </p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3">
                    <div className='text-sm text-left col-span-2'>
                        <p><strong>Start Date:</strong> {formatDate(goal.startDate)}</p>
                        <p><strong>End Date:</strong> {formatDate(goal.endDate)}</p>
                    </div>
                    <p className='mt-4'><span className='font-bold'>${goal.currentAmount.toFixed(2)}</span ><span className="text-xs text-muted-foreground">/{goal.targetAmount}</span></p>
                </div>
                <div className="mt-4">
                    <Progress value={progress} />
                    <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(0)}% completed</p>
                </div>
                <div className="flex justify-center gap-4 mt-6">
                    <SavingGoalDialog
                        formType="Edit"
                        goalId={goal.goalId}
                    />
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
