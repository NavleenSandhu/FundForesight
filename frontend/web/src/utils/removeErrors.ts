import { removeBudgetError } from "@/store/budgets/budgetsSlice";
import { removeSavingError } from "@/store/savingGoals/savingGoalsSlice";
import { Dispatch } from "@reduxjs/toolkit";


export function removeAllErrors(dispatch:Dispatch) { 
    dispatch(removeBudgetError());
    dispatch(removeSavingError());
}