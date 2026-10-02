import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  Code2,
  ExternalLink,
  Github,
  Layers3,
  Loader2,
  Search,
  Star,
} from 'lucide-react';
import {
  getGitHubProjects,
  type GitHubPortfolioProject,
} from '../services/githubProjectsService';

const INITIAL_MORE_COUNT = 12;
const LOAD_MORE_COUNT = 12;

type VisualMeta = {
  subtitle: string;
  metricLabel: string;
  metricValue: string;
  accent: string;
  glow: string;
};

const CURATED_VISUALS: Record<string, Partial<VisualMeta>> = {
  'industryops-erp': {
    subtitle: 'Inventory, Sales & Operations Management',
    metricLabel: 'Highlight',
    metricValue: 'Business Suite',
    accent: '#8b5cf6',
    glow: 'rgba(139,92,246,.42)',
  },
  medicraft: {
    subtitle: 'Full-Stack Medical Store & Prescription System',
    metricLabel: 'Metric',
    metricValue: '40% Faster Search',
    accent: '#3b82f6',
    glow: 'rgba(59,130,246,.44)',
  },
  customerrelationshipsystem: {
    subtitle: 'Java Swing Desktop Application',
    metricLabel: 'Metric',
    metricValue: '10k+ Records',
    accent: '#14b8a6',
    glow: 'rgba(20,184,166,.42)',
  },
  'food-ordering-system': {
    subtitle: 'Full-Stack Restaurant Platform',
    metricLabel: 'Metric',
    metricValue: '50% Less Time',
    accent: '#ef4444',
    glow: 'rgba(239,68,68,.43)',
  },
  'point-of-sale-system': {
    subtitle: 'Retail Point of Sale Interface',
    metricLabel: 'Metric',
    metricValue: 'Real-time Sync',
    accent: '#10b981',
    glow: 'rgba(16,185,129,.43)',
  },
  'personal-expense-manager': {
    subtitle: 'Personal Finance & Expense Tracking',
    metricLabel: 'Highlight',
    metricValue: 'Budget Tracking',
    accent: '#0ea5e9',
    glow: 'rgba(14,165,233,.42)',
  },
  brewhouse: {
    subtitle: 'Responsive Coffee Shop Web Experience',
    metricLabel: 'Highlight',
    metricValue: 'Responsive UI',
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,.42)',
  },
};

function slug(value: string) {
  return String(value || '').toLowerCase();
}

function deriveAccent(project: GitHubPortfolioProject) {
  const text = `${project.category} ${project.language}`.toLowerCase();
  if (/health|medic|pharmacy/.test(text)) return ['#3b82f6', 'rgba(59,130,246,.42)'];
  if (/crm|desktop|java/.test(text)) return ['#14b8a6', 'rgba(20,184,166,.42)'];
  if (/food|restaurant|ordering/.test(text)) return ['#ef4444', 'rgba(239,68,68,.42)'];
  if (/pos|retail/.test(text)) return ['#10b981', 'rgba(16,185,129,.42)'];
  if (/erp|business/.test(text)) return ['#8b5cf6', 'rgba(139,92,246,.42)'];
  if (/finance|expense/.test(text)) return ['#0ea5e9', 'rgba(14,165,233,.42)'];
  if (/ai|machine/.test(text)) return ['#d946ef', 'rgba(217,70,239,.42)'];
  if (/automation|testing/.test(text)) return ['#22c55e', 'rgba(34,197,94,.42)'];
  if (/backend|api/.test(text)) return ['#2563eb', 'rgba(37,99,235,.42)'];
  return ['#06b6d4', 'rgba(6,182,212,.42)'];
}

function getVisualMeta(project: GitHubPortfolioProject): VisualMeta {
  const curated = CURATED_VISUALS[slug(project.name)] || {};
  const [accent, glow] = deriveAccent(project);

  let metricValue = project.language || 'Software';
  if (/ai|machine/i.test(project.category)) metricValue = 'AI / ML';
  else if (/automation|testing/i.test(project.category)) metricValue = 'Automated';
  else if (/backend|api/i.test(project.category)) metricValue = 'API Ready';
  else if (/full stack/i.test(project.category)) metricValue = 'Full Stack';
  else if (/desktop/i.test(project.category)) metricValue = 'Desktop App';

  return {
    subtitle: curated.subtitle || project.category,
    metricLabel: curated.metricLabel || 'Highlight',
    metricValue: curated.metricValue || metricValue,
    accent: curated.accent || accent,
    glow: curated.glow || glow,
  };
}

function hashText(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash);
}

