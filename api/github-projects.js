import { json } from './_shared.js';

const USERNAME = 'aontor22';

const ALWAYS_EXCLUDED = new Set([
  USERNAME.toLowerCase(),
  'portfolio-2',
  'my-portfolio',
]);

const FEATURED = [
  'IndustryOps-ERP',
  'MediCraft',
  'CustomerRelationshipSystem',
  'Food-Ordering-system',
  'Point-of-Sale-System',
  'personal-expense-manager',
  'BrewHouse',
];

/*
 * IMPORTANT:
 * Use LOCAL images for projects when you have a real screenshot.
 * Example:
 *
 * 'industryops-erp': {
 *   title: 'IndustryOps ERP',
 *   category: 'ERP / Full Stack',
 *   imageUrl: '/project-covers/industryops-erp.webp',
 * },
 *
 * Put the file under public/project-covers/.
 *
 * If imageUrl is omitted, the UI renders a polished generated cover instead
 * of relying on GitHub's external OpenGraph image host.
 */
const CURATED = {
  'industryops-erp': {
    title: 'IndustryOps ERP',
    category: 'ERP / Full Stack',
    imageUrl: '/project-covers/industryops-erp.svg',
  },
  'point-of-sale-system': {
    title: 'Point of Sale System',
    category: 'POS / Business App',
    imageUrl: '/project-covers/pos-system.svg',
  },
  customerrelationshipsystem: {
    title: 'Customer Relationship System',
    category: 'CRM / Desktop App',
    imageUrl: '/project-covers/crm-system.svg',
  },
  'food-ordering-system': {
    title: 'Food Ordering System',
    category: 'Food Ordering / Full Stack',
    imageUrl: '/project-covers/food-ordering.svg',
  },
  'personal-expense-manager': {
    title: 'Personal Expense Manager',
    category: 'Finance / Web App',
    imageUrl: '/project-covers/personal-expense-manager.svg',
  },
  brewhouse: {
    title: 'BrewHouse',
    category: 'Web Application',
    imageUrl: '/project-covers/brewhouse.svg',
  },
  medicraft: {
    title: 'MediCraft',
    category: 'Healthcare / Full Stack',
    imageUrl: '/project-covers/medicraft.svg',
  },
};

