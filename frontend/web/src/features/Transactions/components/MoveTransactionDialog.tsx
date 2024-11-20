import { Button } from '@/components/ui/button'
import { DialogHeader, DialogFooter, DialogTrigger, Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Transaction } from '@/models/Transaction'
import { AppDispatch, RootState } from '@/store/store'
import { updateTransaction } from '@/store/transactions/transactionsSlice'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowRightLeft } from 'lucide-react'
import { editBudget } from '@/store/budgets/budgetsSlice'
interface MoveTransactionDialogProps {
    transaction: Transaction
}
const MoveTransactionDialog: React.FC<MoveTransactionDialogProps> = ({ transaction }) => {
    const { budgets } = useSelector((state: RootState) => state.budgets)
    const [selectedBudget, setSelectedBudget] = useState(transaction.budgetId.toString())
    const dispatch = useDispatch<AppDispatch>()
    const updateBudgetId = () => {
        const previousBudgetId = transaction.budgetId
        const newBudgetId = parseInt(selectedBudget)
        const updatedTransaction: Transaction = { ...transaction, budgetId: newBudgetId }
        dispatch(updateTransaction(updatedTransaction))
        const transactionAmount = transaction.transactionType === 'EXPENSE' ? transaction.amount : - transaction.amount
        // Update te amounts of the budgets
        const prevBudget = budgets.find(budget => budget.budget_id === previousBudgetId)!
        dispatch(editBudget({ ...prevBudget, remaining_amount: prevBudget.remaining_amount + transactionAmount }))

        const newBudget = budgets.find(budget => budget.budget_id === newBudgetId)!
        dispatch(editBudget({ ...newBudget, remaining_amount: newBudget.remaining_amount - transactionAmount }))
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button style={{ position: 'absolute', top: '-7px', left: '-50px' }}>
                    <ArrowRightLeft />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Move transaction</DialogTitle>
                    <DialogDescription>Assign this transaction to a different budget.</DialogDescription>
                </DialogHeader>
                <Select onValueChange={(value) => { setSelectedBudget(value) }}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a budget to assign" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            budgets.map((budget) =>
                                <SelectItem key={budget.budget_id} value={budget.budget_id.toString()}>{budget.category_name}</SelectItem>
                            )
                        }
                    </SelectContent>
                </Select>
                <DialogFooter className="space-x-4">
                    <DialogClose asChild>
                        <Button onClick={updateBudgetId}>Save Changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MoveTransactionDialog
