import React from 'react';
import { ChevronDown } from 'lucide-react';
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: {
    value: string;
    label: string;
  }[];
}
export function Select({
  label,
  error,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      }
      <div className="relative">
        <select
          className={`w-full px-4 py-2.5 rounded-lg glass-input appearance-none cursor-pointer transition-all duration-200 ${error ? 'border-red-500/50' : ''} ${className}`}
          {...props}>

          {options.map((option) =>
          <option
            key={option.value}
            value={option.value}
            className="bg-[#1a1a1a] text-white">

              {option.label}
            </option>
          )}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>);

}