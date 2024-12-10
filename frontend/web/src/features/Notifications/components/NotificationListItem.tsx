import AddToSavingsDialog from '@/components/AddToSavingsDialog'
import { Card, CardTitle } from '@/components/ui/card'
import { Notification } from '@/models/Notification'
import { formatDateAndTime } from '@/utils/dateUtils'
import React from 'react'

interface NotificationListItemProps {
    notification: Notification
}
const NotificationListItem: React.FC<NotificationListItemProps> = ({ notification }) => {
    return (
        <Card className='mx-4 p-4 md:mx-20 md:px-8'>
            <CardTitle className='flex justify-between items-center'>
                <span className='text-lg font-bold text-left'>{notification.title}</span>
                <span className='text-xs font-normal text-muted-foreground text-right'>{formatDateAndTime(notification.timestamp)}</span></CardTitle>
            <p className='text-left text-sm'>{notification.message}</p>
            {   
                notification.notificationType === "EXPENDITURE_REVIEW" &&
                notification.message.includes("saved") &&
                <AddToSavingsDialog notificationId={notification.notificationId} initialAmount={parseFloat(notification.message.match(/(\d+(\.\d+)?)/)![0])} />
            }
        </Card>
    )
}

export default NotificationListItem
