"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface BrutalistInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "blue" | "red" | "yellow" | "green"
}

export const BrutalistInput = forwardRef<HTMLInputElement, BrutalistInputProps>(
  ({ className, variant = "blue", ...props }, ref) => {
    const variantClasses = {
      blue: "bg-white text-black border-[rgb(var(--google-blue))] focus:border-[rgb(var(--google-blue))]",
      red: "bg-white text-black border-[rgb(var(--google-red))] focus:border-[rgb(var(--google-red))]",
      yellow: "bg-white text-black border-[rgb(var(--google-yellow))] focus:border-[rgb(var(--google-yellow))]",
      green: "bg-white text-black border-[rgb(var(--google-green))] focus:border-[rgb(var(--google-green))]",
    }

    const shadowColors = {
      blue: "bg-[rgba(var(--google-blue),0.3)]",
      red: "bg-[rgba(var(--google-red),0.3)]",
      yellow: "bg-[rgba(var(--google-yellow),0.3)]",
      green: "bg-[rgba(var(--google-green),0.3)]",
    }

    return (
      <div className="relative">
        <input
          className={cn(
            "w-full font-mono bg-white text-black border-4 px-4 py-2",
            "focus:outline-none focus:ring-0",
            "placeholder:text-gray-500 transition-all duration-200",
            variantClasses[variant],
            className,
          )}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "absolute inset-0 translate-x-2 translate-y-2 -z-10 transition-transform duration-200",
            shadowColors[variant],
          )}
        ></div>
      </div>
    )
  },
)

BrutalistInput.displayName = "BrutalistInput"
