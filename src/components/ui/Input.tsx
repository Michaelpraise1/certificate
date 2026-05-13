import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
        <input
          ref={ref}
          className={`flex h-11 w-full rounded-md border border-gray-300 bg-white dark:bg-zinc-900 dark:border-zinc-800 px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-colors ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
