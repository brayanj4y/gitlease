// GitHub API integration
import { Octokit } from "@octokit/rest"

interface ReleaseNotesOptions {
  repo: string
  startDate: string
  endDate: string
  format: string
}

interface Commit {
  sha: string
  message: string
  author: string
  date: string
  url: string
}

interface Issue {
  number: number
  title: string
  state: string
  labels: string[]
  author: string
  date: string
  url: string
}

interface PullRequest {
  number: number
  title: string
  state: string
  labels: string[]
  author: string
  date: string
  url: string
}

interface ProcessedData {
  features: (Issue | PullRequest)[]
  bugfixes: (Issue | PullRequest)[]
  enhancements: (Issue | PullRequest)[]
  documentation: (Issue | PullRequest)[]
  other: (Issue | PullRequest)[]
  commits: Commit[]
}

// Create Octokit instance with the provided token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

// Check if token is available
export const hasGitHubToken = !!process.env.GITHUB_TOKEN

export async function generateReleaseNotes(options: ReleaseNotesOptions): Promise<string> {
  try {
    const { repo, startDate, endDate, format } = options

    if (!repo) {
      throw new Error("Repository is required")
    }

    const [owner, repoName] = repo.split("/")

    if (!owner || !repoName) {
      throw new Error("Invalid repository format. Use 'owner/repo'")
    }

    // Verify repository exists and is public before proceeding
    try {
      const repoResponse = await octokit.repos.get({
        owner,
        repo: repoName,
      })

      // Check if repository is private
      if (repoResponse.data.private) {
        throw new Error(`Repository ${owner}/${repoName} is private. This tool only supports public repositories.`)
      }
    } catch (error) {
      if ((error as any).status === 404) {
        throw new Error(`Repository ${owner}/${repoName} not found. Please check the repository name.`)
      } else if ((error as any).status === 401) {
        throw new Error("GitHub API authentication failed. Please check your GitHub token.")
      } else if ((error as any).status === 403) {
        throw new Error("GitHub API rate limit exceeded. Please try again later or use a valid GitHub token.")
      } else if ((error as any).message) {
        throw new Error((error as any).message)
      }
      throw error
    }

    // Fetch data from GitHub API
    const data = await fetchGitHubData(owner, repoName, startDate, endDate)

    // Process and categorize the data
    const processedData = processData(data)

    // Generate formatted release notes
    return formatReleaseNotes(processedData, repo, startDate, endDate, format)
  } catch (error) {
    console.error("Error generating release notes:", error)
    throw error
  }
}

