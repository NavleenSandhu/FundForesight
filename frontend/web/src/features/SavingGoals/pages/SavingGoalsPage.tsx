import SavingGoalsList from "../components/SavingGoalsList"

function SavingGoalsPage() {
    return (
        <div className="container mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">Saving Goals</h1>
            <SavingGoalsList />
        </div>
    )
}

export default SavingGoalsPage
