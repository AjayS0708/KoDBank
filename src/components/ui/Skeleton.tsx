import React from "react";
import { cn } from "../../utils/cn.ts";

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("animate-pulse bg-white/5 rounded-xl", className)} />
  );
};
