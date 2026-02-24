import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}
export function Card({
  children,
  className = '',
  title,
  description
}: CardProps) {
  return (
    <div className={`glass-card rounded-2xl p-6 ${className}`}>
      {(title || description) &&
      <div className="mb-6">
          {title &&
        <h3 className="text-xl font-serif font-semibold text-white">
              {title}
            </h3>
        }
          {description &&
        <p className="text-sm text-gray-400 mt-1">{description}</p>
        }
        </div>
      }
      {children}
    </div>);

}