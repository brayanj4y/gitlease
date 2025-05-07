import type React from "react"
import { cn } from "@/lib/utils"

interface BrutalistLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  variant?: "blue" | "red" | "yellow" | "green"
}

export function BrutalistLabel({ children, className, variant = "blue", ...props }: BrutalistLabelProps) {
  const variantClasses = {
    blue: "text-[rgb(var(--google-blue))]",
    red: "text-[rgb(var(--google-red))]",
    yellow: "text-[rgb(var(--google-yellow))]",
    green: "text-[rgb(var(--google-green))]",
  }

  return (
    <label className={cn("block mb-2 text-lg font-mono font-bold", variantClasses[variant], className)} {...props}>
      {children}
    </label>
  )
}
