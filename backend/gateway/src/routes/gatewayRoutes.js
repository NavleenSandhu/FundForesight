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

router.post("/login", login);
router.post("/register", register);

router.get("/budgets", getAllBudgets);
router.get("/budgets/:budget_id", getBudget);
router.put("/budgets/:budget_id", updateBudget);
router.delete("/budgets/:budget_id", deleteBudget);
router.post("/budgets", createBudget);

//google auth


module.exports = router;
