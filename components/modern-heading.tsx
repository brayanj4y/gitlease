import type React from "react"
import { cn } from "@/lib/utils"

interface ModernHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  level?: 1 | 2 | 3
  glow?: boolean
}

export function ModernHeading({ children, className, level = 1, glow = false, ...props }: ModernHeadingProps) {
  const Component = level === 1 ? "h1" : level === 2 ? "h2" : "h3"

  const sizeClasses = {
    1: "text-3xl md:text-4xl",
    2: "text-xl md:text-2xl",
    3: "text-lg md:text-xl",
  }

  return (
    <Component
      className={cn(
        "font-bold",
        sizeClasses[level],
        glow && "text-[rgb(var(--accent-green))] drop-shadow-[0_0_8px_rgba(var(--accent-green),0.5)]",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
