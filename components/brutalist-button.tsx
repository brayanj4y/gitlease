"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface BrutalistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"
  variant?: "blue" | "red" | "yellow" | "green"
}

export const BrutalistButton = forwardRef<HTMLButtonElement, BrutalistButtonProps>(
  ({ className, size = "md", variant = "blue", children, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    }

    const variantClasses = {
      blue: "bg-[rgb(var(--google-blue))] text-white border-[rgb(var(--google-blue))] hover:bg-[rgba(var(--google-blue),0.9)]",
      red: "bg-[rgb(var(--google-red))] text-white border-[rgb(var(--google-red))] hover:bg-[rgba(var(--google-red),0.9)]",
      yellow:
        "bg-[rgb(var(--google-yellow))] text-black border-[rgb(var(--google-yellow))] hover:bg-[rgba(var(--google-yellow),0.9)]",
      green:
        "bg-[rgb(var(--google-green))] text-white border-[rgb(var(--google-green))] hover:bg-[rgba(var(--google-green),0.9)]",
    }

    const shadowColors = {
      blue: "before:bg-[rgba(var(--google-blue),0.3)]",
      red: "before:bg-[rgba(var(--google-red),0.3)]",
      yellow: "before:bg-[rgba(var(--google-yellow),0.3)]",
      green: "before:bg-[rgba(var(--google-green),0.3)]",
    }

    return (
      <button
        className={cn(
          "relative font-mono font-bold border-4 transition-all duration-200",
          "transform active:translate-y-1 active:translate-x-0",
          "before:content-[''] before:absolute before:inset-0 before:-z-10 before:transition-transform before:duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0",
          variantClasses[variant],
          shadowColors[variant],
          "before:translate-x-2 before:translate-y-2 hover:before:translate-x-1 hover:before:translate-y-1",
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

BrutalistButton.displayName = "BrutalistButton"