function csvSet(value) {
  return new Set(
    String(value || '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

function isLearningCollection(name) {
  return /(^|[-_])(practice|tutorials?|learning|coursework|assignments?|notes|starter|templates?)([-_]|$)/i.test(
    name,
  );
}

function titleCaseRepo(name) {
  return String(name || '')
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .trim();
}

function coverSlug(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project';
}

function normalizeLiveUrl(value) {
  if (!value) return null;

  try {
    const url = new URL(String(value));
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

function inferCategory(repo) {
  const curated = CURATED[String(repo.name || '').toLowerCase()];
  if (curated?.category) return curated.category;

  const topics = Array.isArray(repo.topics) ? repo.topics : [];
  const haystack = [
    repo.name,
    repo.description,
    repo.language,
    ...topics,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/machine[- ]?learning|deep[- ]?learning|tensorflow|pytorch|computer[- ]?vision|\bnlp\b|artificial[- ]?intelligence|\bai\b/.test(haystack)) {
    return 'AI / Machine Learning';
  }
  if (/automation|selenium|playwright|scraper|crawler|bot\b|testing|qa\b/.test(haystack)) {
    return 'Automation / Testing';
  }
  if (/android|flutter|react native|mobile app/.test(haystack)) {
    return 'Mobile Application';
  }
  if (/java swing|swing|desktop|javafx/.test(haystack) || repo.language === 'Java') {
    return 'Desktop Application';
  }
  if (/api\b|backend|express|node\.js|nodejs|rest api|server/.test(haystack) && !/react|frontend|full[- ]?stack/.test(haystack)) {
    return 'Backend / API';
  }
  if (/e[- ]?commerce|ecommerce|shop|store|ordering|booking/.test(haystack)) {
    return 'Full Stack Web App';
  }
  if (/react|next\.js|nextjs|full[- ]?stack|mern|supabase|firebase|postgres|mongodb/.test(haystack)) {
    return 'Full Stack Web App';
  }
  if (/html|css|tailwind|frontend|landing page|website/.test(haystack)) {
    return 'Frontend Web App';
  }

  return 'Software Project';
}

function repoToProject(repo) {
  const nameKey = String(repo.name || '').toLowerCase();
  const curated = CURATED[nameKey] || {};
  const featuredIndex = FEATURED.findIndex(
    (name) => name.toLowerCase() === nameKey,
  );
  const liveUrl = normalizeLiveUrl(repo.homepage);

  // Every repository with a real live URL uses a REAL screenshot captured by
  // scripts/capture-live-project-covers.mjs and committed under public/.
  // If a capture is missing, the React card automatically falls back to its
  // generated category-aware visual instead of showing a broken image.
  const imageUrl = liveUrl
    ? `/project-covers/live/${coverSlug(repo.name)}.png`
    : curated.imageUrl || null;

  return {
    id: String(repo.id),
    name: repo.name,
    title: curated.title || titleCaseRepo(repo.name),
    description:
      repo.description ||
      'A software project by Udoy Chowdhury. Open the repository to explore implementation details and source code.',
    repoUrl: repo.html_url,
    liveUrl,
    imageUrl,

    category: inferCategory(repo),
    featured: featuredIndex >= 0,
    language: repo.language || 'Other',
    topics: Array.isArray(repo.topics) ? repo.topics.slice(0, 8) : [],
    stars: Number(repo.stargazers_count || 0),
    forks: Number(repo.forks_count || 0),
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
  };
}

function score(project) {
  const rank = FEATURED.findIndex(
    (name) => name.toLowerCase() === project.name.toLowerCase(),
  );

  if (rank >= 0) return 100_000 - rank * 1_000;

  const timestamp = Date.parse(project.pushedAt || project.updatedAt || 0);
  return timestamp / 1e10 + project.stars * 10 + project.forks * 3;
}

export async function GET() {
  try {
    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'aontor22-portfolio',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?type=owner&sort=updated&direction=desc&per_page=100`,
      { headers },
    );

    if (!response.ok) {
      console.error('GitHub API error:', response.status);
      return json(
        { error: 'Could not load GitHub projects.' },
        502,
        {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      );
    }

    const repos = await response.json();
    const extraExcluded = csvSet(process.env.PORTFOLIO_EXCLUDE_REPOS);
    const includeMediCraft =
      String(process.env.PORTFOLIO_INCLUDE_MEDICRAFT || '').toLowerCase() === 'true';
    const hideLearning =
      String(process.env.PORTFOLIO_HIDE_LEARNING_REPOS || 'true').toLowerCase() !== 'false';

    const projects = repos
      .filter(
        (repo) =>
          repo &&
          !repo.fork &&
          !repo.archived &&
          !repo.disabled &&
          Number(repo.size || 0) > 0,
      )
      .filter((repo) => !ALWAYS_EXCLUDED.has(String(repo.name).toLowerCase()))
      .filter(
        (repo) => includeMediCraft || String(repo.name).toLowerCase() !== 'medicraft',
      )
      .filter((repo) => !extraExcluded.has(String(repo.name).toLowerCase()))
      .filter(
        (repo) => !hideLearning || !isLearningCollection(String(repo.name)),
      )
      .map(repoToProject)
      .sort((a, b) => score(b) - score(a));

    return json(
      {
        owner: USERNAME,
        count: projects.length,
        projects,
        generatedAt: new Date().toISOString(),
      },
      200,
      {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
      },
    );
  } catch (error) {
    console.error(
      'GitHub project loader error:',
      error instanceof Error ? error.message : 'unknown error',
    );
    return json({ error: 'Could not load GitHub projects.' }, 500);
  }
}

export function POST() {
  return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET' });
}
