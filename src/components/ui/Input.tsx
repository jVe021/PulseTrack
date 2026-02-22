'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = '', id, ...rest }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`h-11 w-full rounded-xl border bg-[var(--color-glass-bg)] px-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all ${icon ? 'pl-10' : ''
                            } ${error
                                ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
                                : 'border-[var(--color-glass-border)] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                            } ${className}`}
                        {...rest}
                    />
                </div>
                {error && (
                    <p className="text-xs text-danger">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
