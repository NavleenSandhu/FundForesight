const {
    getUserBudget,
    createUserBudget,
    deleteUserBudget,
    updateUserBudget,
    getAllUserBudgets,
} = require("../services/budgetService");
const HttpError = require("../utils/httpError");

const createBudget = async (req, res) => {
    try {
        const token = req.signedCookies.access_token;

        const budget = await createUserBudget(token, req.body);
        res.status(201).json({ budget });
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }
        res.status(500).json({ message: error.message });
    }
};

const getBudget = async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const budget_id = req.params.budget_id;

        const data = await getUserBudget(token, budget_id);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }
        res.status(500).json({ message: error.message });
    }
};

const updateBudget = async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const budget_id = req.params.budget_id;
        await updateUserBudget(token, req.body, budget_id);
        res.status(200).send("Updated");
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }
        res.status(500).json({ message: error.message });
    }
};

const deleteBudget = async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const budget_id = req.params.budget_id;
        await deleteUserBudget(token, budget_id);
        res.status(204).json({ message: "deleted budget" });
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }
        res.status(500).json({ message: error.message });
    }
};

const getAllBudgets = async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const { start_date, end_date } = req.query
        const budgets = await getAllUserBudgets(token, start_date, end_date);
        res.status(200).json(budgets);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBudget,
    getBudget,
    deleteBudget,
    updateBudget,
    getAllBudgets,
};
