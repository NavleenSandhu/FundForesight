const {
  getLoginToken,
  getRegisterToken,
} = require("../services/userService.js");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await getLoginToken(email, password);
    res
      .cookie("access_token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        signed: true,
      })
      .json({ message: "User logged-in successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const token = await getRegisterToken(email, username, password);
    res
      .cookie("access_token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        signed: true,
      })
      .json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  login,
  register,
};
