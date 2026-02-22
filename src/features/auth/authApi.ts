import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UserProfile } from '@/features/health/healthTypes';
import { mockLogin } from '@/services/mockApi';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    user: UserProfile;
    accessToken: string;
    refreshToken: string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        /** Login with email and password. Returns user + token pair. */
        login: builder.mutation<LoginResponse, LoginRequest>({
            queryFn: async ({ email, password }) => {
                try {
                    const response = await mockLogin(email, password);
                    if (response.status !== 200 || !response.data.accessToken) {
                        return { error: { status: 401, data: 'Invalid credentials' } };
                    }
                    return { data: response.data };
                } catch (error) {
                    return { error: { status: 500, data: String(error) } };
                }
            },
        }),
    }),
});

export const { useLoginMutation } = authApi;
