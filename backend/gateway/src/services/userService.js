const HttpError = require("../utils/httpError")

// get user id from cookies
const getUser = async (token) => {
    const res = await fetch(`${process.env.AUTH_URL}/getUserId`, {
        headers: {
            auth_token: token,
        },
    });
    const data = await res.json();

    if (res.ok) {
        return data
    } else {
        throw new HttpError("You are not logged in", 401);
    }
}

const getUserId = async (token) => {
    const user = await getUser(token)
    return user.user_id
};

const getLoginToken = async (email, password) => {
    const res = await fetch(`${process.env.AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
        return data.token;
    } else {
        throw new Error(data.error);
    }
};

const getRegisterToken = async (email, username, password) => {
    const res = await fetch(`${process.env.AUTH_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();
    if (res.ok) {
        return data.token;
    } else {
        throw new Error(await data.error);
    }
};

module.exports = {
    getUser,
    getUserId,
    getLoginToken,
    getRegisterToken,
};
