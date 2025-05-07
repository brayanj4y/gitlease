"use client"

import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface ModernDatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (date: string) => void
}

export const ModernDatePicker = forwardRef<HTMLInputElement, ModernDatePickerProps>(
  ({ className, value, onChange, ...props }, ref) => {
    return (
      <input
        type="date"
        className={cn(
          "w-full bg-[rgba(255,255,255,0.05)] text-white rounded-md px-3 py-1.5 text-xs",
          "border border-[rgba(255,255,255,0.1)]",
          "focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-green))] focus:border-[rgb(var(--accent-green))]",
          "transition-all duration-200",
          className,
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        ref={ref}
        {...props}
      />
    )
  },
)

ModernDatePicker.displayName = "ModernDatePicker"
