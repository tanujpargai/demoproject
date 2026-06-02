import React from 'react';
import { User } from 'lucide-react';

/**
 * Reusable Avatar component.
 * Shows the avatar image if available, otherwise falls back to user initials
 * derived from full_name or email, or a generic icon if nothing is available.
 */
export const Avatar = ({
  src,
  name,
  email,
  size = 'md',
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
    '2xl': 'w-32 h-32 text-4xl',
  };

  const initials = React.useMemo(() => {
    if (name && name.trim()) {
      return name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    if (email) return email[0].toUpperCase();
    return null;
  }, [name, email]);

  const baseClass = `relative flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden ${sizeClasses[size] || sizeClasses.md} ${onClick ? 'cursor-pointer' : ''} ${className}`;

  if (src) {
    return (
      <div className={baseClass} onClick={onClick}>
        <img
          src={src}
          alt={name || email || 'avatar'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials on broken image
            e.target.style.display = 'none';
            e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
          }}
        />
        {/* Hidden fallback */}
        <div
          className="absolute inset-0 items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700 text-white font-bold hidden"
        >
          {initials || <User className="w-1/2 h-1/2" />}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${baseClass} bg-gradient-to-br from-violet-600 to-indigo-700 text-white font-bold`}
      onClick={onClick}
    >
      {initials || <User className="w-1/2 h-1/2" />}
    </div>
  );
};

export default Avatar;
