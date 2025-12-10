import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface SuccessAlertProps {
  message: string;
  className?: string;
}

export function SuccessAlert({ message, className }: SuccessAlertProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm flex items-center gap-2",
        className
      )}
    >
      <Check className="w-4 h-4 shrink-0" />
      {message}
    </div>
  );
}
