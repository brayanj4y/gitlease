import { Github, Instagram, Linkedin, Mail, Heart, Code } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[rgba(0,0,0,0.3)] backdrop-blur-md border-t border-[rgba(255,255,255,0.05)] mt-12">
      <div className="container mx-auto px-4 py-8">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About column */}
          <div>
            <h3 className="text-[rgb(var(--accent-green))] font-bold text-sm mb-3 flex items-center">
              <Code className="w-3 h-3 mr-1" /> About GitLease
            </h3>
            <p className="text-[rgb(var(--accent-light))] text-xs leading-relaxed">
              GitLease is a professional tool for generating comprehensive release notes from GitHub repositories. Track
              features, bug fixes, and all changes between any two points in time.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[rgb(var(--accent-green))] font-bold text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/brayanj4y/gitlease"
                  className="text-[rgb(var(--accent-light))] hover:text-[rgb(var(--accent-green))] transition-colors text-xs flex items-center"
                >
                  <Github className="w-3 h-3 mr-1" /> GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="mailto:souopsylvain@gmail.com"
                  className="text-[rgb(var(--accent-light))] hover:text-[rgb(var(--accent-green))] transition-colors text-xs flex items-center"
                >
                  <Mail className="w-3 h-3 mr-1" /> Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-[rgb(var(--accent-green))] font-bold text-sm mb-3">Connect with creator</h3>
            <div className="flex space-x-3 mb-4">
              <a
                href="https://github.com/brayanj4y"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(var(--accent-green),0.2)] p-2 rounded-md transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-[rgb(var(--accent-light))] hover:text-[rgb(var(--accent-green))]" />
              </a>
              <a
                href="https://instagram.com/brayanj4y"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(var(--accent-green),0.2)] p-2 rounded-md transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-[rgb(var(--accent-light))] hover:text-[rgb(var(--accent-green))]" />
              </a>
              <a
                href="https://linkedin.com/in/brayan-j4y"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(var(--accent-green),0.2)] p-2 rounded-md transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-[rgb(var(--accent-light))] hover:text-[rgb(var(--accent-green))]" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[rgba(255,255,255,0.05)] my-4"></div>

        {/* Bottom section with copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-[rgb(var(--accent-light))] mb-3 md:mb-0">
            © {currentYear} GitLease. All rights reserved.
          </div>
          <div className="flex items-center text-xs text-[rgb(var(--accent-light))]">
            <span className="flex items-center">
              Made with <Heart className="w-3 h-3 mx-1 text-red-500" /> by
              <a href="https://github.com/brayanj4y" className="text-[rgb(var(--accent-green))] hover:underline ml-1">
                brayanj4y
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
