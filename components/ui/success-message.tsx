import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface SuccessMessageProps {
  title: string;
  description?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function SuccessMessage({
  title,
  description,
  icon: Icon = Check,
  className,
}: SuccessMessageProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <Icon className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h1 className="text-2xl font-extralight tracking-wide mb-4">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground font-light mb-8">{description}</p>
      )}
    </div>
  );
}