function GeneratedPosterArt({ project }: { project: GitHubPortfolioProject }) {
  const meta = getVisualMeta(project);
  const seed = hashText(project.name);
  const text = `${project.name} ${project.category}`.toLowerCase();
  const kind = /food|restaurant|ordering/.test(text)
    ? 'food'
    : /health|medic|pharmacy/.test(text)
      ? 'health'
      : /crm|customer relationship/.test(text)
        ? 'crm'
        : /pos|retail/.test(text)
          ? 'pos'
          : /erp|inventory|business/.test(text)
            ? 'erp'
            : /finance|expense|budget/.test(text)
              ? 'finance'
              : /ai|machine|nlp|vision/.test(text)
                ? 'ai'
                : /automation|testing|selenium|playwright/.test(text)
                  ? 'automation'
                  : 'web';

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 76% 8%, ${meta.glow}, transparent 34%), linear-gradient(145deg, #07111f 0%, #030712 58%, #020617 100%)`,
      }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />

      {kind === 'health' && (
        <>
          <div className="absolute left-[9%] top-[17%] h-[34%] w-[28%] rounded-[30px] border border-white/15 bg-white/10 shadow-2xl" />
          <div className="absolute left-[16%] top-[27%] h-20 w-5 rounded-full bg-white/40" />
          <div className="absolute left-[10.2%] top-[33%] h-5 w-20 rounded-full bg-white/40" />
          <div className="absolute right-[8%] top-[22%] h-24 w-48 -rotate-12 rounded-full border border-white/15 bg-white/10" />
          <div className="absolute right-[18%] top-[43%] h-20 w-40 rotate-[18deg] rounded-full border border-white/15 bg-white/10" />
        </>
      )}

      {kind === 'crm' && (
        <>
          <div className="absolute left-[9%] right-[8%] top-[14%] h-[47%] rounded-[26px] border border-white/10 bg-black/25 p-5">
            <div className="flex h-full items-end gap-3">
              {[38, 68, 54, 82, 64, 92, 72].map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-t-md"
                  style={{ height: `${height}%`, background: `${meta.accent}70` }}
                />
              ))}
            </div>
          </div>
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="absolute bottom-[19%] h-[14%] w-[24%] rounded-2xl border border-white/10 bg-white/[0.07]"
              style={{ left: `${10 + item * 28}%` }}
            >
              <div className="mx-auto mt-4 h-8 w-8 rounded-full bg-white/15" />
            </div>
          ))}
        </>
      )}

      {kind === 'food' && (
        <>
          <div className="absolute left-[14%] top-[16%] h-[46%] w-[72%] rounded-full border-[18px] border-white/10 bg-orange-300/10 shadow-2xl" />
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <span
              key={item}
              className="absolute h-9 w-9 rounded-full"
              style={{
                left: `${28 + ((item * 17 + seed) % 45)}%`,
                top: `${25 + ((item * 13 + seed) % 27)}%`,
                background: item % 2 ? '#f97316aa' : '#ef4444aa',
              }}
            />
          ))}
          <div className="absolute bottom-[20%] left-[18%] h-20 w-[64%] rounded-3xl border border-white/10 bg-white/[0.07]" />
        </>
      )}

      {kind === 'pos' && (
        <>
          <div className="absolute left-[8%] top-[16%] h-[40%] w-[60%] rounded-[30px] border border-white/12 bg-black/25 p-5">
            <div className="grid h-full grid-cols-3 gap-3">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="rounded-xl bg-white/[0.08]" />
              ))}
            </div>
          </div>
          <div className="absolute right-[8%] top-[28%] h-[31%] w-[25%] rounded-[26px] border border-white/12 bg-black/25 p-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="mb-3 h-2 rounded-full bg-white/15" />
            ))}
          </div>
          <div className="absolute bottom-[18%] left-[16%] h-24 w-[68%] rounded-3xl border border-white/10 bg-white/[0.06]" />
        </>
      )}

      {kind === 'erp' && (
        <>
          <div className="absolute left-[8%] right-[8%] top-[12%] h-[30%] rounded-[28px] border border-white/10 bg-black/25 p-5">
            <div className="flex h-full items-end gap-3">
              {[52, 84, 64, 92, 72, 58].map((height, index) => (
                <span key={index} className="flex-1 rounded-t-lg" style={{ height: `${height}%`, background: `${meta.accent}66` }} />
              ))}
            </div>
          </div>
          <div className="absolute bottom-[23%] left-[9%] h-[29%] w-[38%] rounded-[28px] border border-white/10 bg-white/[0.06]" />
          <div className="absolute bottom-[23%] right-[9%] h-[29%] w-[38%] rounded-[28px] border border-white/10 bg-white/[0.05]" />
        </>
      )}

      {kind === 'finance' && (
        <>
          <div className="absolute left-[10%] top-[18%] h-[34%] w-[70%] rounded-[36px] border border-white/12 bg-white/[0.08]" />
          <div className="absolute right-[9%] top-[30%] h-[21%] w-[38%] rounded-[28px] border border-white/12 bg-black/25" />
          <div className="absolute bottom-[21%] left-[10%] right-[10%] h-[25%] rounded-[28px] border border-white/10 bg-black/20 p-5">
            <div className="flex h-full items-end gap-3">
              {[40, 70, 58, 91, 75, 82].map((height, index) => (
                <span key={index} className="flex-1 rounded-t-lg" style={{ height: `${height}%`, background: `${meta.accent}66` }} />
              ))}
            </div>
          </div>
        </>
      )}

      {kind === 'ai' && (
        <>
          {[0, 1, 2, 3, 4].map((item) => (
            <React.Fragment key={item}>
              <div
                className="absolute h-8 w-8 rounded-full border border-white/20 bg-white/10"
                style={{ left: `${15 + item * 15}%`, top: `${20 + ((seed + item * 17) % 35)}%` }}
              />
              {item < 4 && (
                <div
                  className="absolute h-px origin-left rotate-[18deg] bg-white/15"
                  style={{ left: `${19 + item * 15}%`, top: `${29 + ((seed + item * 17) % 31)}%`, width: '18%' }}
                />
              )}
            </React.Fragment>
          ))}
          <div className="absolute bottom-[18%] left-[12%] right-[12%] h-[26%] rounded-[28px] border border-white/10 bg-black/20" />
        </>
      )}

      {kind === 'automation' && (
        <div className="absolute left-[10%] right-[10%] top-[16%] bottom-[22%] rounded-[30px] border border-white/10 bg-black/25 p-6 font-mono text-xs text-white/45">
          {['✓ launch test suite', '✓ authenticate session', '✓ execute workflow', '→ validate response'].map((line) => (
            <div key={line} className="mb-5">{line}</div>
          ))}
        </div>
      )}

      {kind === 'web' && (
        <>
          <div className="absolute left-[8%] right-[8%] top-[14%] h-[46%] rounded-[30px] border border-white/10 bg-black/25 p-5">
            <div className="mb-5 h-3 w-1/3 rounded-full bg-white/15" />
            <div className="mb-4 h-8 w-4/5 rounded-xl bg-white/10" />
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-24 rounded-2xl border border-white/10 bg-white/[0.06]" />
              ))}
            </div>
          </div>
          <div className="absolute bottom-[18%] left-[13%] h-20 w-[74%] rounded-3xl border border-white/10 bg-white/[0.05]" />
        </>
      )}
    </div>
  );
}

