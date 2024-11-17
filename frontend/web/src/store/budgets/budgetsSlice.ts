import { Budget } from "@/models/Budget";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

export const fetchBudgets = createAsyncThunk('/budgets/getBudgets', async () => {
    const res = await fetch(`${GATEWAY_URL}/budgets`, {
        method: "GET",
        credentials: "include"
    })
    if (res.status === 200) {
        const budgets = await res.json();
        return budgets
    }
})

export const addBudget = createAsyncThunk('/budgets/addBudget', async (budget: Omit<Budget, 'budget_id' | 'user_id'>) => {
    const res = await fetch(`${GATEWAY_URL}/budgets`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(budget)
    })
    if (res.status === 201) {
        const data = await res.json()
        return data.budget as Budget
    }
})
export const editBudget = createAsyncThunk('/budgets/editBudget', async (budget: Budget) => {
    const res = await fetch(`${GATEWAY_URL}/budgets/${budget.budget_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(budget)
    })
    if (res.status === 200) {
        return budget
    }
})
export const deleteBudget = createAsyncThunk('/budgets/deleteBudget', async (budget_id: number) => {
    const res = await fetch(`${GATEWAY_URL}/budgets/${budget_id}`, {
        method: "DELETE",
        credentials: "include",
    })
    
    if (res.status === 204) {
        return budget_id
    } else { 
        const data = await res.json();
        console.log(data);
        
        throw Error(data.message);
    }
})

const budgetsSlice = createSlice({
    name: 'budgets',
    initialState: {
        budgets: [] as Budget[],
        error: "",
    },
    reducers: {
        removeError: (state) => { 
            state.error = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBudgets.fulfilled, (state, action: PayloadAction<Budget[]>) => {
                state.budgets = action.payload
            })
            .addCase(addBudget.fulfilled, (state, action: PayloadAction<Budget | undefined>) => {
                if (action.payload) {
                    state.budgets.push(action.payload)
                }
            })
            .addCase(editBudget.fulfilled, (state, action: PayloadAction<Budget | undefined>) => {
                if (action.payload) {
                    const updatedBudget = action.payload
                    state.budgets = state.budgets.map(budget =>
                        budget.budget_id === updatedBudget.budget_id ? updatedBudget : budget
                    )
                }
            })
            .addCase(deleteBudget.fulfilled, (state, action: PayloadAction<number | undefined>) => {
                if (action.payload) {

                    state.budgets = state.budgets.filter(budget => budget.budget_id !== action.payload!)
                }
            })
            .addCase(deleteBudget.rejected, (state, action) => { 
                state.error = action.error.message!; 
                console.log(action.error);
                
            })
    }
})
export const { removeError } = budgetsSlice.actions;
export const  budgetReducer  = budgetsSlice.reducer;