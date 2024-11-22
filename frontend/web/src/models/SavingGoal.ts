export interface SavingGoal {
    goalId: number;
    userId: number;
    goalName: string;
    targetAmount: number;
    currentAmount: number;
    startDate: Date;
    endDate: Date;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}