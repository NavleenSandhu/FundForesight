import { Button, buttonVariants } from '@/components/ui/button'
import { DialogHeader, DialogFooter, DialogTrigger, Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Transaction } from '@/models/Transaction'
import { AppDispatch, RootState } from '@/store/store'
import { updateTransaction } from '@/store/transactions/transactionsSlice'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowRightLeft } from 'lucide-react'
interface MoveTransactionDialogProps {
    transaction: Transaction
}
const MoveTransactionDialog: React.FC<MoveTransactionDialogProps> = ({ transaction }) => {
    const { budgets } = useSelector((state: RootState) => state.budgets)
    const [selectedBudget, setSelectedBudget] = useState(transaction.budgetId.toString())
    const dispatch = useDispatch<AppDispatch>()
    const updateBudgetId = () => {
        const updatedTransaction: Transaction = { ...transaction, budgetId: parseInt(selectedBudget) }
        dispatch(updateTransaction(updatedTransaction))
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
