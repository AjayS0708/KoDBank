import React from "react";
import { cn } from "../../utils/cn.ts";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gradient";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
}) => {
  const variants = {
    default: "bg-white/5 border border-white/10",
    glass: "bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl",
    gradient: "bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/10 backdrop-blur-2xl",
  };

  return (
    <div className={cn("rounded-[32px] p-8", variants[variant], className)}>
      {children}
    </div>
  );
};
