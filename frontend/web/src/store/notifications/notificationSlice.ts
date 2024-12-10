import { Notification } from '@/models/Notification';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async () => {
        const response = await fetch(`${GATEWAY_URL}/notifications`, {
            credentials: 'include',
        });
        if (response.status === 200) {
            const notifications = await response.json();
            return notifications;
        }
        throw new Error('Failed to fetch notifications');
    }
);

export const deleteNotification = createAsyncThunk(
    'notifications/deleteNotification',
    async (notificationId: number) => {
        const response = await fetch(`${GATEWAY_URL}/notifications/${notificationId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.status === 204) {
            return notificationId;
        }
        throw new Error('Failed to delete notification');
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [] as Notification[],
        loading: false,
        error: "",
    },
    reducers: {
        removeNotificationError: (state) => {
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
                state.loading = false;
                state.error = "";
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message!;
            })
            .addCase(deleteNotification.fulfilled, (state, action: PayloadAction<number>) => {
                state.notifications = state.notifications.filter((notification) => notification.notificationId !== action.payload);
                state.error = "";
            })
            .addCase(deleteNotification.rejected, (state, action) => {
                state.error = action.error.message!;
            });
    },
});

export const { removeNotificationError } = notificationSlice.actions
export const notificationsReducer = notificationSlice.reducer