import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { getTokens, setTokens, clearTokens, isTokenExpired } from '@/lib/tokens';
import { matchMockRoute } from '@/services/mockApi';

declare module 'axios' {
    interface InternalAxiosRequestConfig {
        _mockResponse?: { status: number; data: unknown };
        _retry?: boolean;
    }
}

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const tokens = getTokens();
        if (tokens?.accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }

        const method = (config.method ?? 'GET').toUpperCase();
        const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
        const body = config.data as Record<string, string> | undefined;
        const mockResult = matchMockRoute(method, url, body);

        if (mockResult) {
            const response = await mockResult;
            config._mockResponse = response;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const config = error.config as InternalAxiosRequestConfig | undefined;

        if (config?._mockResponse) {
            const mock = config._mockResponse;
            if (mock.status >= 200 && mock.status < 300) {
                return { data: mock.data, status: mock.status, statusText: 'OK', headers: {}, config } as AxiosResponse;
            }
        }

        if (error.response?.status === 401 && config && !config._retry) {
            config._retry = true;
            const tokens = getTokens();

            if (tokens?.refreshToken) {
                try {
                    const refreshResult = matchMockRoute('POST', '/api/auth/refresh', {
                        refreshToken: tokens.refreshToken,
                    });

                    if (refreshResult) {
                        const refreshResponse = await refreshResult;
                        const newAccessToken = (refreshResponse.data as { accessToken: string }).accessToken;
                        setTokens({ accessToken: newAccessToken, refreshToken: tokens.refreshToken });

                        if (config.headers) {
                            config.headers.Authorization = `Bearer ${newAccessToken}`;
                        }
                        return api(config);
                    }
                } catch {
                    clearTokens();
                }
            }
        }

        return Promise.reject(error);
    }
);

const originalAdapter = api.defaults.adapter;

api.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
    if (config._mockResponse) {
        const mock = config._mockResponse;
        return {
            data: mock.data,
            status: mock.status,
            statusText: mock.status === 200 ? 'OK' : 'Error',
            headers: {},
            config,
        } as AxiosResponse;
    }

    if (typeof originalAdapter === 'function') {
        return originalAdapter(config);
    }
    throw new Error('No adapter available');
};

export default api;
