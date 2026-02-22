import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, UserProfile } from '@/features/health/healthTypes';

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /** Set auth credentials after successful login. */
        setCredentials(
            state,
            action: PayloadAction<{
                user: UserProfile;
                accessToken: string;
                refreshToken: string;
            }>
        ) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
        },

        /** Update only the access token (after refresh). */
        setAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
        },

        /** Clear all auth state (logout). */
        logout(state) {
            Object.assign(state, initialState);
        },
    },
});

export const { setCredentials, setAccessToken, logout } = authSlice.actions;

export default authSlice.reducer;


export const selectUser = (state: { auth: AuthState }) => state.auth.user;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
    state.auth.isAuthenticated;

export const selectAccessToken = (state: { auth: AuthState }) =>
    state.auth.accessToken;

export const selectRefreshToken = (state: { auth: AuthState }) =>
    state.auth.refreshToken;
