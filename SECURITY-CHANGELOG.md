# Security & project-catalog changes

## Security
- Removed the design dependency on `VITE_GEMINI_API_KEY`.
- Added server-only Gemini proxy using `GEMINI_API_KEY`.
- Added POST-only AI endpoint, same-origin validation, body-size limits, prompt/history length caps, generic server errors and basic per-IP throttling.
- Added secret-safe environment template and ignore rules.
- Added a static security verification script.

## Projects
- Replaced the maintenance model of four hardcoded cards with a GitHub-synced catalog endpoint.
- Repository URL comes directly from GitHub metadata (`html_url`).
- Live-demo URL comes from GitHub repository `homepage`; no fake/hardcoded live URL is generated.
- Excludes forks, archived/disabled/empty repositories and portfolio/profile placeholders.
- Supports explicit exclusion via `PORTFOLIO_EXCLUDE_REPOS`.