function PosterBackground({ project }: { project: GitHubPortfolioProject }) {
  const [failed, setFailed] = useState(false);
  const useImage = Boolean(project.imageUrl) && !failed;

  return (
    <>
      <GeneratedPosterArt project={project} />
      {useImage && (
        <img
          src={project.imageUrl!}
          alt=""
          aria-hidden="true"
          loading={project.featured ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
        />
      )}
    </>
  );
}

function getTags(project: GitHubPortfolioProject) {
  const values = [project.language, ...project.topics].filter(Boolean);
  return Array.from(new Set(values)).slice(0, 3);
}

function ProjectPosterCard({ project }: { project: GitHubPortfolioProject }) {
  const meta = getVisualMeta(project);
  const tags = getTags(project);
  const viewUrl = project.liveUrl || project.repoUrl;

  return (
    <article
      className="group relative isolate aspect-[3/4] min-h-[390px] overflow-hidden rounded-[22px] border border-white/12 bg-slate-950 shadow-[0_22px_80px_rgba(2,6,23,.28)] transition duration-500 hover:-translate-y-1.5 hover:border-white/25"
      style={{ boxShadow: `0 28px 90px ${meta.glow.replace('.42', '.14').replace('.43', '.14').replace('.44', '.14')}` }}
    >
      <PosterBackground project={project} />

      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/15 to-slate-950/95" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_34%,rgba(2,6,23,.22)_52%,rgba(2,6,23,.88)_76%,#020617_100%)]" />

      <div className="absolute left-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-md">
        <Layers3 size={22} aria-hidden="true" />
      </div>

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title} source code`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/90 backdrop-blur-md transition hover:bg-white/15"
        >
          <Github size={16} aria-hidden="true" />
        </a>

        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/15"
        >
          View
          <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>

      {project.featured && (
        <div className="absolute left-5 top-[78px] z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/70 backdrop-blur-md">
          <Star size={10} fill="currentColor" aria-hidden="true" />
          Featured
        </div>
      )}

      <div className="absolute inset-x-5 bottom-5 z-20">
        <h3 className="max-w-[90%] text-[clamp(1.55rem,2vw,2.05rem)] font-black leading-[1.02] tracking-[-0.04em] text-white">
          {project.title}
        </h3>

        <p className="mt-3 min-h-[38px] max-w-[92%] text-[12px] font-medium leading-5 text-white/78">
          {meta.subtitle}
        </p>

        <div className="mt-7 flex items-end justify-between gap-4">
          <div className="flex max-w-[64%] flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[10px] font-bold text-white/88 backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="max-w-[36%] text-right">
            <div className="mb-1 flex items-center justify-end gap-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-white/50">
              <span className="h-3 w-[2px] rounded-full" style={{ background: meta.accent }} />
              {meta.metricLabel}
            </div>
            <div className="text-[15px] font-black leading-[1.08] tracking-tight text-white">
              {meta.metricValue}
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] opacity-75"
        style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)` }}
      />
    </article>
  );
}

