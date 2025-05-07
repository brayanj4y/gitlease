"use client"

import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const ModernInput = forwardRef<HTMLInputElement, ModernInputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "w-full bg-[rgba(255,255,255,0.05)] text-white rounded-md px-3 py-1.5 text-xs",
        "border border-[rgba(255,255,255,0.1)]",
        "focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-green))] focus:border-[rgb(var(--accent-green))]",
        "placeholder:text-gray-400 transition-all duration-200",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})

ModernInput.displayName = "ModernInput"
