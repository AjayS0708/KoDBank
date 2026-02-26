import React from "react";
import { cn } from "../../utils/cn.ts";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  ...props
}) => {
  const variants = {
    primary: "bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10",
    ghost: "text-white/60 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={cn(
        "rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};
