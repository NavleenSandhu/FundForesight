import { SavingGoal } from "@/models/SavingGoal";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;


export const fetchSavingGoals = createAsyncThunk('/savings/getSavingGoals', async () => {
    const res = await fetch(`${GATEWAY_URL}/savings`, {
        method: "GET",
        credentials: "include",
    });
    if (res.status === 200) {
        const data = await res.json();
        return data.savings as SavingGoal[];
    }
});

export const addSavingGoal = createAsyncThunk('/savings/addSavingGoal', async (savingGoal: Omit<SavingGoal, 'goalId' | 'userId'>) => {
    const res = await fetch(`${GATEWAY_URL}/savings`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify([savingGoal])
    });
    if (res.status === 201) {
        const data = await res.json();
        return data;
    }
});


export const editSavingGoal = createAsyncThunk('/savings/editSavingGoal', async (savingGoal: SavingGoal) => {
    const res = await fetch(`${GATEWAY_URL}/savings/${savingGoal.goalId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(savingGoal),
    });
    if (res.status === 200) {
        return savingGoal;
    }
});

export const deleteSavingGoal = createAsyncThunk('/savings/deleteSavingGoal', async (goalId: number) => {
    const res = await fetch(`${GATEWAY_URL}/savings/${goalId}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (res.status === 204) {
        return goalId;
    } else {
        const data = await res.json();
        throw new Error(data.message);
    }
});


const savingGoalsSlice = createSlice({
    name: 'savingGoals',
    initialState: {
        savingGoals: [] as SavingGoal[],
        error: "",
    },
    reducers: {
        removeError: (state) => {
            state.error = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSavingGoals.fulfilled, (state, action: PayloadAction<SavingGoal[] | undefined>) => {
                if (action.payload) {
                    state.savingGoals = action.payload;
                }
            })
            .addCase(addSavingGoal.fulfilled, (state, action: PayloadAction<SavingGoal | SavingGoal[] | undefined>) => {
                if (action.payload) {
                    state.savingGoals = state.savingGoals.concat(action.payload);
                }
            })
            .addCase(editSavingGoal.fulfilled, (state, action: PayloadAction<SavingGoal | undefined>) => {
                if (action.payload) {
                    const updatedSavingGoal = action.payload;
                    state.savingGoals = state.savingGoals.map(goal =>
                        goal.goalId === updatedSavingGoal.goalId ? updatedSavingGoal : goal
                    );
                }
            })
            .addCase(deleteSavingGoal.fulfilled, (state, action: PayloadAction<number | undefined>) => {
                if (action.payload) {
                    state.savingGoals = state.savingGoals.filter(goal => goal.goalId !== action.payload);
                }
            })
            .addCase(deleteSavingGoal.rejected, (state, action) => {
                state.error = action.error.message!;
            });
    },
});

export const { removeError } = savingGoalsSlice.actions;
export const savingGoalsReducer = savingGoalsSlice.reducer;