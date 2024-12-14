const { Router } = require("express");
const router = Router();

const {
    login,
    logout,
    register,
    validateUser
} = require("../controller/authController.js");

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
    getProfile,
    addProfile,
    updateProfile,
    deleteProfile
} = require("../controller/profilesController.js")

const {
    fetchUserNotifications,
    deleteUserNotification
} = require("../controller/notificationsController.js")

const {
    getLinkToken,
    addPlaidAccount,
    getBalance
} = require("../controller/plaidAccountController.js");

// auth routes
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.get("/validateUser", validateUser);

// budget routes
router.get("/budgets", getAllBudgets);
router.get("/budgets/:budget_id", getBudget);
router.put("/budgets/:budget_id", updateBudget);
router.delete("/budgets/:budget_id", deleteBudget);
router.post("/budgets", createBudget);

// transactions routes
router.get("/transactions", getTransactions);
router.post("/transactions", addTransaction);
router.put("/transactions/:id", updateTransaction);
router.delete("/transactions/:id", deleteTransaction);

// savings routes
router.get("/savings", getSavings);
router.post("/savings", addSavings);
router.put("/savings/:id", updateSaving);
router.delete("/savings/:id", deleteSaving);

// profiles routes
router.get("/profiles", getProfile);
router.post("/profiles", addProfile);
router.put("/profiles/:id", updateProfile);
router.delete("/profiles", deleteProfile);

// notifications routes
router.get("/notifications", fetchUserNotifications);
router.delete("/notifications/:id", deleteUserNotification);

// Plaid Account routes
router.get("/plaidAccounts/link-token", getLinkToken)
router.post("/plaidAccounts/addPlaidAccount", addPlaidAccount)
router.get("/plaidAccounts/balance", getBalance)

module.exports = router;
