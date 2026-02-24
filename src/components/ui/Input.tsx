import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      }
      <input
        className={`w-full px-4 py-2.5 rounded-lg glass-input transition-all duration-200 placeholder-gray-500 ${error ? 'border-red-500/50 focus:border-red-500' : ''} ${className}`}
        {...props} />

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>);

}