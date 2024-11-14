const { getUserId } = require("../services/userService");
const { getPlaidLinkToken, addPlaidAccountByPublicToken, getBankBalance } = require("../services/plaidAccountService");
const HttpError = require("../utils/httpError");

const getLinkToken = async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const userId = await getUserId(token);
        const linkToken = await getPlaidLinkToken(userId)
        res.status(200).json({ linkToken })
    } catch (error) {
        console.log(error.message)
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message })
        } else {
            res.status(500).json({ message: error.message })
        }
    }
}

const addPlaidAccount = async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const userId = await getUserId(token);
        const { publicToken } = req.body
        await addPlaidAccountByPublicToken(userId, publicToken)
        res.status(200).json({ message: "Transactions Added" })
    } catch (error) {
        console.log(error.message)
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message })
        } else {
            res.status(500).json({ message: error.message })
        }
    }
}

const getBalance = async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const userId = await getUserId(token);
        const balance = await getBankBalance(userId)
        res.status(200).json({ balance })
    } catch (error) {
        console.log(error.message)
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message })
        } else {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = { getLinkToken, addPlaidAccount, getBalance }