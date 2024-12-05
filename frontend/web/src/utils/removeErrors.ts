import { removeBudgetError } from "@/store/budgets/budgetsSlice";
import { removeSavingError } from "@/store/savingGoals/savingGoalsSlice";
import { removeTransactionError } from "@/store/transactions/transactionsSlice";
import { Dispatch } from "@reduxjs/toolkit";


export function removeAllErrors(dispatch:Dispatch) { 
    dispatch(removeBudgetError());
    dispatch(removeSavingError());
    dispatch(removeTransactionError());
}