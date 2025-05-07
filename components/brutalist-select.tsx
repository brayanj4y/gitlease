"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface Option {
  value: string
  label: string
}

interface BrutalistSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "options"> {
  options: Option[]
  variant?: "blue" | "red" | "yellow" | "green"
}

export const BrutalistSelect = forwardRef<HTMLSelectElement, BrutalistSelectProps>(
  ({ className, options, variant = "blue", ...props }, ref) => {
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
        <select
          className={cn(
            "w-full font-mono bg-white text-black border-4 px-4 py-2 appearance-none",
            "focus:outline-none focus:ring-0",
            "transition-all duration-200",
            variantClasses[variant],
            className,
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div
          className={cn(
            "absolute inset-0 translate-x-2 translate-y-2 -z-10 transition-transform duration-200",
            shadowColors[variant],
          )}
        ></div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black font-bold">▼</div>
      </div>
    )
  },
)

BrutalistSelect.displayName = "BrutalistSelect"
