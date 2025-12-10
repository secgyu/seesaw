import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function Spinner({ size = "sm", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        sizes[size],
        "border border-current/30 border-t-current rounded-full animate-spin",
        className
      )}
    />
  );
}
