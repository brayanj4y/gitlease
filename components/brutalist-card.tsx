import type React from "react"
import { cn } from "@/lib/utils"

interface BrutalistCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "blue" | "red" | "yellow" | "green"
}

export function BrutalistCard({ children, className, variant = "blue", ...props }: BrutalistCardProps) {
  const variantClasses = {
    blue: "bg-white border-[rgb(var(--google-blue))]",
    red: "bg-white border-[rgb(var(--google-red))]",
    yellow: "bg-white border-[rgb(var(--google-yellow))]",
    green: "bg-white border-[rgb(var(--google-green))]",
  }

  const shadowColors = {
    blue: "bg-[rgba(var(--google-blue),0.3)]",
    red: "bg-[rgba(var(--google-red),0.3)]",
    yellow: "bg-[rgba(var(--google-yellow),0.3)]",
    green: "bg-[rgba(var(--google-green),0.3)]",
  }

  return (
    <div className="relative">
      <div className={cn("p-6 border-4", "transition-all duration-200", variantClasses[variant], className)} {...props}>
        {children}
      </div>
      <div className={cn("absolute inset-0 translate-x-4 translate-y-4 -z-10", shadowColors[variant])}></div>
    </div>
  )
}
