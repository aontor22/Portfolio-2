# Portfolio-2 secure projects patch

This patch is designed for the current root-level React + TypeScript + Vite structure used by `aontor22/Portfolio-2` (`App.tsx`, `components/`, `services/`). It deliberately does **not** overwrite `App.tsx` because the source ZIP was not available in the working session; overwriting an unverified App would risk breaking the current 3D/games/UI work.

## What this patch does

1. Adds `/api/github-projects` to load owned public GitHub repositories server-side and return a portfolio-safe project catalog.
2. Filters forks, archived/disabled/empty repositories, the profile repository, `Portfolio-2`, `My-Portfolio`, and obvious learning collections; `MediCraft` is excluded by default because an earlier source audit found its current branch lacked application source.
3. Adds `SecureProjectsSection.tsx`, with real repository links and live links from each repository's GitHub `homepage` field.
4. Adds `/api/gemini` so the Gemini key stays on the server.
5. Adds request/body limits, same-origin checks and basic abuse throttling for AI requests.
6. Adds `.env.example` and a security verification script.

## Merge into the repo

Copy these folders/files into the **root** of `Portfolio-2`:

- `api/`
- `components/SecureProjectsSection.tsx`
- `services/githubProjectsService.ts`
- `services/secureGeminiService.ts`
- `.env.example`
- `scripts/verify-security.mjs`

Merge `.gitignore.security-snippet` into the existing `.gitignore` (do not replace the whole existing file).

## Replace the old hardcoded Projects section

In `App.tsx` add:

```tsx
import SecureProjectsSection from './components/SecureProjectsSection';
```

Then replace the existing section that maps the four hardcoded project cards (MediCraft / CRM / Food Ordering / POS) with:

```tsx
<SecureProjectsSection />
```

This removes the generic `https://github.com/aontor22` links and makes each card point to its own repository. The catalog is fetched from GitHub, so newly completed repositories can appear without editing `App.tsx` again.

## Move existing AI calls off the browser

The existing `services/geminiService.ts` must no longer instantiate `GoogleGenAI` or read `import.meta.env.VITE_GEMINI_API_KEY`.

Use `services/secureGeminiService.ts` from chatbot/trivia components:

```tsx
import { sendPortfolioMessage, generateSecureTrivia } from '../services/secureGeminiService';
```

Typical replacements:

```ts
const answer = await sendPortfolioMessage(userMessage, history);
const trivia = await generateSecureTrivia('React and software engineering');
```

Do not keep a browser fallback to `VITE_GEMINI_API_KEY`.

## Vercel environment variables

In Vercel → Project → Settings → Environment Variables, add:

- `GEMINI_API_KEY` = your Gemini auth key
- `GEMINI_MODEL` = `gemini-3.8-flash` (optional)
- `GITHUB_TOKEN` = optional read-only token to raise GitHub API rate limits
- `PORTFOLIO_EXCLUDE_REPOS` = comma-separated repository names you do not want shown

Delete `VITE_GEMINI_API_KEY` from Vercel after the frontend code no longer references it. If that key was ever deployed client-side, rotate/revoke it in Google AI Studio rather than merely renaming it.

## Local development

Vite by itself does not execute Vercel `/api` functions. Use Vercel's local development workflow when testing AI/GitHub functions locally, or deploy a preview and test there.

## Security check

After merging, run:

```bash
node scripts/verify-security.mjs
npm run build
```

The verifier fails if it finds a browser Gemini key, a `GoogleGenAI` client outside `/api`, or a likely hardcoded Google API key.

## Important rate-limit note

The included AI limiter is intentionally dependency-free and instance-local. It stops simple abuse, but serverless instances do not share that memory. For production-grade distributed throttling, replace it with a shared store/rate limiter (for example Vercel KV/Redis/Upstash) and keep the same API contract.
