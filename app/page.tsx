"use client"

// Import the Footer component and add useEffect for navbar scroll effect
import { useState, useEffect } from "react"
import type React from "react"

import { ModernButton } from "@/components/modern-button"
import { ModernInput } from "@/components/modern-input"
import { ModernSelect } from "@/components/modern-select"
import { ModernDatePicker } from "@/components/modern-date-picker"
import { ReleaseNotes } from "@/components/release-notes"
import { ModernCard } from "@/components/modern-card"
import { ModernHeading } from "@/components/modern-heading"
import { ModernLabel } from "@/components/modern-label"
import { Footer } from "@/components/footer"
import { generateReleaseNotes } from "@/lib/github"
import { Github, Copy, AlertCircle, Check, Lock, ExternalLink, Star } from "lucide-react"

// Add the useEffect for navbar scroll effect and update the return statement
export default function Home() {
  const [repo, setRepo] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [format, setFormat] = useState("plaintext") // Default to plaintext
  const [loading, setLoading] = useState(false)
  const [releaseNotes, setReleaseNotes] = useState("")
  const [error, setError] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setCopySuccess(false)

    try {
      const notes = await generateReleaseNotes({
        repo,
        startDate,
        endDate,
        format,
      })
      setReleaseNotes(notes)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate release notes")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (releaseNotes) {
      navigator.clipboard.writeText(releaseNotes)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const visitRepo = () => {
    if (repo) {
      window.open(`https://github.com/${repo}`, "_blank")
    }
  }

  // Check if error is about private repository
  const isPrivateRepoError = error.includes("private")

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav
        className={`navbar sticky top-0 z-10 px-4 py-3 flex items-center justify-between ${isScrolled ? "scrolled" : ""}`}
      >
        <div className="flex items-center space-x-2">
          <Github className="w-5 h-5 text-[rgb(var(--accent-green))]" />
          <span className="font-bold text-base">GitLease</span>
        </div>
        <div className="flex items-center">
          <a
            href="https://github.com/brayanj4y/gitlease"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[rgb(var(--accent-light))] hover:text-[rgb(var(--accent-green))] transition-colors"
          >
            <Star className="w-4 h-4" />
            <span className="text-sm">Star us on GitHub</span>
          </a>
        </div>
      </nav>

      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-[rgba(var(--accent-green),0.1)] text-[rgb(var(--accent-green))] text-xs font-medium mb-3">
            Best GitHub Tool for Release Notes
          </div>
          <ModernHeading glow={true} className="mb-3 text-3xl">
            Generate Professional Release Notes
          </ModernHeading>
          <p className="text-[rgb(var(--accent-light))] max-w-2xl mx-auto text-sm">
            Automatically create comprehensive release notes for any public GitHub repository. Track features, bug
            fixes, and all changes between any two points in time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Repository Info Card */}
            <ModernCard className="p-5">
              <h2 className="text-lg font-bold mb-4 text-[rgb(var(--accent-green))]">Repository Configuration</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <ModernLabel htmlFor="repo">Repository (owner/repo)</ModernLabel>
                  <div className="flex gap-2">
                    <ModernInput
                      id="repo"
                      value={repo}
                      onChange={(e) => setRepo(e.target.value)}
                      placeholder="vercel/next.js"
                      required
                      className="flex-grow"
                    />
                    {repo && (
                      <ModernButton type="button" onClick={visitRepo} size="sm" className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Visit
                      </ModernButton>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[rgb(var(--accent-light))]">
                    <Lock className="w-3 h-3 inline mr-1" />
                    Only public repositories are supported
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <ModernLabel htmlFor="startDate">Start Date</ModernLabel>
                    <ModernDatePicker id="startDate" value={startDate} onChange={(date) => setStartDate(date)} />
                  </div>
                  <div>
                    <ModernLabel htmlFor="endDate">End Date</ModernLabel>
                    <ModernDatePicker id="endDate" value={endDate} onChange={(date) => setEndDate(date)} />
                  </div>
                </div>

                <div>
                  <ModernLabel htmlFor="format">Output Format</ModernLabel>
                  <ModernSelect
                    id="format"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    options={[
                      { value: "plaintext", label: "Plain Text" },
                      { value: "markdown", label: "Markdown" },
                    ]}
                  />
                </div>

                <ModernButton type="submit" disabled={loading} className="w-full">
                  {loading ? "Generating..." : "Generate Release Notes"}
                </ModernButton>
              </form>

              {error && (
                <div
                  className={`mt-4 p-3 rounded-md flex items-start gap-2 ${
                    isPrivateRepoError
                      ? "bg-[rgba(255,193,7,0.1)] border border-[rgba(255,193,7,0.3)]"
                      : "bg-[rgba(244,67,54,0.1)] border border-[rgba(244,67,54,0.3)]"
                  }`}
                >
                  {isPrivateRepoError ? (
                    <Lock className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
                  )}
                  <span className="text-xs">{error}</span>
                </div>
              )}
            </ModernCard>

            {/* Features Card */}
            <ModernCard className="p-5">
              <h2 className="text-lg font-bold mb-3 text-[rgb(var(--accent-green))]">Features</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-[rgba(var(--accent-green),0.1)] p-1 mt-0.5">
                    <Check className="w-3 h-3 text-[rgb(var(--accent-green))]" />
                  </div>
                  <span className="text-xs">Automatically categorizes changes (features, bugfixes, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-[rgba(var(--accent-green),0.1)] p-1 mt-0.5">
                    <Check className="w-3 h-3 text-[rgb(var(--accent-green))]" />
                  </div>
                  <span className="text-xs">Supports both plain text and markdown formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-[rgba(var(--accent-green),0.1)] p-1 mt-0.5">
                    <Check className="w-3 h-3 text-[rgb(var(--accent-green))]" />
                  </div>
                  <span className="text-xs">Includes commit history with author attribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-[rgba(var(--accent-green),0.1)] p-1 mt-0.5">
                    <Check className="w-3 h-3 text-[rgb(var(--accent-green))]" />
                  </div>
                  <span className="text-xs">Works with any public GitHub repository</span>
                </li>
              </ul>
            </ModernCard>
          </div>

          {/* Right Column - Release Notes */}
          <ModernCard className="h-full flex flex-col">
            <div className="flex justify-between items-center p-3 border-b border-[rgba(255,255,255,0.1)]">
              <h2 className="text-lg font-bold text-[rgb(var(--accent-green))]">Release Notes</h2>
              {releaseNotes && (
                <ModernButton onClick={copyToClipboard} size="sm" className="flex items-center gap-1 text-xs">
                  {copySuccess ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copySuccess ? "Copied!" : "Copy"}
                </ModernButton>
              )}
            </div>

            <div className="flex-grow p-3">
              <ReleaseNotes content={releaseNotes} format={format} loading={loading} />
            </div>
          </ModernCard>
        </div>
      </div>

      <Footer />
    </main>
  )
}
