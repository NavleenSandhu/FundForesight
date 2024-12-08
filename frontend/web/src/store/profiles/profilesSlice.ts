import { Profile } from "@/models/Profile";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

export const fetchProfile = createAsyncThunk('/profiles', async () => {
    const res = await fetch(`${GATEWAY_URL}/profiles`, {
        method: "GET",
        credentials: "include",
    });
    if (res.status === 200) {
        const data = await res.json();
        return data.profile as Profile;
    }
    throw new Error("Could not fetch preferences")
})

export const addProfile = createAsyncThunk('/profiles/add', async (countryCode: string) => {
    const res = await fetch(`${GATEWAY_URL}/profiles`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ countryCode }),
    });
    if (res.status === 201) {
        const profile = await res.json();
        return profile as Profile;
    }
    throw new Error("Could not add profile preferences")
})
export const editProfile = createAsyncThunk('/profiles/edit', async (profile: Profile) => {
    const res = await fetch(`${GATEWAY_URL}/profiles/${profile.preferenceId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
    });
    if (res.status === 200) {
        return profile;
    }
    throw new Error("Could not edit preference")
})

const profilesSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: {} as Profile,
        loading: false,
        error: ""
    },
    reducers: {
        removeProfileError: (state) => {
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile | undefined>) => {
                state.profile = action.payload!
                state.error = ""
                state.loading = false
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.error = action.error.message!
                state.loading = false
            })
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true
            })
            .addCase(addProfile.fulfilled, (state, action: PayloadAction<Profile | undefined>) => {
                state.profile = action.payload!
            })
            .addCase(addProfile.rejected, (state, action) => {
                state.error = action.error.message!
            })
            .addCase(editProfile.fulfilled, (state, action: PayloadAction<Profile | undefined>) => {
                state.profile = action.payload!
            })
            .addCase(editProfile.rejected, (state, action) => {
                state.error = action.error.message!
            })
    }
})

export const { removeProfileError } = profilesSlice.actions
export const profilesReducer = profilesSlice.reducer