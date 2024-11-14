const HttpError = require("../utils/httpError")

const getPlaidLinkToken = async (userId) => {
    try {
        const res = await fetch(`${process.env.PLAID_URL}/link-token?user_id=${userId}`,
            {
                method: "GET"
            }
        )
        const linkToken = await res.text()
        if (!res.ok) {
            throw new HttpError("Unable to fetch link-token", 500)
        }
        return linkToken;
    } catch (error) {
        console.log(error.message);
        throw error
    }
}

const addPlaidAccountByPublicToken = async (user_id, public_token) => {
    try {
        const res = await fetch(`${process.env.PLAID_URL}/addPlaidAccount`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_id, public_token })
        })
        if (res.status !== 201) {
            throw new HttpError("Error while adding accounts", 500)
        }
    } catch (error) {
        console.log(error.message);
        throw error
    }
}

const getBankBalance = async (userId) => {
    try {
        const res = await fetch(`${process.env.PLAID_URL}/balance?user_id=${userId}`,
            {
                method: "GET"
            }
        )
        const balance = await res.text()
        if (!res.ok) {
            throw new HttpError("Unable to fetch balance", 500)
        }
        return balance;
    } catch (error) {
        console.log(error.message);
        throw error
    }
}

module.exports = { getPlaidLinkToken, addPlaidAccountByPublicToken, getBankBalance }