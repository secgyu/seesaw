"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-[10px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-0 py-2 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
