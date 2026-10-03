Apply only this file:

- api/github-projects.js

This patch does two things:
1. Uses Unsplash images for project cards (featured + remaining projects).
2. Supports showing only selected repos via:
   PORTFOLIO_INCLUDE_REPOS=repo1,repo2,repo3

Example:
PORTFOLIO_INCLUDE_REPOS=IndustryOps-ERP,MediCraft,Food-Ordering-system,Point-of-Sale-System,CustomerRelationshipSystem,personal-expense-manager,BrewHouse

After replacing the file:
- restart Vercel dev
- hard refresh the browser (Ctrl+Shift+R)
