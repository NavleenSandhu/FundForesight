import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { transactionsReducer } from './transactions/transactionsSlice';
import { budgetReducer } from './budgets/budgetsSlice';
import { savingGoalsReducer } from './savingGoals/savingGoalsSlice';
import { profilesReducer } from './profile/profileSlice';
import { notificationsReducer } from './notifications/notificationsSlice';

const rootReducer = combineReducers({
    transactions: transactionsReducer,
    budgets: budgetReducer,
    savingGoals: savingGoalsReducer,
    profile: profilesReducer,
    notifications: notificationsReducer
})

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch