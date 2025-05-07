"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Loader } from "lucide-react"

interface ReleaseNotesProps {
  content: string
  format: string
  loading?: boolean
  className?: string
}

export function ReleaseNotes({ content, format, loading = false, className }: ReleaseNotesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && content) {
      containerRef.current.scrollTop = 0
    }
  }, [content])

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className={cn(
          "w-full h-full overflow-auto bg-[rgba(0,0,0,0.2)] p-3 rounded-lg",
          "border border-[rgba(255,255,255,0.1)]",
          "transition-all duration-200 text-xs",
          className,
        )}
      >
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-[rgb(var(--accent-green))]">
            <Loader className="w-6 h-6 animate-spin mb-3" />
            <span className="text-xs">Fetching repository data...</span>
          </div>
        ) : !content ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-xs">
            No release notes generated yet
          </div>
        ) : format === "markdown" ? (
          <ReactMarkdown className="prose prose-invert prose-sm max-w-none">{content}</ReactMarkdown>
        ) : (
          <pre className="whitespace-pre-wrap text-[rgb(var(--accent-light))] font-mono text-xs">{content}</pre>
        )}
      </div>
    </div>
  )
}
