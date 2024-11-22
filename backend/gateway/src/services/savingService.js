const HttpError = require("../utils/httpError")

const getSavingGoals = async (userId) => {
    const res = await fetch(`${process.env.SAVINGS_URL}?user_id=${userId}`)
    if (res.status !== 200) {
        throw new HttpError("Cannot fetch savings", 400)
    }
    const savings = await res.json()
    return savings
}

const addSavingGoals = async (savingGoals) => {
    const res = await fetch(`${process.env.SAVINGS_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(savingGoals)
    })
    if (res.status !== 201) {
        throw new HttpError("Could not add savings", 400)
    }
    const goals = await res.json()
    if (goals.length === 1) {
        return goals[0]
    }
    return goals
}

const updateSavingGoal = async (savingGoal, goalId) => {
    const res = await fetch(`${process.env.SAVINGS_URL}/${goalId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(savingGoal)
    })
    if (res.status !== 204) {
        throw new HttpError("Cannot update saving goal", 400)
    }
}

const deleteSavingGoal = async (goalId, userId) => {
    const res = await fetch(`${process.env.SAVINGS_URL}/${goalId}?user_id=${userId}`, {
        method: "DELETE"
    })
    if (res.status !== 204) {
        throw new HttpError("Cannot delete saving goal", 400)
    }
}
module.exports = { getSavingGoals, addSavingGoals, updateSavingGoal, deleteSavingGoal }