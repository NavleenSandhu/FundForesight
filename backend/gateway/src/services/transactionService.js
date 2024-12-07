const HttpError = require("../utils/httpError");
const getUserTransactions = async (userId, startDate, endDate) => {
    const res = await fetch(
        `${process.env.TRANSACTION_URL}?user_id=${userId}&start_date=${startDate}&end_date=${endDate}`
    );
    if (!res.ok) {
        throw new HttpError("Unable to fetch the data", 500);
    }
    const data = await res.json();
    if (data.length > 0 && data[0].userId !== userId) {
        throw new HttpError("Forbidden", 403);
    }
    return data;
};

const addUserTransaction = async (transactions) => {
    const res = await fetch(`${process.env.TRANSACTION_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactions),
    });

    if (res.status != 201) {
        throw new HttpError("unable to add transaction data", 500);
    }
};

const updateUserTransaction = async (transaction, transactionId) => {
    const res = await fetch(`${process.env.TRANSACTION_URL}/${transactionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
    });

    if (res.status != 204) {
        throw new HttpError("unable to update transaction data", 500);
    }
};

const deleteUserTransaction = async (transactionId, userId) => {
    const res = await fetch(
        `${process.env.TRANSACTION_URL}/${transactionId}?user_id=${userId}`,
        {
            method: "DELETE",
        }
    );

    if (res.status != 204) {
        throw new HttpError("unable to update transaction data", 500);
    }
};

module.exports = {
    addUserTransaction,
    getUserTransactions,
    updateUserTransaction,
    deleteUserTransaction,
};
