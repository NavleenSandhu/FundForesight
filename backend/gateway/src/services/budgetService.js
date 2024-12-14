const HttpError = require("../utils/httpError");
const { getUserId } = require("./userService");
const getUserBudget = async (token, budget_id) => {
    const user_id = await getUserId(token);
    if (!user_id) {
        throw new HttpError("User validation failed", 401);
    }

    const res = await fetch(
        `${process.env.BUDGET_URL}/${budget_id}`,
    )

    if (res.status != 200) {
        throw new HttpError("Unable to fetch the data", 500);
    }
    const data = await res.json()
    if (data.user_id != user_id) {
        throw new HttpError("forbidden", 403);
    }
    return data;
};
const createUserBudget = async (token, budget) => {
    const user_id = await getUserId(token);
    if (!user_id) {
        throw new Error("User validation failed");
    }
    budget.user_id = user_id;

    const res = await fetch(
        `${process.env.BUDGET_URL}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(budget)
        }
    );

    if (res.status != 201) {
        throw new Error("Unable to create budget");
    }
    const data = await res.json()
    return data;
};
const updateUserBudget = async (token, budget, budget_id) => {
    const user_id = await getUserId(token);

    if (!user_id) {
        throw new Error("User validation failed");
    }
    budget.user_id = user_id;

    const res = await fetch(
        `${process.env.BUDGET_URL}/${budget_id}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(budget),
        }
    );

    if (res.status != 204) {
        throw new Error("Unable to update budget");
    }
};
const deleteUserBudget = async (token, budget_id) => {
    const budgetRes = await getUserBudget(token, budget_id);
    const budget = await budgetRes.json();
    if (!budget) {
        throw new HttpError("Budget not found", 404);
    }
    if (budget.category_name === "Other") {
        throw new HttpError("Can not delete default budget", 400);
    }
    const user_id = await getUserId(token);
    if (!user_id) {
        throw new Error("User validation failed");
    }

    const res = await fetch(
        `${process.env.BUDGET_URL}/${budget_id}?user_id=${user_id}`, {
        method: "DELETE"
    }
    );
    if (res.status === 409)
        throw new HttpError("Can not delete budget with transactions", res.status);

    if (res.status != 204) {
        throw new Error("Unable to Delete the User");
    }
};

const getAllUserBudgets = async (token, start_date, end_date) => {
    const user_id = await getUserId(token);
    if (!user_id) {
        throw new Error("User validation failed");
    }
    if (!(start_date && end_date)) throw new HttpError("Missing required params: start_date and end_date", 400)
    const res = await fetch(`${process.env.BUDGET_URL}?user_id=${user_id}&start_date=${start_date}&end_date=${end_date}`);
    if (res.status != 200) {
        throw new Error("Unable to fetch the data");
    }
    const budgets = await res.json()
    return budgets;
};

module.exports = {
    getUserBudget,
    createUserBudget,
    deleteUserBudget,
    updateUserBudget,
    getAllUserBudgets,
};
