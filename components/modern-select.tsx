"use client"

import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface Option {
  value: string
  label: string
}

interface ModernSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "options"> {
  options: Option[]
}

export const ModernSelect = forwardRef<HTMLSelectElement, ModernSelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "w-full bg-white text-black rounded-md px-4 py-2 appearance-none",
            "border border-[rgba(255,255,255,0.1)]",
            "focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-green))] focus:border-[rgb(var(--accent-green))]",
            "transition-all duration-200",
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
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black">▼</div>
      </div>
    )
  },
)

ModernSelect.displayName = "ModernSelect"
