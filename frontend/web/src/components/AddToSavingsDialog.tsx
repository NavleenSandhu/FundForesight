import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { editSavingGoal } from '@/store/savingGoals/savingGoalsSlice'
import { displayCurrency } from '@/utils/currencyUtils'
import { deleteNotification } from '@/store/notifications/notificationSlice'

interface AddToSavingsDialogProps {
    initialAmount: number,
    notificationId: number
}

const AddToSavingsDialog: React.FC<AddToSavingsDialogProps> = ({ initialAmount, notificationId }) => {
    const dispatch = useDispatch<AppDispatch>()
    const savingGoals = useSelector((state: RootState) => state.savingGoals.savingGoals.filter(goal => goal.status === 'ACTIVE'))
    const { profile } = useSelector((state: RootState) => state.profile)
    const [inputAmount, setInputAmount] = useState(0)
    const [last, setLast] = useState(false)
    const [end, setEnd] = useState(false)
    const [amount, setAmount] = useState(initialAmount);
    const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
    const [inputs, setInputs] = useState<number[]>([])

    useEffect(() => {
        if (currentGoalIndex === savingGoals.length - 1) {
            setLast(true)
            setInputAmount(amount)
        }
    }, [])

    const handleFinish = () => {
        // Update the saving goals
        inputs.forEach((input, index) => {
            const goal = savingGoals[index]
            const newAmount = goal.currentAmount + input
            dispatch(editSavingGoal({
                ...goal,
                currentAmount: newAmount,
                status: newAmount >= goal.targetAmount ? 'COMPLETED' : 'ACTIVE'
            }))
        })
        dispatch(deleteNotification(notificationId))
    }

    const handleAdd = () => {
        const remainingAmount = amount - inputAmount
        if (inputAmount > 0 && remainingAmount >= 0) {
            setInputs([...inputs, inputAmount])
            // Update the amount of input(in case of last goal) and current goal index
            if (currentGoalIndex === savingGoals.length - 2) {
                setLast(true)
                setInputAmount(remainingAmount)
            } else {
                setInputAmount(0)
            }
            if (currentGoalIndex < savingGoals.length - 1) {
                setCurrentGoalIndex(currentGoalIndex + 1)
            }
            // Update the amount
            setAmount(remainingAmount)
            // If the amount is 0, prepare to finish flow
            if (remainingAmount === 0) {
                setEnd(true)
            }
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add to Savings</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add to Savings</DialogTitle>
                    <DialogDescription>
                        {
                            end ?
                                `${displayCurrency(initialAmount, profile.currency)} added to savings`
                                :
                                `Add from ${displayCurrency(amount, profile.currency)} to ${savingGoals[currentGoalIndex].goalName}`
                        }
                    </DialogDescription>
                </DialogHeader>
                {!end && <>
                    <Label>Amount</Label>
                    <Input
                        type='number'
                        value={inputAmount}
                        step={0.01}
                        disabled={last}
                        required
                        onChange={(e) => setInputAmount(parseFloat(e.target.value))}
                    />
                </>}
                <DialogFooter>
                    {end ?
                        (<DialogClose>
                            <Button onClick={handleFinish}>Finish</Button>
                        </DialogClose>)
                        :
                        (<Button onClick={handleAdd}>Add</Button>)
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddToSavingsDialog
