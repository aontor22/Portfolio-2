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

// Curated titles, categories, and Unsplash images for key projects.
// These are direct Unsplash CDN image URLs (not copied local assets).
const CURATED = {
  'industryops-erp': {
    title: 'IndustryOps ERP',
    category: 'ERP / Full Stack',
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
  'point-of-sale-system': {
    title: 'Point of Sale System',
    category: 'POS / Business App',
    imageUrl:
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
  },
  customerrelationshipsystem: {
    title: 'Customer Relationship System',
    category: 'CRM / Desktop App',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  },
  'food-ordering-system': {
    title: 'Food Ordering System',
    category: 'Food Ordering / Full Stack',
    imageUrl:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  },
  foodos: {
    title: 'FoodOS',
    category: 'Food Ordering / Full Stack',
    imageUrl:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  },
  'personal-expense-manager': {
    title: 'Personal Expense Manager',
    category: 'Finance / Web App',
    imageUrl:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
  },
  brewhouse: {
    title: 'BrewHouse',
    category: 'Web Application',
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
  },
  medicraft: {
    title: 'MediCraft',
    category: 'Healthcare / Full Stack',
    imageUrl:
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
  },
};

const CATEGORY_IMAGE_RULES = [
  {
    test: /health|medic|pharma|hospital|doctor|prescription/i,
    imageUrl:
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
  },
  {
    test: /crm|dashboard|analytics|desktop|java swing/i,
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  },
  {
    test: /food|restaurant|ordering|delivery|kitchen/i,
    imageUrl:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  },
  {
    test: /pos|retail|store|shop|cashier/i,
    imageUrl:
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    test: /erp|business|inventory|operations|management/i,
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    test: /finance|expense|budget|accounting|money/i,
    imageUrl:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    test: /coffee|cafe|brew/i,
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
  },
  {
    test: /ai|machine learning|deep learning|computer vision|nlp/i,
    imageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  },
  {
    test: /automation|testing|qa|selenium|playwright|scraper/i,
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    test: /backend|api|server|database/i,
    imageUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    test: /mobile|android|ios|flutter|react native/i,
    imageUrl:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    test: /frontend|website|web app|landing page|portfolio|react|next/i,
    imageUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  },
];

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
  const haystack = [repo.name, repo.description, repo.language, ...topics]
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

function getUnsplashImage(repo, category) {
  const curated = CURATED[String(repo.name || '').toLowerCase()];
  if (curated?.imageUrl) return curated.imageUrl;

  const haystack = [repo.name, repo.description, repo.language, ...(Array.isArray(repo.topics) ? repo.topics : []), category]
    .filter(Boolean)
    .join(' ');

  const match = CATEGORY_IMAGE_RULES.find((rule) => rule.test.test(haystack));
  return match?.imageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80';
}

function repoToProject(repo) {
  const nameKey = String(repo.name || '').toLowerCase();
  const curated = CURATED[nameKey] || {};
  const featuredIndex = FEATURED.findIndex(
    (name) => name.toLowerCase() === nameKey,
  );
  const category = inferCategory(repo);

  return {
    id: String(repo.id),
    name: repo.name,
    title: curated.title || titleCaseRepo(repo.name),
    description:
      repo.description ||
      'A software project by Udoy Chowdhury. Open the repository to explore implementation details and source code.',
    repoUrl: repo.html_url,
    liveUrl: normalizeLiveUrl(repo.homepage),
    imageUrl: getUnsplashImage(repo, category),
    category,
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
    const includeRepos = csvSet(process.env.PORTFOLIO_INCLUDE_REPOS);
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
      .filter((repo) => includeRepos.size === 0 || includeRepos.has(String(repo.name).toLowerCase()))
      .filter((repo) => !hideLearning || !isLearningCollection(String(repo.name)))
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
