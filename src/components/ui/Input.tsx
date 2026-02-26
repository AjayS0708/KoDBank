import React from "react";
import { cn } from "../../utils/cn.ts";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-2xl py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-white/10",
            icon ? "pl-12 pr-4" : "px-4",
            error && "border-red-500/50 focus:ring-red-500/20 focus:border-red-500",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
    </div>
  );
};
