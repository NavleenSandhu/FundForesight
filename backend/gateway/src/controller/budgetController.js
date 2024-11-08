const {
  getUserBudget,
  createUserBudget,
  deleteUserBudget,
  updateUserBudget,
  getAllUserBudgets,
} = require("../services/budgetService");

const createBudget = async (req, res) => {
  try {
    const token = req.signedCookies.access_token;

    await createUserBudget(token, req.body);
    res.status(201).json("Created budget");
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const getBudget = async (req, res) => {
  try {
    const token = req.signedCookies.access_token;
    const budget_id = req.params.budget_id;

    const data = await getUserBudget(token, budget_id);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(error.status).json({ message: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const token = req.signedCookies.access_token;
    const budget_id = req.params.budget_id;
    await updateUserBudget(token, req.body, budget_id);
    res.status(204).json("updated budget");
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const token = req.signedCookies.access_token;
    const budget_id = req.params.budget_id;
    await deleteUserBudget(token, budget_id);
    res.status(204).json({ message: "deleted budget" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const getAllBudgets = async (req, res) => {
  try {
    const token = req.signedCookies.access_token;

    const data = await getAllUserBudgets(token);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBudget,
  getBudget,
  deleteBudget,
  updateBudget,
  getAllBudgets,
};