async function fetchGitHubData(owner: string, repo: string, startDate: string, endDate: string) {
  try {
    // Convert dates to ISO format for GitHub API
    const since = startDate ? new Date(startDate).toISOString() : undefined
    const until = endDate ? new Date(endDate).toISOString() : undefined

    // Fetch commits with pagination
    const allCommits: any[] = []
    let page = 1
    let hasMoreCommits = true

    while (hasMoreCommits) {
      const commitsResponse = await octokit.repos.listCommits({
        owner,
        repo,
        since,
        until,
        per_page: 100,
        page,
      })

      if (commitsResponse.data.length === 0) {
        hasMoreCommits = false
      } else {
        allCommits.push(...commitsResponse.data)
        page++

        // Limit to 500 commits to avoid excessive API calls
        if (allCommits.length >= 500) {
          hasMoreCommits = false
        }
      }
    }

    // Fetch closed issues and PRs with pagination
    const allIssues: any[] = []
    page = 1
    let hasMoreIssues = true

    while (hasMoreIssues) {
      const issuesResponse = await octokit.issues.listForRepo({
        owner,
        repo,
        state: "closed",
        since,
        per_page: 100,
        page,
      })

      if (issuesResponse.data.length === 0) {
        hasMoreIssues = false
      } else {
        allIssues.push(...issuesResponse.data)
        page++

        // Limit to 500 issues to avoid excessive API calls
        if (allIssues.length >= 500) {
          hasMoreIssues = false
        }
      }
    }

    // Process commits
    const commits = allCommits.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author?.name || commit.author?.login || "Unknown",
      date: commit.commit.author?.date || new Date().toISOString(),
      url: commit.html_url,
    }))

    // Filter issues and pull requests
    const issues: Issue[] = []
    const pullRequests: PullRequest[] = []

    for (const item of allIssues) {
      // Skip pull requests in issues response
      if (item.pull_request) {
        // This is a PR, not an issue
        const labels = item.labels
          .map((label: any) => (typeof label === "string" ? label : label.name || ""))
          .filter(Boolean)

        pullRequests.push({
          number: item.number,
          title: item.title,
          state: item.state,
          labels,
          author: item.user?.login || "Unknown",
          date: item.closed_at || item.updated_at || item.created_at || new Date().toISOString(),
          url: item.html_url,
        })
      } else {
        // This is an issue
        const labels = item.labels
          .map((label: any) => (typeof label === "string" ? label : label.name || ""))
          .filter(Boolean)

        issues.push({
          number: item.number,
          title: item.title,
          state: item.state,
          labels,
          author: item.user?.login || "Unknown",
          date: item.closed_at || item.updated_at || item.created_at || new Date().toISOString(),
          url: item.html_url,
        })
      }
    }

    return {
      commits,
      issues,
      pullRequests,
    }
  } catch (error) {
    console.error("Error fetching data from GitHub:", error)

    // Handle specific error cases
    if ((error as any).status === 401) {
      throw new Error("GitHub API authentication failed. Please check your GitHub token.")
    } else if ((error as any).status === 403) {
      // Check if this is a private repository error
      if ((error as any).message && (error as any).message.includes("private")) {
        throw new Error(`This repository is private. This tool only supports public repositories.`)
      } else {
        throw new Error("GitHub API rate limit exceeded. Please try again later or use a valid GitHub token.")
      }
    } else if ((error as any).status === 404) {
      throw new Error(`Repository not found. Please check the repository name.`)
    }

    throw new Error(`Failed to fetch data from GitHub: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function processData(data: any): ProcessedData {
  const { commits, issues, pullRequests } = data

  // Categorize PRs and issues
  const features: (Issue | PullRequest)[] = []
  const bugfixes: (Issue | PullRequest)[] = []
  const enhancements: (Issue | PullRequest)[] = []
  const documentation: (Issue | PullRequest)[] = []
  const other: (Issue | PullRequest)[] = []

  // Process pull requests
  pullRequests.forEach((pr: PullRequest) => {
    if (pr.labels.some((label) => label.toLowerCase().includes("bug") || label.toLowerCase().includes("fix"))) {
      bugfixes.push(pr)
    } else if (pr.labels.some((label) => label.toLowerCase().includes("feature"))) {
      features.push(pr)
    } else if (
      pr.labels.some((label) => label.toLowerCase().includes("enhancement") || label.toLowerCase().includes("improve"))
    ) {
      enhancements.push(pr)
    } else if (
      pr.labels.some((label) => label.toLowerCase().includes("documentation") || label.toLowerCase().includes("docs"))
    ) {
      documentation.push(pr)
    } else {
      // Also check title for keywords
      const title = pr.title.toLowerCase()
      if (title.includes("fix") || title.includes("bug")) {
        bugfixes.push(pr)
      } else if (title.includes("feature") || title.includes("add")) {
        features.push(pr)
      } else if (title.includes("enhance") || title.includes("improve") || title.includes("update")) {
        enhancements.push(pr)
      } else if (title.includes("doc")) {
        documentation.push(pr)
      } else {
        other.push(pr)
      }
    }
  })

  // Process issues (only include closed ones)
  issues
    .filter((issue: Issue) => issue.state === "closed")
    .forEach((issue: Issue) => {
      if (issue.labels.some((label) => label.toLowerCase().includes("bug") || label.toLowerCase().includes("fix"))) {
        bugfixes.push(issue)
      } else if (issue.labels.some((label) => label.toLowerCase().includes("feature"))) {
        features.push(issue)
      } else if (
        issue.labels.some(
          (label) => label.toLowerCase().includes("enhancement") || label.toLowerCase().includes("improve"),
        )
      ) {
        enhancements.push(issue)
      } else if (
        issue.labels.some(
          (label) => label.toLowerCase().includes("documentation") || label.toLowerCase().includes("docs"),
        )
      ) {
        documentation.push(issue)
      } else {
        // Also check title for keywords
        const title = issue.title.toLowerCase()
        if (title.includes("fix") || title.includes("bug")) {
          bugfixes.push(issue)
        } else if (title.includes("feature") || title.includes("add")) {
          features.push(issue)
        } else if (title.includes("enhance") || title.includes("improve") || title.includes("update")) {
          enhancements.push(issue)
        } else if (title.includes("doc")) {
          documentation.push(issue)
        } else {
          other.push(issue)
        }
      }
    })

  return {
    features,
    bugfixes,
    enhancements,
    documentation,
    other,
    commits,
  }
}

function formatReleaseNotes(
  data: ProcessedData,
  repo: string,
  startDate: string,
  endDate: string,
  format: string,
): string {
  const { features, bugfixes, enhancements, documentation, other, commits } = data

  // Format dates for display
  const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString() : "N/A"
  const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString() : "N/A"

  if (format === "markdown") {
    return formatMarkdown(repo, formattedStartDate, formattedEndDate, {
      features,
      bugfixes,
      enhancements,
      documentation,
      other,
      commits,
    })
  } else {
    return formatPlainText(repo, formattedStartDate, formattedEndDate, {
      features,
      bugfixes,
      enhancements,
      documentation,
      other,
      commits,
    })
  }
}

// Update the formatPlainText function to include emojis in section headings
function formatPlainText(repo: string, startDate: string, endDate: string, data: ProcessedData): string {
  const { features, bugfixes, enhancements, documentation, other, commits } = data

  let text = `RELEASE NOTES FOR ${repo}\n\n`
  text += `Period: ${startDate} to ${endDate}\n\n`

  // Features
  if (features.length > 0) {
    text += `✨ NEW FEATURES:\n\n`
    features.forEach((item) => {
      text += `- ${item.title} (#${item.number}) by ${item.author}\n`
    })
    text += "\n"
  }

  // Bug Fixes
  if (bugfixes.length > 0) {
    text += `🐛 BUG FIXES:\n\n`
    bugfixes.forEach((item) => {
      text += `- ${item.title} (#${item.number}) by ${item.author}\n`
    })
    text += "\n"
  }

  // Enhancements
  if (enhancements.length > 0) {
    text += `🔧 ENHANCEMENTS:\n\n`
    enhancements.forEach((item) => {
      text += `- ${item.title} (#${item.number}) by ${item.author}\n`
    })
    text += "\n"
  }

  // Documentation
  if (documentation.length > 0) {
    text += `📚 DOCUMENTATION:\n\n`
    documentation.forEach((item) => {
      text += `- ${item.title} (#${item.number}) by ${item.author}\n`
    })
    text += "\n"
  }

  // Other Changes
  if (other.length > 0) {
    text += `🔄 OTHER CHANGES:\n\n`
    other.forEach((item) => {
      text += `- ${item.title} (#${item.number}) by ${item.author}\n`
    })
    text += "\n"
  }

  // Commits
  if (commits.length > 0) {
    text += `📝 COMMITS:\n\n`
    commits.forEach((commit) => {
      const shortSha = commit.sha.substring(0, 7)
      const firstLine = commit.message.split("\n")[0] // Get only the first line of the commit message
      text += `- ${firstLine} (${shortSha}) by ${commit.author}\n`
    })
  }

  return text
}

