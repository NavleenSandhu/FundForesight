const HttpError = require("../utils/httpError");
const { getUserId } = require("./userService");
const axios = require("axios");
const getUserBudget = async (token, budget_id) => {
  const user_id = await getUserId(token);
  if (!user_id) {
    throw new HttpError("User validation failed", 401);
  }

  const res = await axios.get(
    `${process.env.BUDGET_URL}/${budget_id}`,

    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (res.status != 200) {
    throw new HttpError("Unable to fetch the data", 500);
  }
  if (res.data.user_id != user_id) {
    throw new HttpError("forbidden", 403);
  }
  return res.data;
};
const createUserBudget = async (token, budget) => {
  const user_id = await getUserId(token);

  if (!user_id) {
    throw new Error("User validation failed");
  }
  budget.user_id = user_id;

  const res = await axios.post(
    `${process.env.BUDGET_URL}`,

    budget,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (res.status != 201) {
    throw new Error("Unable to create budget");
  }
};
const updateUserBudget = async (token, budget, budget_id) => {
  const user_id = await getUserId(token);

  if (!user_id) {
    throw new Error("User validation failed");
  }
  budget.user_id = user_id;

  const res = await axios.put(
    `${process.env.BUDGET_URL}/${budget_id}`,

    budget,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (res.status != 204) {
    throw new Error("Unable to update budget");
  }
};
const deleteUserBudget = async (token, budget_id) => {
  const user_id = getUserId(token);
  if (!user_id) {
    throw new Error("User validation failed");
  }

  const res = await axios.delete(`${process.env.BUDGET_URL}/${budget_id}`);

  if (res.status != 204) {
    throw new Error("Unable to Delete the User");
  }
};

const getAllUserBudgets = async (token) => {
  const user_id = await getUserId(token);
  if (!user_id) {
    throw new Error("User validation failed");
  }

  const res = await axios.get(`${process.env.BUDGET_URL}?user_id=${user_id}`);

  if (res.status != 200) {
    throw new Error("Unable to fetch the data");
  }
  return res.data;
};

module.exports = {
  getUserBudget,
  createUserBudget,
  deleteUserBudget,
  updateUserBudget,
  getAllUserBudgets,
};
