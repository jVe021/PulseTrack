'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';

interface AnimatedNumberProps {
    value: number;
    duration?: number;
    formatter?: (value: number) => string;
    className?: string;
}

export function AnimatedNumber({
    value,
    duration = 0.8,
    formatter = (v) => Math.round(v).toString(),
    className = '',
}: AnimatedNumberProps) {
    const motionValue = useMotionValue(0);
    const spring = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
        duration,
    });
    const display = useTransform(spring, (latest) => formatter(latest));
    const [displayValue, setDisplayValue] = useState(formatter(0));
    const prevValue = useRef(0);

    useEffect(() => {
        motionValue.set(value);
        prevValue.current = value;
    }, [value, motionValue]);

    useEffect(() => {
        const unsubscribe = display.on('change', (latest) => {
            setDisplayValue(latest);
        });
        return unsubscribe;
    }, [display]);

    return (
        <motion.span className={className}>
            {displayValue}
        </motion.span>
    );
}
