import { Transaction } from "@/models/Transaction";
import { displayDate } from "@/utils/dateUtils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { endOfMonth, startOfMonth } from "date-fns";

const GATEWAY_URL = process.env.EXPO_PUBLIC_GATEWAY_URL;
export const fetchTransactions = createAsyncThunk('/transactions/fetchTransactions', async () => {
    try {
        const now = new Date();
        const res = await fetch(`${GATEWAY_URL}/transactions?startDate=${displayDate(startOfMonth(now))}&endDate=${endOfMonth(now).toISOString().split("T")[0]}`, {
            method: 'GET',
            credentials: "include"
        })
        if (res.status === 200) {
            const data = await res.json()
            return data.transactions
        }
        else {
            throw new Error("An error occurred while fetching transactions.")
        }
    } catch (error: unknown) {
        console.error(error);
        throw error
    }
});

export const addTransaction = createAsyncThunk('/transactions/addTransaction', async (transaction: Omit<Transaction, 'transactionId' | 'userId'>) => {
    const res = await fetch(`${GATEWAY_URL}/transactions`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify([transaction])
    })
    if (res.status === 201) {
        const transactions = await res.json();
        return transactions;
    }
    throw new Error("An error occurred while adding the transaction.");
});

export const updateTransaction = createAsyncThunk('/transactions/updateTransaction', async (transaction: Transaction) => {
    const res = await fetch(`${GATEWAY_URL}/transactions/${transaction.transactionId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(transaction)
    })
    if (res.status === 200) {
        return transaction
    }
    throw new Error("An error occurred while updating the transaction.");

})

export const fetchBalance = createAsyncThunk('/transactions/getBalance', async () => {
    try {
        const res = await fetch(`${GATEWAY_URL}/plaidAccounts/balance`, {
            method: 'GET',
            credentials: "include"
        })
        if (res.status === 200) {
            const data = await res.json()
            return data.balance
        }
    } catch (error: unknown) {
        console.error(error);
    }
})

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState: {
        transactions: [] as Transaction[],
        loading: false,
        error: "",
        balance: 0,
        total30DayIncome: 0,
        total30DayExpense: 0
    },
    reducers: {
        removeTransactionError: (state) => {
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
                const transactions = action.payload;
                state.transactions = transactions;
                state.total30DayIncome = transactions.reduce<number>((totalIncome, transaction) => {
                    if (transaction.transactionType === "INCOME") {
                        totalIncome += transaction.amount;
                    }
                    return totalIncome
                }, 0);
                state.total30DayExpense = transactions.reduce<number>((totalExpense, transaction) => {
                    if (transaction.transactionType === "EXPENSE") {
                        totalExpense += transaction.amount;

                    }
                    return totalExpense
                }, 0);
                state.error = ""
                state.loading = false
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.error = action.error.message!;
                state.loading = false
            })
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true
            })
            .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
                state.transactions = state.transactions.concat(action.payload)
            })
            .addCase(addTransaction.rejected, (state, action) => {
                state.error = action.error.message!
            })
            .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction | undefined>) => {
                const transaction = action.payload;
                if (transaction) {
                    state.transactions = state.transactions.map(t => t.transactionId === transaction.transactionId ? transaction : t);
                }
            }).addCase(updateTransaction.rejected, (state, action) => {
                state.error = action.error.message || "failed to update transactions";
            })
            .addCase(fetchBalance.fulfilled, (state, action: PayloadAction<number | undefined>) => {
                if (action.payload) {
                    state.balance = action.payload
                }
            }).addCase(fetchBalance.rejected, (state, action) => {
                state.error = action.error.message || "failed to fetch Balance";
            })
    }
})

export const { removeTransactionError } = transactionsSlice.actions;
export const transactionsReducer = transactionsSlice.reducer;