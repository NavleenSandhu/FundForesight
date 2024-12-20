const {
    getLoginToken,
    getRegisterToken,
    getUser,
} = require("../services/userService.js");
const HttpError = require("../utils/httpError.js");

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await getLoginToken(email, password);
        res
            .cookie("access_token", token, {
                maxAge: 315360000 * 1000,
                httpOnly: true,
                signed: true,
                secure: true,
            })
            .status(200).json({ message: "User logged-in successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const logout = (req, res) => {
    res.clearCookie("access_token", { httpOnly: true, signed: true })
    res.status(200).json({ message: 'Logged out successfully' });
}

const register = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const token = await getRegisterToken(email, username, password);
        res
            .cookie("access_token", token, {
                maxAge: 315360000 * 1000,
                httpOnly: true,
                signed: true,
                secure: true,
            })
            .status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);

        res.status(400).json({ message: error.message });
    }
};

const validateUser = async (req, res) => {
    try {
        const user = await getUser(req.signedCookies.access_token);
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    login,
    logout,
    register,
    validateUser,
};
