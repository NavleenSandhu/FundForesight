const { getSavingGoals, addSavingGoals, updateSavingGoal, deleteSavingGoal } = require("../services/savingService")
const { getUserId } = require("../services/userService")
const HttpError = require("../utils/httpError")

const getSavings = async (req, res) => {
    try {
        const token = req.signedCookies.access_token
        const userId = await getUserId(token)
        const savings = await getSavingGoals(userId)
        res.status(200).json({ savings })
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message })
            return
        }
        res.status(500).json({ message: error.message })
    }
}

const addSavings = async (req, res) => {
    try {
        let savingGoals = req.body
        const token = req.signedCookies.access_token
        const userId = await getUserId(token)
        savingGoals.forEach((saving) => {
            saving.userId = userId
        })
        const goals = await addSavingGoals(savingGoals)
        res.status(201).json(goals)
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message })
            return
        }
        res.status(500).json({ message: error.message })
    }
}

const updateSaving = async (req, res) => {
    try {
        const savingGoal = req.body
        const token = req.signedCookies.access_token
        const userId = await getUserId(token)
        const goalId = req.params.id
        savingGoal.userId = userId
        await updateSavingGoal(savingGoal, goalId)
        res.status(200).json({ message: "Goal updated" })
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message })
            return
        }
        res.status(500).json({ message: error.message })
    }
}
const deleteSaving = async (req, res) => {
    try {
        const token = req.signedCookies.access_token
        const userId = await getUserId(token)
        const goalId = req.params.id
        await deleteSavingGoal(goalId, userId)
        res.status(204).send("Deleted")
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message })
            return
        }
        res.status(500).json({ message: error.message })
    }
}



module.exports = { getSavings, addSavings, updateSaving, deleteSaving }