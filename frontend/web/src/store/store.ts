import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Persistor, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { budgetReducer } from './budgets/budgetsSlice';
import { savingGoalsReducer } from './savingGoals/savingGoalsSlice';
import { transactionsReducer } from './transactions/transactionsSlice';
import { profilesReducer } from './profiles/profilesSlice';
import { notificationsReducer } from './notifications/notificationSlice'


const rootReducer = combineReducers({
    budgets: budgetReducer,
    transactions: transactionsReducer,
    savingGoals: savingGoalsReducer,
    profile: profilesReducer,
    notifications: notificationsReducer,
});


const persistConfig = {
    key: "root",
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor: Persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
