import type React from "react"
import { cn } from "@/lib/utils"

interface ModernLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

export function ModernLabel({ children, className, ...props }: ModernLabelProps) {
  // Update the label size to be smaller
  return (
    <label className={cn("block mb-1 text-xs font-medium text-[rgb(var(--accent-light))]", className)} {...props}>
      {children}
    </label>
  )
}
