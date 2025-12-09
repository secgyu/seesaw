"use client";

import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function AuthButton({ isLoading, children, className, ...props }: AuthButtonProps) {
  return (
    <button
      className={cn(
        "w-full bg-foreground text-background py-3 text-[11px] font-light tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border border-background/30 border-t-background rounded-full animate-spin" />
      ) : (
        <>
          {children}
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
