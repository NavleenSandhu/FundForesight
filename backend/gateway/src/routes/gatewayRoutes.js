const { Router } = require("express");
const router = Router();
const { login, register } = require("../controller/authController.js");
const {
  getBudget,
  updateBudget,
  deleteBudget,
  createBudget,
  getAllBudgets,
} = require("../controller/budgetController.js");

const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controller/transactionController.js");

//auth routes
router.post("/login", login);
router.post("/register", register);

//budget routes
router.get("/budgets", getAllBudgets);
router.get("/budgets/:budget_id", getBudget);
router.put("/budgets/:budget_id", updateBudget);
router.delete("/budgets/:budget_id", deleteBudget);
router.post("/budgets", createBudget);

//transactions routes
router.get("/transaction", getTransactions);
router.post("/transaction", addTransaction);
router.put("/transaction/:id", updateTransaction);
router.delete("/transaction/:id", deleteTransaction);

module.exports = router;
