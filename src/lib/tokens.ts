import { TOKEN_EXPIRY } from '@/utils/constants';

const STORAGE_KEYS = {
    accessToken: 'pulsetrack_access_token',
    refreshToken: 'pulsetrack_refresh_token',
    tokenTimestamp: 'pulsetrack_token_ts',
} as const;

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

/** Save both tokens to localStorage with a timestamp. */
export function setTokens(tokens: TokenPair): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
    localStorage.setItem(STORAGE_KEYS.tokenTimestamp, Date.now().toString());
}

/** Retrieve tokens from localStorage. */
export function getTokens(): TokenPair | null {
    if (typeof window === 'undefined') return null;
    const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken };
}

/** Clear all tokens from localStorage. */
export function clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.tokenTimestamp);
}

/** Check if the access token has expired. */
export function isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;
    const ts = localStorage.getItem(STORAGE_KEYS.tokenTimestamp);
    if (!ts) return true;
    return Date.now() - parseInt(ts, 10) > TOKEN_EXPIRY.access;
}

/** Generate a fake JWT-like token string. */
export function generateFakeToken(type: 'access' | 'refresh'): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
        JSON.stringify({
            sub: 'usr_001',
            type,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(
                (Date.now() + (type === 'access' ? TOKEN_EXPIRY.access : TOKEN_EXPIRY.refresh)) /
                1000
            ),
        })
    );
    const signature = btoa(`fake_sig_${Date.now()}`);
    return `${header}.${payload}.${signature}`;
}