// Update the formatMarkdown function to include emojis in section headings
function formatMarkdown(repo: string, startDate: string, endDate: string, data: ProcessedData): string {
  const { features, bugfixes, enhancements, documentation, other, commits } = data

  let markdown = `# Release Notes for ${repo}\n\n`
  markdown += `**Period:** ${startDate} to ${endDate}\n\n`

  // Features
  if (features.length > 0) {
    markdown += `## ✨ New Features\n\n`
    features.forEach((item) => {
      markdown += `- ${item.title} ([#${item.number}](${item.url})) by ${item.author}\n`
    })
    markdown += "\n"
  }

  // Bug Fixes
  if (bugfixes.length > 0) {
    markdown += `## 🐛 Bug Fixes\n\n`
    bugfixes.forEach((item) => {
      markdown += `- ${item.title} ([#${item.number}](${item.url})) by ${item.author}\n`
    })
    markdown += "\n"
  }

  // Enhancements
  if (enhancements.length > 0) {
    markdown += `## 🔧 Enhancements\n\n`
    enhancements.forEach((item) => {
      markdown += `- ${item.title} ([#${item.number}](${item.url})) by ${item.author}\n`
    })
    markdown += "\n"
  }

  // Documentation
  if (documentation.length > 0) {
    markdown += `## 📚 Documentation\n\n`
    documentation.forEach((item) => {
      markdown += `- ${item.title} ([#${item.number}](${item.url})) by ${item.author}\n`
    })
    markdown += "\n"
  }

  // Other Changes
  if (other.length > 0) {
    markdown += `## 🔄 Other Changes\n\n`
    other.forEach((item) => {
      markdown += `- ${item.title} ([#${item.number}](${item.url})) by ${item.author}\n`
    })
    markdown += "\n"
  }

  // Commits
  if (commits.length > 0) {
    markdown += `## 📝 Commits\n\n`
    commits.forEach((commit) => {
      const shortSha = commit.sha.substring(0, 7)
      const firstLine = commit.message.split("\n")[0] // Get only the first line of the commit message
      markdown += `- ${firstLine} ([${shortSha}](${commit.url})) by ${commit.author}\n`
    })
  }

  return markdown
}