function EmptyProjects() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center dark:border-white/10">
      <Layers3 className="mx-auto mb-3 text-slate-400 dark:text-zinc-600" size={30} />
      <p className="font-semibold text-slate-700 dark:text-zinc-300">No matching projects found.</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">Try a different project name, technology, or project type.</p>
    </div>
  );
}

export default function SecureProjectsSection() {
  const [projects, setProjects] = useState<GitHubPortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_MORE_COUNT);

  useEffect(() => {
    const controller = new AbortController();

    getGitHubProjects(controller.signal)
      .then((data) => setProjects(data.projects))
      .catch((err) => {
        if (err?.name !== 'AbortError') setError('Projects could not be loaded right now.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const featured = useMemo(
    () => projects.filter((project) => project.featured).slice(0, 7),
    [projects],
  );

  const categories = useMemo(() => {
    const values = new Set(projects.map((project) => project.category).filter(Boolean));
    return ['All', ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return projects.filter((project) => {
      const categoryMatch = category === 'All' || project.category === category;
      if (!categoryMatch) return false;
      if (!needle) return true;

      return [
        project.title,
        project.name,
        project.description,
        project.category,
        project.language,
        ...project.topics,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [projects, query, category]);

  useEffect(() => {
    setVisibleCount(INITIAL_MORE_COUNT);
  }, [query, category]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <section id="projects" className="relative overflow-hidden py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300/80">
              <Code2 size={16} aria-hidden="true" />
              GitHub Portfolio
            </div>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-slate-950 dark:text-white md:text-5xl">
              Projects I&apos;ve Built
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-zinc-400">
              Real repositories synced from my GitHub profile, presented in the same cinematic project-card style as the original portfolio.
            </p>
          </div>

          <label className="relative block w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search project, type, or technology"
              className="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:placeholder:text-zinc-600"
            />
          </label>
        </div>

        {loading && (
          <div className="flex min-h-[260px] items-center justify-center gap-3 text-sm text-slate-500 dark:text-zinc-400">
            <Loader2 className="animate-spin" size={19} /> Loading GitHub projects…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-300/30 bg-rose-500/5 px-5 py-4 text-sm text-rose-700 dark:text-rose-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {featured.length > 0 && (
              <div className="mb-20">
                <div className="mb-8 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                    <Code2 size={19} aria-hidden="true" />
                  </span>
                  <h3 className="text-2xl font-black tracking-[-0.03em] text-slate-950 dark:text-white">Featured Projects</h3>
                </div>

                <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                  {featured.map((project) => (
                    <ProjectPosterCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-zinc-600">Browse Portfolio</div>
                <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 dark:text-white">More Projects</h3>
              </div>
              <div className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-zinc-500">
                Showing {Math.min(visible.length, filtered.length)} of {filtered.length} • {projects.length} total
              </div>
            </div>

            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold transition ${
                    category === item
                      ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                      : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.025] dark:text-zinc-400 dark:hover:border-white/20'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <EmptyProjects />
            ) : (
              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {visible.map((project) => (
                  <ProjectPosterCard key={project.id} project={project} />
                ))}
              </div>
            )}

            {visibleCount < filtered.length && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + LOAD_MORE_COUNT)}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-3 text-sm font-bold text-cyan-700 transition hover:bg-cyan-500/15 dark:text-cyan-200"
                >
                  Load {Math.min(LOAD_MORE_COUNT, filtered.length - visibleCount)} more
                  <ChevronDown size={17} aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
