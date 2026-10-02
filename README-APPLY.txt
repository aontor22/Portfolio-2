PORTFOLIO-2 — ORIGINAL POSTER-STYLE PROJECT CARDS
=================================================

This patch restores the visual direction shown in your old portfolio cards:
- portrait/full-bleed visual cards
- project imagery/illustration across the entire card
- dark cinematic overlay
- top-left glass icon
- GitHub + View controls in the top-right
- large project title and subtitle
- compact technology chips
- right-aligned metric/highlight block
- Featured Projects + More Projects
- search, category filters, and load-more

The 7 flagship projects use LOCAL generated SVG cover artwork under:
public/project-covers/

No external GitHub OpenGraph image host is required, so broken image previews are avoided.
Other projects use a project/category-aware generated fallback inside React.

FILES TO REPLACE/COPY
---------------------
1. components/SecureProjectsSection.tsx
2. api/github-projects.js
3. services/githubProjectsService.ts
4. copy entire public/project-covers/ folder

IMPORTANT
---------
If you want MediCraft visible, set this in .env.local and Vercel:
PORTFOLIO_INCLUDE_MEDICRAFT=true

Then restart Vercel dev after replacing the files:
  Ctrl+C
  npx vercel@latest dev

Open:
  http://localhost:3000/#projects

Hard refresh:
  Ctrl+Shift+R

Verification:
  npm audit --omit=dev
  node scripts/verify-security.mjs
  npm run build
