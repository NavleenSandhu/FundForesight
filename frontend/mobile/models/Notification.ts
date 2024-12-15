export interface Notification {
    notificationId: number;
    userId: number;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    notificationType: "NEW_TRANSACTIONS" |
    "OVER_BUDGET_ALERT" |
    "LOW_BUDGET_WARNING" |
    "LARGE_TRANSACTION_ALERT" |
    "SALARY_RECEIVED" |
    "EXPENDITURE_REVIEW";
}