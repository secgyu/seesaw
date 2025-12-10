"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  variant?: "dark" | "light";
  width?: number;
  height?: number;
}

export function Logo({
  className,
  href = "/",
  variant = "dark",
  width = 80,
  height = 14,
}: LogoProps) {
  const src = variant === "dark" ? "/logo.svg" : "/logo-white.svg";

  const logoContent = (
    <Image
      src={src}
      alt="SEESAW"
      width={width}
      height={height}
      className={cn("object-contain", className)}
      priority
    />
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
