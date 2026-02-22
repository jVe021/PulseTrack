'use client';

import { useState, useEffect, useRef } from 'react';

export function useThrottledValue<T>(value: T, delay = 500): T {
    const [throttled, setThrottled] = useState(value);
    const lastUpdated = useRef(0);

    useEffect(() => {
        const now = Date.now();
        const elapsed = lastUpdated.current === 0 ? delay : now - lastUpdated.current;

        let id: ReturnType<typeof setTimeout>;

        if (elapsed >= delay) {
            id = setTimeout(() => setThrottled(value), 0);
            lastUpdated.current = now;
        } else {
            id = setTimeout(() => {
                setThrottled(value);
                lastUpdated.current = Date.now();
            }, delay - elapsed);
        }

        return () => clearTimeout(id);
    }, [value, delay]);

    return throttled;
}
