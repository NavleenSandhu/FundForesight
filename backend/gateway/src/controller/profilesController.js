const {
    getUserProfile,
    addUserProfile,
    updateUserProfile,
    deleteUserProfile,
} = require("../services/profilesService");
const { getUserId } = require("../services/userService");
const HttpError = require("../utils/httpError");
const { getCurrencyByCountryCode } = require("../utils/currencyUtils")

const getProfile = async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const userId = await getUserId(token);
        const profile = await getUserProfile(userId);
        res.status(200).json({ profile });
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: error.message });
    }
};

const addProfile = async (req, res) => {
    try {
        const profileData = req.body;
        const token = req.signedCookies.access_token;
        const userId = await getUserId(token);
        profileData.userId = userId;
        profile.currency = getCurrencyByCountryCode(profile.countryCode)
        const profile = await addUserProfile(profileData);
        res.status(201).json(profile);
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const profileData = req.body;
        const token = req.signedCookies.access_token;
        const userId = await getUserId(token);
        await updateUserProfile(profileData, userId);
        res.status(200).json({ message: "Profile updated" });
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: error.message });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const userId = await getUserId(token);
        await deleteUserProfile(userId);
        res.status(204).send("Deleted");
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProfile, addProfile, updateProfile, deleteProfile };
