import type { HealthRecord } from '@/features/health/healthTypes';
import { generateHistoricalData, generateVitalSigns } from '@/utils/generators';
import { MOCK_USER } from '@/utils/constants';
import { generateFakeToken } from '@/lib/tokens';
import type { UserProfile } from '@/features/health/healthTypes';



function delay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200));
}



let cachedHistoricalData: HealthRecord[] | null = null;

function getHistoricalRecords(days: number): HealthRecord[] {
    if (!cachedHistoricalData) {
        cachedHistoricalData = generateHistoricalData(days);
    }
    return cachedHistoricalData;
}


export interface MockResponse<T = unknown> {
    status: number;
    data: T;
}

/** POST /auth/login — returns fake JWT tokens + user profile. */
export async function mockLogin(
    email: string,
    _password: string
): Promise<MockResponse<{ user: UserProfile; accessToken: string; refreshToken: string }>> {
    await delay(500);

    if (!email) {
        return { status: 401, data: { user: { ...MOCK_USER } as UserProfile, accessToken: '', refreshToken: '' } };
    }

    const user: UserProfile = { ...MOCK_USER, email };
    return {
        status: 200,
        data: {
            user,
            accessToken: generateFakeToken('access'),
            refreshToken: generateFakeToken('refresh'),
        },
    };
}

/** POST /auth/refresh — returns a new access token. */
export async function mockRefresh(
    _refreshToken: string
): Promise<MockResponse<{ accessToken: string }>> {
    await delay(200);
    return {
        status: 200,
        data: { accessToken: generateFakeToken('access') },
    };
}

/** GET /health/history?days=N — returns historical health records. */
export async function mockGetHealthHistory(
    days: number = 7
): Promise<MockResponse<{ records: HealthRecord[] }>> {
    await delay(600);
    const records = getHistoricalRecords(days);
    return {
        status: 200,
        data: { records },
    };
}

/** GET /health/latest — returns the latest vital signs reading. */
export async function mockGetLatestVitals(): Promise<
    MockResponse<{ vitals: ReturnType<typeof generateVitalSigns> }>
> {
    await delay(150);
    return {
        status: 200,
        data: { vitals: generateVitalSigns() },
    };
}


interface RouteMatch {
    method: string;
    pattern: RegExp;
    handler: (params: Record<string, string>, body?: Record<string, string>) => Promise<MockResponse>;
}

const routes: RouteMatch[] = [
    {
        method: 'POST',
        pattern: /\/auth\/login$/,
        handler: async (_params, body) =>
            mockLogin(body?.email ?? '', body?.password ?? ''),
    },
    {
        method: 'POST',
        pattern: /\/auth\/refresh$/,
        handler: async (_params, body) =>
            mockRefresh(body?.refreshToken ?? ''),
    },
    {
        method: 'GET',
        pattern: /\/health\/history/,
        handler: async (params) =>
            mockGetHealthHistory(parseInt(params.days ?? '7', 10)),
    },
    {
        method: 'GET',
        pattern: /\/health\/latest$/,
        handler: async () => mockGetLatestVitals(),
    },
];

/** Match a URL + method to a mock handler. Returns null if no match. */
export function matchMockRoute(
    method: string,
    url: string,
    body?: Record<string, string>
): Promise<MockResponse> | null {
    const [pathname, queryString] = url.split('?');
    const params: Record<string, string> = {};
    if (queryString) {
        queryString.split('&').forEach((pair) => {
            const [key, value] = pair.split('=');
            params[key] = decodeURIComponent(value);
        });
    }

    for (const route of routes) {
        if (route.method === method.toUpperCase() && route.pattern.test(pathname)) {
            return route.handler(params, body);
        }
    }
    return null;
}
