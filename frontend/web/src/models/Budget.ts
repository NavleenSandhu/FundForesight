export interface Budget {
    budget_id: number,
    user_id: number,
    category_name: string,
    initial_amount: number,
    remaining_amount: number,
    start_date: Date,
    end_date: Date,
}