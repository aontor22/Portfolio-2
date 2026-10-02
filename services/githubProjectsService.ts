export interface GitHubPortfolioProject {
  id: string;
  name: string;
  title: string;
  description: string;
  repoUrl: string;
  liveUrl: string | null;
  imageUrl: string | null;
  category: string;
  featured: boolean;
  language: string;
  topics: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  pushedAt: string;
}

export interface GitHubProjectsResponse {
  owner: string;
  count: number;
  projects: GitHubPortfolioProject[];
  generatedAt: string;
}

let cached: GitHubProjectsResponse | null = null;

export async function getGitHubProjects(
  signal?: AbortSignal,
): Promise<GitHubProjectsResponse> {
  if (cached) return cached;

  const response = await fetch('/api/github-projects', {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error('Unable to load projects');
  }

  const data = (await response.json()) as GitHubProjectsResponse;
  cached = data;
  return data;
}

export function clearGitHubProjectsCache() {
  cached = null;
}
