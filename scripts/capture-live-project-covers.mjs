import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const USERNAME = 'aontor22';
const OUTPUT_DIR = path.resolve('public/project-covers/live');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');

function coverSlug(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project';
}

function parseEnvFile(text) {
  const values = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const index = line.indexOf('=');
    if (index < 1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

async function loadLocalEnv() {
  for (const file of ['.env.local', '.env']) {
    try {
      const text = await fs.readFile(file, 'utf8');
      const values = parseEnvFile(text);
      for (const [key, value] of Object.entries(values)) {
        if (process.env[key] == null) process.env[key] = value;
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
}

function normalizeLiveUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(String(value));
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (['localhost', '127.0.0.1'].includes(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function fetchRepos() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'aontor22-portfolio-cover-capture',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?type=owner&sort=updated&direction=desc&per_page=100`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(`GitHub API failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function screenshotUrl(liveUrl) {
  // Thum.io returns a real browser screenshot. noanimate asks for the final PNG.
  // The saved file is local/committed, so portfolio visitors do not repeatedly
  // call the screenshot service at runtime.
  return `https://image.thum.io/get/noanimate/width/1200/crop/900/maxAge/1/?url=${encodeURIComponent(liveUrl)}`;
}

async function downloadScreenshot(repo, liveUrl, destination) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch(screenshotUrl(liveUrl), {
      headers: {
        Accept: 'image/png,image/*;q=0.9,*/*;q=0.5',
        'User-Agent': 'aontor22-portfolio-cover-capture',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Screenshot service returned ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('image/')) {
      throw new Error(`Expected image but received ${contentType || 'unknown content type'}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 2_000) {
      throw new Error(`Screenshot response too small (${buffer.length} bytes)`);
    }

    await fs.writeFile(destination, buffer);
    return buffer.length;
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  await loadLocalEnv();
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const repos = await fetchRepos();
  const liveRepos = repos
    .filter((repo) => repo && !repo.fork && !repo.archived && !repo.disabled)
    .map((repo) => ({ repo, liveUrl: normalizeLiveUrl(repo.homepage) }))
    .filter((item) => item.liveUrl);

  console.log(`Found ${liveRepos.length} repositories with live URLs.`);
  console.log('Capturing real website screenshots...\n');

  const manifest = [];
  let success = 0;
  let failed = 0;

  for (let index = 0; index < liveRepos.length; index += 1) {
    const { repo, liveUrl } = liveRepos[index];
    const fileName = `${coverSlug(repo.name)}.png`;
    const destination = path.join(OUTPUT_DIR, fileName);
    const label = `[${index + 1}/${liveRepos.length}] ${repo.name}`;

    try {
      const bytes = await downloadScreenshot(repo, liveUrl, destination);
      success += 1;
      manifest.push({
        repo: repo.name,
        liveUrl,
        image: `/project-covers/live/${fileName}`,
        bytes,
        capturedAt: new Date().toISOString(),
        status: 'ok',
      });
      console.log(`✓ ${label} -> ${fileName} (${Math.round(bytes / 1024)} KB)`);
    } catch (error) {
      failed += 1;
      manifest.push({
        repo: repo.name,
        liveUrl,
        image: `/project-covers/live/${fileName}`,
        capturedAt: new Date().toISOString(),
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`✗ ${label}: ${error instanceof Error ? error.message : error}`);
    }

    // Be polite to the screenshot service and avoid bursts.
    await new Promise((resolve) => setTimeout(resolve, 900));
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  console.log('\nDone.');
  console.log(`Successful: ${success}`);
  console.log(`Failed:     ${failed}`);
  console.log(`Manifest:   ${path.relative(process.cwd(), MANIFEST_PATH)}`);

  if (failed > 0) {
    console.log('\nFailed captures will automatically use the card fallback visual.');
    console.log('Re-run this script later to retry them.');
  }
}

main().catch((error) => {
  console.error('\nCover capture failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
