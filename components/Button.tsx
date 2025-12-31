import React from 'react';
import { Icon } from '@iconify/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
  icon?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  icon = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium transition-all duration-300 rounded-full group font-display tracking-wide text-[15px]";
  
  const variants = {
    primary: "bg-black text-white hover:bg-neutral-800 shadow-xl hover:shadow-2xl hover:-translate-y-0.5",
    outline: "bg-transparent text-brand-text border border-neutral-300 hover:border-black hover:bg-neutral-50",
    ghost: "bg-transparent text-brand-muted hover:text-black"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon && (
          <Icon icon="solar:arrow-right-linear" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </span>
    </button>
  );
};

export default Button;