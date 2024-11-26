const {
  getUserTransactions,
  addUserTransaction,
  updateUserTransaction,
  deleteUserTransaction,
} = require("../services/transactionService.js");
const { getUserId } = require("../services/userService.js");

const getTransactions = async (req, res) => {
  try {
    const token = req.signedCookies.access_token;
    const userId = await getUserId(token);
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";
    const transactions = await getUserTransactions(userId, startDate, endDate);

    res.status(200).json({ transactions });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

const addTransaction = async (req, res) => {
  try {
    let transactions = req.body;
    const token = req.signedCookies.access_token;
    const userId = await getUserId(token);

    transactions.forEach((transaction) => {
      transaction.userId = userId;
    });

    await addUserTransaction(transactions);

    res.status(201).json({ message: "Added transaction" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = req.body;
    const transactionId = req.params.id;
    const token = req.signedCookies.access_token;
    const userId = await getUserId(token);
    transaction.userId = userId;
    await updateUserTransaction(transaction, transactionId);
    res.status(200).send("Updated");
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const token = req.signedCookies.access_token;
    const userId = await getUserId(token);
    const transactionId = req.params.id;

    await deleteUserTransaction(transactionId, userId);
    res.status(204);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
