import type React from "react"
import { cn } from "@/lib/utils"

interface BrutalistHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  level?: 1 | 2 | 3
  variant?: "blue" | "red" | "yellow" | "green"
}

export function BrutalistHeading({
  children,
  className,
  level = 1,
  variant = "blue",
  ...props
}: BrutalistHeadingProps) {
  const Component = level === 1 ? "h1" : level === 2 ? "h2" : "h3"

  const sizeClasses = {
    1: "text-5xl",
    2: "text-3xl",
    3: "text-xl",
  }

  const variantClasses = {
    blue: "bg-white text-[rgb(var(--google-blue))] border-[rgb(var(--google-blue))]",
    red: "bg-white text-[rgb(var(--google-red))] border-[rgb(var(--google-red))]",
    yellow: "bg-white text-[rgb(var(--google-yellow))] border-[rgb(var(--google-yellow))]",
    green: "bg-white text-[rgb(var(--google-green))] border-[rgb(var(--google-green))]",
  }

  const shadowColors = {
    blue: "bg-[rgba(var(--google-blue),0.3)]",
    red: "bg-[rgba(var(--google-red),0.3)]",
    yellow: "bg-[rgba(var(--google-yellow),0.3)]",
    green: "bg-[rgba(var(--google-green),0.3)]",
  }

  return (
    <div className="relative inline-block">
      <Component
        className={cn(
          "font-mono font-bold relative z-10",
          "px-4 py-2 border-4",
          variantClasses[variant],
          sizeClasses[level],
          className,
        )}
        {...props}
      >
        {children}
      </Component>
      <div className={cn("absolute inset-0 translate-x-2 translate-y-2", shadowColors[variant])}></div>
    </div>
  )
}
