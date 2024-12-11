import { Button } from '@/components/ui/button'
import { Budget } from '@/models/Budget'
import { RootState } from '@/store/store'
import { displayDate } from '@/utils/dateUtils'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

interface BudgetListItemProps {
    budget: Budget
}

const BudgetItem: React.FC<BudgetListItemProps> = ({ budget }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { profile } = useSelector((state: RootState) => state.profile)

    return (
        <div className="grid grid-cols-3 md:flex md:justify-between gap-8 items-center rounded-lg shadow p-4 mb-2">
            <div>
                <p className="font-semibold">{budget.category_name}</p>
                <p className="hidden md:block text-sm">Start Date: {displayDate(budget.start_date)}</p>
                <p className="hidden md:block text-sm">End Date: {displayDate(budget.end_date)}</p>
            </div>
            <div className="text-center">
                <p>
                    <span className="text-base md:text-lg font-bold">{profile.currency} {budget.remaining_amount.toFixed(2)}</span>
                    <span className="text-xs md:text-sm text-muted-foreground"> of {budget.initial_amount.toFixed(2)}</span>
                </p>
                <p
                    className={`hidden md:block text-sm ${budget.remaining_amount < budget.initial_amount * 0.2 ? 'text-red-500' : 'text-emerald-400'
                        }`}
                >
                    Remaining: {((budget.remaining_amount / budget.initial_amount) * 100).toFixed(0)}%
                </p>
            </div>
            <div>
                <Button onClick={() => { navigate('/dashboard/budgets/viewBudget', { state: { budget_id: budget.budget_id, referer: location.pathname } }) }}><span className='hidden md:block'> View Budget</span><ArrowRight className='md:hidden' /></Button>
            </div>
        </div >
    )
}

export default BudgetItem
