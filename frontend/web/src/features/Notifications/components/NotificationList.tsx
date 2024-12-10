import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import NotificationListItem from "./NotificationListItem"
import { Notification } from "@/models/Notification"

const NotificationList = () => {
    const { notifications } = useSelector((state: RootState) => state.notifications)
    return (
        <div className="space-y-4">
            {notifications.map((notification: Notification) => (
                <NotificationListItem key={notification.notificationId} notification={notification} />
            ))}
        </div>
    )
}

export default NotificationList
