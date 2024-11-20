import { Transaction } from "@/models/Transaction";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;
export const fetchTransactions = createAsyncThunk('/transactions/fetchTransactions', async () => {
    try {
        const res = await fetch(`${GATEWAY_URL}/transaction`, {
            method: 'GET',
            credentials: "include"
        })
        if (res.status === 200) {
            const data = await res.json()
            return data.transactions
        }
    } catch (error: unknown) {
        console.error(error);
    }
});

export const updateTransaction = createAsyncThunk('/transactions/updateTransaction', async (transaction: Transaction) => {
    try {
        const res = await fetch(`${GATEWAY_URL}/transaction/${transaction.transactionId}`, {
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
    } catch (error: unknown) {
        console.error(error);
    }
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
        balance: 0
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
                state.transactions = action.payload;
            })
            .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction | undefined>) => {
                const transaction = action.payload;
                if (transaction) {
                    state.transactions = state.transactions.map(t => t.transactionId === transaction.transactionId ? transaction : t);
                }
            })
            .addCase(fetchBalance.fulfilled, (state, action: PayloadAction<number>) => {
                state.balance = action.payload
            })
    }
})

export const transactionsReducer = transactionsSlice.reducer;