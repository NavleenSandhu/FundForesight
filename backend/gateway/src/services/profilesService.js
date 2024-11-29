const HttpError = require("../utils/httpError");

const getUserProfile = async (userId) => {
    const res = await fetch(`${process.env.PROFILES_URL}?user_id=${userId}`);
    if (res.status !== 200) {
        throw new HttpError("Cannot fetch user profile", 400);
    }
    const profile = await res.json();
    return profile;
};

const addUserProfile = async (profileData) => {
    const res = await fetch(`${process.env.PROFILES_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
    });
    if (res.status !== 201) {
        throw new HttpError("Could not add user profile", 400);
    }
    const profile = await res.json();
    return profile;
};

const updateUserProfile = async (profileData, userId) => {
    const res = await fetch(`${process.env.PROFILES_URL}/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
    });
    if (res.status !== 200) {
        throw new HttpError("Cannot update user profile", 400);
    }
    const profile = await res.json();
    return profile;
};

const deleteUserProfile = async (userId) => {
    const res = await fetch(`${process.env.PROFILES_URL}/${userId}`, {
        method: "DELETE",
    });
    if (res.status !== 204) {
        throw new HttpError("Cannot delete user profile", 400);
    }
};

module.exports = { getUserProfile, addUserProfile, updateUserProfile, deleteUserProfile };
