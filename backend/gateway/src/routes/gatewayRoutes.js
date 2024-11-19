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
const {
  getSavings,
  addSavings,
  updateSaving,
  deleteSaving
} = require("../controller/savingController.js");
const {
  getLinkToken,
  addPlaidAccount,
  getBalance
} = require("../controller/plaidAccountController.js");

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

//savings routes
router.get("/savings", getSavings);
router.post("/savings", addSavings);
router.put("/savings/:id", updateSaving);
router.delete("/savings/:id", deleteSaving);

//Plaid Account routes
router.get("/plaidAccounts/link-token", getLinkToken)
router.post("/plaidAccounts/addPlaidAccount", addPlaidAccount)
router.get("/plaidAccounts/balance", getBalance)

module.exports = router;
