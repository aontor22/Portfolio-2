import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const ignored = new Set(['node_modules', 'dist', '.git', '.vercel']);
const failures = [];
let checked = 0;

async function walk(dir) {
  for (const name of await readdir(dir)) {
    if (ignored.has(name)) continue;
    const file = path.join(dir, name);
    const s = await stat(file);
    if (s.isDirectory()) await walk(file);
    else if (/\.(js|jsx|ts|tsx|html|json|env)$/i.test(name) || name.startsWith('.env')) {
      checked += 1;
      const text = await readFile(file, 'utf8').catch(() => '');
      const rel = path.relative(root, file).replaceAll('\\', '/');
      if (/VITE_GEMINI_API_KEY|VITE_GOOGLE.*API.*KEY/i.test(text)) {
        failures.push(`${rel}: browser-exposed Gemini key reference`);
      }
      if (!rel.startsWith('api/') && /new\s+GoogleGenAI\s*\(/.test(text)) {
        failures.push(`${rel}: GoogleGenAI instantiated outside server API`);
      }
      if (/AIza[0-9A-Za-z_-]{20,}/.test(text)) {
        failures.push(`${rel}: possible hardcoded Google API key`);
      }
    }
  }
}

await walk(root);
if (failures.length) {
  console.error('Security verification FAILED:');
  failures.forEach((f) => console.error(` - ${f}`));
  process.exit(1);
}
console.log(`Security verification passed (${checked} files scanned).`);
