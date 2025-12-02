import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 overflow-x-auto">
      <ol className="flex items-center gap-2 text-sm font-light whitespace-nowrap">
        <li className="flex-shrink-0">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <span className="hidden sm:inline">Home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2 flex-shrink-0">
            <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors max-w-[120px] sm:max-w-none truncate"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground max-w-[150px] sm:max-w-none truncate">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
