export interface Transaction {
    transactionId: number;
    userId: number;
    budgetId: number;
    amount: number;
    merchantName: string;
    transactionDate: Date;
    transactionType: 'EXPENSE' | 'INCOME';
}
