import { NextResponse } from "next/server"
import { Octokit } from "@octokit/rest"

export async function GET() {
  try {
    // Check if GitHub token is available
    const token = process.env.GITHUB_TOKEN

    if (!token) {
      return NextResponse.json({ authenticated: false, rateLimit: null })
    }

    // Create Octokit instance with token
    const octokit = new Octokit({
      auth: token,
    })

    // Get rate limit info to verify token works
    const rateLimit = await octokit.rateLimit.get()

    return NextResponse.json({
      authenticated: true,
      rateLimit: {
        limit: rateLimit.data.rate.limit,
        remaining: rateLimit.data.rate.remaining,
        reset: rateLimit.data.rate.reset,
      },
    })
  } catch (error) {
    console.error("Error checking GitHub token:", error)
    return NextResponse.json({ authenticated: false, error: "Failed to verify GitHub token" }, { status: 500 })
  }
}
