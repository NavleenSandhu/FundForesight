import { useDispatch, useSelector } from "react-redux"
import NotificationList from "../components/NotificationList"
import { AppDispatch, RootState } from "@/store/store"
import { removeNotificationError } from "@/store/notifications/notificationSlice"
import { useEffect } from "react"
import AlertBox from "@/components/AlertBox"

const NotificationsPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { error } = useSelector((state: RootState) => state.notifications)
    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => dispatch(removeNotificationError()), 5000);
            return () => clearTimeout(timeout);
        }
    }, [error, dispatch]);
    return (
        <div>
            {error && <AlertBox title="Notifications" message={error} />}
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <NotificationList />
        </div>
    )
}

export default NotificationsPage
