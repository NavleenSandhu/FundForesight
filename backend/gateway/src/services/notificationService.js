const HttpError = require("../utils/httpError");

const fetchNotifications = async (userId) => {
    const res = await fetch(`${process.env.NOTIFICATIONS_URL}?user_id=${userId}`);
    if (res.status !== 200) {
        throw new HttpError("Cannot fetch notifications", 400)
    }
    const notifications = await res.json();
    return notifications;
};

const deleteNotification = async (notificationId, userId) => {
    const res = await fetch(`${process.env.NOTIFICATIONS_URL}/${notificationId}?user_id=${userId}`, {
        method: 'DELETE'
    });
    if (res.status !== 204) {
        throw new HttpError("Cannot delete notification", 400);
    }
};

module.exports = { fetchNotifications, deleteNotification };