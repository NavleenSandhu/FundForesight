import { Budget } from "@/models/Budget";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;
export const fetchBudgets = createAsyncThunk('/budgets/getBudgets', async () => {
    const res = await fetch(`${GATEWAY_URL}/budgets`, {
        method: "GET",
        credentials: "include"
    })
    const data = await res.json()
    if (res.status === 200) {
        const budgets = data;
        return budgets
    } else if (res.status === 401) {
        throw new Error("Unauthorized")
    }
    throw new Error("An error occurred while fetching budgets.")
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
    const data = await res.json()
    if (res.status === 201) {
        return data.budget as Budget
    }
    throw new Error(data.message)
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
    const data = await res.json()
    throw new Error(data.message)
})
export const deleteBudget = createAsyncThunk('/budgets/deleteBudget', async (budget_id: number) => {
    const res = await fetch(`${GATEWAY_URL}/budgets/${budget_id}`, {
        method: "DELETE",
        credentials: "include",
    })

    if (res.status === 204) {
        return budget_id
    }
    const data = await res.json()
    throw new Error(data.message)
})

const budgetsSlice = createSlice({
    name: 'budgets',
    initialState: {
        budgets: [] as Budget[],
        loading: false,
        error: "",
    },
    reducers: {
        removeBudgetError: (state) => {
            state.error = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBudgets.fulfilled, (state, action: PayloadAction<Budget[]>) => {
                state.budgets = action.payload
                state.error = ""
                state.loading = false
            })
            .addCase(fetchBudgets.rejected, (state, action) => {
                state.error = action.error.message || "Failed to fetch Budgets"
                state.loading = false
            })
            .addCase(fetchBudgets.pending, (state) => {
                state.loading = true
            })
            .addCase(addBudget.fulfilled, (state, action: PayloadAction<Budget | undefined>) => {
                if (action.payload) {
                    state.budgets.push(action.payload)
                }
                state.error = ""
            }).addCase(addBudget.rejected, (state, action) => {
                state.error = action.error.message || "Failed to add budget";
            })
            .addCase(editBudget.fulfilled, (state, action: PayloadAction<Budget | undefined>) => {
                if (action.payload) {
                    const updatedBudget = action.payload
                    state.budgets = state.budgets.map(budget =>
                        budget.budget_id === updatedBudget.budget_id ? updatedBudget : budget
                    )
                }
                state.error = ""
            }).addCase(editBudget.rejected, (state, action) => {
                state.error = action.error.message || "Failed to edit budget";
            })
            .addCase(deleteBudget.fulfilled, (state, action: PayloadAction<number | undefined>) => {
                if (action.payload) {
                    state.budgets = state.budgets.filter(budget => budget.budget_id !== action.payload!)
                }
                state.error = ""
            })
            .addCase(deleteBudget.rejected, (state, action) => {
                state.error = action.error.message!;
                console.log(action.error);
            })
    }
})
export const { removeBudgetError } = budgetsSlice.actions;
export const budgetReducer = budgetsSlice.reducer;