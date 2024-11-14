import { configureStore } from '@reduxjs/toolkit'
import transactionsReducer from './transactions/transactionsSlice';
import budgetReducer from './budgets/budgetsSlice'
export const store = configureStore({
    reducer: {
        transactions: transactionsReducer,
        budgets: budgetReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
