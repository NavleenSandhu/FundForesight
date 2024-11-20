import { Button } from '@/components/ui/button'
import { Budget } from '@/models/Budget'
import { displayDate } from '@/utils/dateUtils'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface BudgetListItemProps {
    budget: Budget
}

const BudgetItem: React.FC<BudgetListItemProps> = ({ budget }) => {
    const navigate = useNavigate()
    return (
        <div className="flex justify-between items-center rounded-lg shadow p-4 mb-2">
            <div>
                <p className="font-semibold">{budget.category_name}</p>
                <p className="hidden md:block text-sm">Start Date: {displayDate(budget.start_date)}</p>
                <p className="hidden md:block text-sm">End Date: {displayDate(budget.end_date)}</p>
            </div>
            <div className="text-center">
                <p className="text-lg font-semibold">
                    ${budget.remaining_amount.toFixed(2)} / ${budget.initial_amount.toFixed(2)}
                </p>
                <p
                    className={`text-sm ${budget.remaining_amount < budget.initial_amount * 0.2 ? 'text-red-500' : 'text-emerald-400'
                        }`}
                >
                    Remaining: {((budget.remaining_amount / budget.initial_amount) * 100).toFixed(0)}%
                </p>
            </div>
            <Button onClick={() => { navigate('/dashboard/budgets/viewBudget', { state: { budget_id: budget.budget_id } }) }}>View Budget</Button>
        </div >
    )
}

export default BudgetItem
