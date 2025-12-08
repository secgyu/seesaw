import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectVariants = cva(
  "w-full font-light transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "border border-black/20 focus:border-black bg-white",
        ghost: "border-0 border-b border-black/20 focus:border-black bg-transparent rounded-none",
        filled: "border border-black/10 bg-muted/50 focus:border-black focus:bg-white",
      },
      selectSize: {
        default: "px-4 py-3 text-sm",
        sm: "px-3 py-2 text-xs",
        lg: "px-5 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      selectSize: "default",
    },
  }
);

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, selectSize, error, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          selectVariants({ variant, selectSize }),
          error && "border-red-500 focus:border-red-500",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select, selectVariants };
