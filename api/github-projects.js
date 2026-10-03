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

const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&h=1600&q=82`;

/*
 * Hand-picked Unsplash images for the projects already visible in your portfolio.
 * Each one intentionally uses a different image.
 */
const CURATED = {
  'industryops-erp': {
    title: 'IndustryOps ERP',
    category: 'ERP / Full Stack',
    imageUrl: u('photo-1586528116311-ad8dd3c8310d'),
  },
  'point-of-sale-system': {
    title: 'Point of Sale System',
    category: 'POS / Business App',
    imageUrl: u('photo-1556740749-887f6717d7e4'),
  },
  customerrelationshipsystem: {
    title: 'Customer Relationship System',
    category: 'CRM / Desktop App',
    imageUrl: u('photo-1551288049-bebda4e38f71'),
  },
  customerrelationshipsystem2: {
    title: 'Customer Relationship System 2',
    category: 'CRM / Business App',
    imageUrl: u('photo-1521737711867-e3b97375f902'),
  },
  'food-ordering-system': {
    title: 'Food Ordering System',
    category: 'Food Ordering / Full Stack',
    imageUrl: u('photo-1513104890138-7c749659a591'),
  },
  foodos: {
    title: 'FoodOS',
    category: 'Food Ordering / Full Stack',
    imageUrl: u('photo-1565299624946-b28f40a0ae38'),
  },
  medicraft: {
    title: 'MediCraft',
    category: 'Healthcare / Full Stack',
    imageUrl: u('photo-1587854692152-cbe660dbde88'),
  },
  'personal-expense-manager': {
    title: 'Personal Expense Manager',
    category: 'Finance / Web App',
    imageUrl: u('photo-1554224155-6726b3ff858f'),
  },
  brewhouse: {
    title: 'BrewHouse',
    category: 'Coffee / Web App',
    imageUrl: u('photo-1509042239860-f550ce710b93'),
  },
  'smart-mess-manager': {
    title: 'Smart Mess Manager',
    category: 'Management / Full Stack',
    imageUrl: u('photo-1556911220-bff31c812dba'),
  },
  'solarhub-bd': {
    title: 'SolarHub BD',
    category: 'Energy / Web App',
    imageUrl: u('photo-1508514177221-188b1cf16e9d'),
  },
  erp: {
    title: 'ERP',
    category: 'ERP / Business App',
    imageUrl: u('photo-1460925895917-afdab827c52f'),
  },
  mgc: {
    title: 'MGC',
    category: 'Software Project',
    imageUrl: u('photo-1515879218367-8466d910aaa4'),
  },
  'morse-universal': {
    title: 'Morse Universal',
    category: 'Communication Utility',
    imageUrl: u('photo-1518770660439-4636190af475'),
  },
  'lan-arena-fps': {
    title: 'LAN Arena FPS',
    category: 'Game / Networking',
    imageUrl: u('photo-1542751371-adc38448a05e'),
  },
  'dokan-pilot-pos': {
    title: 'Dokan Pilot POS',
    category: 'POS / Retail App',
    imageUrl: u('photo-1472851294608-062f824d29cc'),
  },
  'dokanpilot-pos': {
    title: 'Dokan Pilot POS',
    category: 'POS / Retail App',
    imageUrl: u('photo-1472851294608-062f824d29cc'),
  },
  'ui-clock-design': {
    title: 'UI Clock Design',
    category: 'UI / Frontend',
    imageUrl: u('photo-1561070791-2526d30994b5'),
  },
  'uiclockdesign': {
    title: 'UI Clock Design',
    category: 'UI / Frontend',
    imageUrl: u('photo-1561070791-2526d30994b5'),
  },
};

/*
 * Multiple image choices per project category. During each API request we keep
 * a used-image Set, so two visible projects will not receive the same photo
 * unless every suitable photo has already been exhausted.
 */
const IMAGE_POOLS = {
  healthcare: [
    u('photo-1576091160399-112ba8d25d1d'),
    u('photo-1538108149393-fbbd81895907'),
    u('photo-1516841273335-e39b37888115'),
    u('photo-1471864190281-a93a3070b6de'),
  ],
  food: [
    u('photo-1504674900247-0877df9cc836'),
    u('photo-1476224203421-9ac39bcb3327'),
    u('photo-1551218808-94e220e084d2'),
    u('photo-1414235077428-338989a2e8c0'),
  ],
  retail: [
    u('photo-1534452203293-494d7ddbf7e0'),
    u('photo-1528698827591-e19ccd7bc23d'),
    u('photo-1496171367470-9ed9a91ea931'),
    u('photo-1441986300917-64674bd600d8'),
  ],
  business: [
    u('photo-1454165804606-c3d57bc86b40'),
    u('photo-1551836022-d5d88e9218df'),
    u('photo-1497366754035-f200968a6e72'),
    u('photo-1497366811353-6870744d04b2'),
    u('photo-1504384308090-c894fdcc538d'),
  ],
  finance: [
    u('photo-1579621970563-ebec7560ff3e'),
    u('photo-1565514020179-026b92b84bb6'),
    u('photo-1526304640581-d334cdbbf45e'),
  ],
  coffee: [
    u('photo-1445116572660-236099ec97a0'),
    u('photo-1498804103079-a6351b050096'),
    u('photo-1511081692775-05d0f180a065'),
  ],
  solar: [
    u('photo-1509391366360-2e959784a276'),
    u('photo-1497435334941-8c899ee9e8e9'),
    u('photo-1473341304170-971dccb5ac1e'),
  ],
  ai: [
    u('photo-1677442136019-21780ecad995'),
    u('photo-1620712943543-bcc4688e7485'),
    u('photo-1535378917042-10a22c95931a'),
  ],
  automation: [
    u('photo-1516321318423-f06f85e504b3'),
    u('photo-1488590528505-98d2b5aba04b'),
    u('photo-1504639725590-34d0984388bd'),
  ],
  code: [
    u('photo-1498050108023-c5249f4df085'),
    u('photo-1542831371-29b0f74f9713'),
    u('photo-1522252234503-e356532cafd5'),
    u('photo-1556075798-4825dfaaf498'),
    u('photo-1531297484001-80022131f5a1'),
  ],
  mobile: [
    u('photo-1512941937669-90a1b58e7e9c'),
    u('photo-1535223289827-42f1e9919769'),
    u('photo-1511707171634-5f897ff02aa9'),
  ],
  gaming: [
    u('photo-1493711662062-fa541adb3fc8'),
    u('photo-1511512578047-dfb367046420'),
    u('photo-1598550476439-6847785fcea6'),
  ],
  communication: [
    u('photo-1526374965328-7f61d4dc18c5'),
    u('photo-1550751827-4bd374c3f58b'),
    u('photo-1518770660439-4636190af475'),
  ],
  design: [
    u('photo-1545235617-9465d2a55698'),
    u('photo-1547658719-da2b51169166'),
    u('photo-1531403009284-440f080d1e12'),
  ],
};

const GLOBAL_FALLBACK_POOL = [
  ...IMAGE_POOLS.code,
  ...IMAGE_POOLS.business,
  ...IMAGE_POOLS.design,
  ...IMAGE_POOLS.automation,
  ...IMAGE_POOLS.communication,
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
  return /(^|[-_])(practice|tutorials?|learning|coursework|assignments?|notes|starter|templates?)([-_]|$)/i.test(name);
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

  if (/machine[- ]?learning|deep[- ]?learning|tensorflow|pytorch|computer[- ]?vision|\bnlp\b|artificial[- ]?intelligence|\bai\b/.test(haystack)) return 'AI / Machine Learning';
  if (/automation|selenium|playwright|scraper|crawler|bot\b|testing|qa\b/.test(haystack)) return 'Automation / Testing';
  if (/android|flutter|react native|mobile app/.test(haystack)) return 'Mobile Application';
  if (/java swing|swing|desktop|javafx/.test(haystack) || repo.language === 'Java') return 'Desktop Application';
  if (/api\b|backend|express|node\.js|nodejs|rest api|server/.test(haystack) && !/react|frontend|full[- ]?stack/.test(haystack)) return 'Backend / API';
  if (/e[- ]?commerce|ecommerce|shop|store|ordering|booking/.test(haystack)) return 'Full Stack Web App';
  if (/react|next\.js|nextjs|full[- ]?stack|mern|supabase|firebase|postgres|mongodb/.test(haystack)) return 'Full Stack Web App';
  if (/html|css|tailwind|frontend|landing page|website/.test(haystack)) return 'Frontend Web App';
  return 'Software Project';
}

function classifyImagePool(repo, category) {
  const haystack = [repo.name, repo.description, repo.language, ...(Array.isArray(repo.topics) ? repo.topics : []), category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/health|medic|pharma|hospital|doctor|prescription/.test(haystack)) return 'healthcare';
  if (/food|restaurant|ordering|delivery|kitchen|meal/.test(haystack)) return 'food';
  if (/pos|retail|shop|store|cashier|dokan/.test(haystack)) return 'retail';
  if (/solar|energy|renewable/.test(haystack)) return 'solar';
  if (/finance|expense|budget|accounting|money/.test(haystack)) return 'finance';
  if (/coffee|cafe|brew/.test(haystack)) return 'coffee';
  if (/ai|machine learning|deep learning|computer vision|nlp/.test(haystack)) return 'ai';
  if (/automation|testing|qa|selenium|playwright|scraper/.test(haystack)) return 'automation';
  if (/game|fps|arena|gaming/.test(haystack)) return 'gaming';
  if (/morse|communication|network|lan|signal/.test(haystack)) return 'communication';
  if (/mobile|android|ios|flutter|react native/.test(haystack)) return 'mobile';
  if (/ui|ux|design|clock/.test(haystack)) return 'design';
  if (/erp|crm|business|inventory|operations|management/.test(haystack)) return 'business';
  return 'code';
}

function takeFirstUnused(candidates, usedImages) {
  const found = candidates.find((url) => !usedImages.has(url));
  if (found) {
    usedImages.add(found);
    return found;
  }
  return null;
}

function selectProjectImage(repo, category, usedImages) {
  const key = String(repo.name || '').toLowerCase();
  const curated = CURATED[key];

  if (curated?.imageUrl && !usedImages.has(curated.imageUrl)) {
    usedImages.add(curated.imageUrl);
    return curated.imageUrl;
  }

  const poolName = classifyImagePool(repo, category);
  const fromCategory = takeFirstUnused(IMAGE_POOLS[poolName] || [], usedImages);
  if (fromCategory) return fromCategory;

  const fallback = takeFirstUnused(GLOBAL_FALLBACK_POOL, usedImages);
  if (fallback) return fallback;

  // Very unlikely with a curated/selected portfolio. If every image is exhausted,
  // use the category pool again rather than returning a broken image.
  return (IMAGE_POOLS[poolName] || GLOBAL_FALLBACK_POOL)[0];
}

function repoToProject(repo, usedImages) {
  const nameKey = String(repo.name || '').toLowerCase();
  const curated = CURATED[nameKey] || {};
  const featuredIndex = FEATURED.findIndex((name) => name.toLowerCase() === nameKey);
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
    imageUrl: selectProjectImage(repo, category, usedImages),
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
  const rank = FEATURED.findIndex((name) => name.toLowerCase() === project.name.toLowerCase());
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

    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const response = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?type=owner&sort=updated&direction=desc&per_page=100`,
      { headers },
    );

    if (!response.ok) {
      console.error('GitHub API error:', response.status);
      return json({ error: 'Could not load GitHub projects.' }, 502, {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      });
    }

    const repos = await response.json();
    const extraExcluded = csvSet(process.env.PORTFOLIO_EXCLUDE_REPOS);
    const includeRepos = csvSet(process.env.PORTFOLIO_INCLUDE_REPOS);
    const includeMediCraft = String(process.env.PORTFOLIO_INCLUDE_MEDICRAFT || '').toLowerCase() === 'true';
    const hideLearning = String(process.env.PORTFOLIO_HIDE_LEARNING_REPOS || 'true').toLowerCase() !== 'false';

    const filteredRepos = repos
      .filter((repo) => repo && !repo.fork && !repo.archived && !repo.disabled && Number(repo.size || 0) > 0)
      .filter((repo) => !ALWAYS_EXCLUDED.has(String(repo.name).toLowerCase()))
      .filter((repo) => includeMediCraft || String(repo.name).toLowerCase() !== 'medicraft')
      .filter((repo) => !extraExcluded.has(String(repo.name).toLowerCase()))
      .filter((repo) => includeRepos.size === 0 || includeRepos.has(String(repo.name).toLowerCase()))
      .filter((repo) => !hideLearning || !isLearningCollection(String(repo.name)));

    const usedImages = new Set();
    const projects = filteredRepos
      .map((repo) => repoToProject(repo, usedImages))
      .sort((a, b) => score(b) - score(a));

    return json({
      owner: USERNAME,
      count: projects.length,
      projects,
      generatedAt: new Date().toISOString(),
    }, 200, {
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
    });
  } catch (error) {
    console.error('GitHub project loader error:', error instanceof Error ? error.message : 'unknown error');
    return json({ error: 'Could not load GitHub projects.' }, 500);
  }
}

export function POST() {
  return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET' });
}
