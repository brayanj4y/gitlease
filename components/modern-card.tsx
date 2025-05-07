import type React from "react"
import { cn } from "@/lib/utils"

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  glass?: boolean
}

export function ModernCard({ children, className, glass = false, ...props }: ModernCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden",
        glass ? "glass" : "bg-[rgb(var(--accent-gray))]",
        "border border-[rgba(255,255,255,0.1)]",
        "shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
