const { fetchNotifications, deleteNotification } = require("../services/notificationService");
const { getUserId } = require("../services/userService");
const HttpError = require("../utils/httpError");

const fetchUserNotifications = async (req, res) => {
    try {
        const token = req.signedCookies.access_token
        const userId = await getUserId(token)
        const notifications = await fetchNotifications(userId);
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message })
            return
        }
        res.status(500).json({ message: error.message })
    }
};

const deleteUserNotification = async (req, res) => {
    try {
        const token = req.signedCookies.access_token
        const userId = await getUserId(token)
        const notificationId = req.params.id
        await deleteNotification(notificationId, userId);
        res.status(204).send("Deleted");
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message })
            return
        }
        res.status(500).json({ message: error.message })
    }
}


module.exports = { fetchUserNotifications, deleteUserNotification };