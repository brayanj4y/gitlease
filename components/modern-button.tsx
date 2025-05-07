"use client"

import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "outline" | "ghost"
}

export const ModernButton = forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, size = "md", variant = "primary", children, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
    }

    const variantClasses = {
      primary: "bg-[rgb(var(--accent-green))] hover:bg-[rgb(var(--accent-green-dark))] text-white",
      secondary: "bg-[rgb(var(--accent-gray))] hover:bg-[rgba(var(--accent-gray),0.8)] text-white",
      outline:
        "bg-transparent border border-[rgb(var(--accent-green))] text-[rgb(var(--accent-green))] hover:bg-[rgba(var(--accent-green),0.1)]",
      ghost: "bg-transparent text-[rgb(var(--accent-green))] hover:bg-[rgba(var(--accent-green),0.1)]",
    }

    return (
      <button
        className={cn(
          "relative font-medium rounded-md transition-all duration-200",
          "transform hover:-translate-y-0.5 active:translate-y-0",
          "focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-green))] focus:ring-opacity-50",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)

ModernButton.displayName = "ModernButton"
