'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/useAuth';
import { fadeInUp, cardVariant } from '@/utils/animations';

export default function LoginPage() {
    const { login, isLoggingIn, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('john@pulsetrack.demo');
    const [password, setPassword] = useState('demo1234');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // If already authenticated, the useAuth hook will redirect
    if (isAuthenticated) {
        return null;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        try {
            await login(email, password);
        } catch {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
                className="w-full max-w-md"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
            >
                <motion.div className="glass-card p-8 sm:p-10" variants={cardVariant}>
                    {/* Logo / Brand */}
                    <div className="mb-8 text-center">
                        <div className="mb-3 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" className="shrink-0 text-brand-500">
                                <g fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.91">
                                    <path d="M14.86,13h-.95l-1-1.91-1.9,3.82L9.14,10.11,7.23,13H3.41l-.33-.33A5.4,5.4,0,1,1,10.72,5L12,6.3,13.28,5a5.4,5.4,0,1,1,7.64,7.63l-.33.33L12,21.57,6.07,15.64" />
                                    <line x1="15.82" y1="12.98" x2="17.73" y2="12.98" />
                                </g>
                            </svg>
                            <h1 className="text-2xl font-bold">
                                <span className="text-gradient">PulseTrack</span>
                            </h1>
                        </div>
                        <p className="text-sm text-text-secondary">
                            Real-Time Health Analytics
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Error message */}
                        {error && (
                            <motion.div
                                className="rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-text-secondary"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@pulsetrack.demo"
                                autoComplete="email"
                                className="h-12 rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] px-4 text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-text-secondary"
                            >
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full h-12 rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] px-4 pr-12 text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                                            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                                            <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                                            <path d="m2 2 20 20" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="mt-2 flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:from-brand-400 hover:to-brand-500 hover:shadow-brand-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoggingIn ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="h-5 w-5 animate-spin"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Signing in…
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Demo hint */}
                    <p className="mt-6 text-center text-xs text-text-muted">
                        Demo: any email &amp; password works
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
