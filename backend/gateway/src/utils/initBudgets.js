const { startOfMonth, endOfMonth } = require('date-fns');
const { createUserBudget } = require('../services/budgetService');

const initBudgets = async (token) => {
    const now = Date.now();
    const budgets = [
        {
            category_name: 'Other',
            initial_amount: 500,
            remaining_amount: 500,
            start_date: startOfMonth(now),
            end_date: endOfMonth(now)
        },
        {
            category_name: 'Groceries',
            initial_amount: 500,
            remaining_amount: 500,
            start_date: startOfMonth(now),
            end_date: endOfMonth(now)
        },
        {
            category_name: 'Rent',
            initial_amount: 700,
            remaining_amount: 700,
            start_date: startOfMonth(now),
            end_date: endOfMonth(now)
        }
    ]
    for (const budget of budgets) {
        await createUserBudget(token, budget);
    }
}

module.exports = { initBudgets }