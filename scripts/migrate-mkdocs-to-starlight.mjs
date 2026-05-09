import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, posix } from 'node:path';

const owner = 'mrmarganski';
const repo = 'mkdoc';
const branch = 'main';
const root = new URL('..', import.meta.url).pathname;
const docsContentRoot = join(root, 'docs-site/src/content/docs');
const docsPublicRoot = join(root, 'docs-site/public');

const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

function encodePath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.text();
}

async function fetchBytes(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function fetchTree() {
  const response = await fetch(treeUrl);
  if (!response.ok) throw new Error(`Failed to fetch repository tree: ${response.status}`);
  const data = await response.json();
  return data.tree.filter((item) => item.type === 'blob').map((item) => item.path);
}

function parseVariables(source) {
  const variables = new Map();
  const pattern = /([A-Za-z_][A-Za-z0-9_]*):\s*"([\s\S]*?)"/g;
  for (const match of source.matchAll(pattern)) {
    variables.set(match[1], match[2].replace(/\s+/g, ' ').trim());
  }
  return variables;
}

function replaceVariables(source, variables) {
  return source.replace(/\{\{\s*([A-Za-z_][A-Za-z0-9_]*)(?:\s*\|\s*replace\("([^"]*)",\s*"([^"]*)"\))?\s*\}\}/g, (_match, key, from, to) => {
    let value = variables.get(key) ?? key;
    if (from !== undefined) value = value.replaceAll(from, to ?? '');
    return value;
  });
}

function routeForMarkdownTarget(target, sourcePath) {
  const sourceRelativePath = sourcePath.replace(/^docs\//, '');
  const sourceDir = posix.dirname(sourceRelativePath);
  const withoutExtension = target.replace(/\.md$/, '');
  const resolved = posix.normalize(posix.join(sourceDir === '.' ? '' : sourceDir, withoutExtension));
  return `/${resolved}/`;
}

function normalizeLinks(source, sourcePath) {
  return source
    .replace(/!\[([^\]]*)\]\((?:\.\.\/)*img\/([^)]+)\)(?:\{[^}\n]*\})?/g, (_match, alt, imagePath) => `![${alt}](/img/${imagePath})`)
    .replace(/\[([^\]]+)\]\((?!https?:|mailto:|#|\/)([^)\s]+?\.md)(#[^)]+)?\)(?:\{[^}\n]*\})?/g, (_match, label, target, hash = '') => `[${label}](${routeForMarkdownTarget(target, sourcePath)}${hash})`)
    .replace(/\[([^\]]+)\]\(([^)]+)\)(?:\{[^}\n]*(?:md-button|target=|download)[^}\n]*\})/g, '[$1]($2)')
    .replace(/\s+class="[^"]*md-button[^"]*"/g, '')
    .replace(/\{[^}\n]*(?:align=|width=|\.md-button|target=)[^}\n]*\}/g, '');
}

function asideType(type) {
  const normalized = type.toLowerCase();
  if (normalized === 'success' || normalized === 'tip') return 'tip';
  if (normalized === 'warning' || normalized === 'caution') return 'caution';
  if (normalized === 'failure' || normalized === 'danger') return 'danger';
  return 'note';
}

function convertAdmonitions(source) {
  const output = [];
  const stack = [];
  const lines = source.split('\n');

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, '');
    const trimmed = line.trim();
    const indent = line.match(/^\s*/)?.[0].length ?? 0;

    while (stack.length && trimmed && indent <= stack.at(-1).indent) {
      const closing = stack.pop();
      output.push(`${' '.repeat(closing.indent)}:::`);
    }

    const admonition = line.match(/^(\s*)(!!!|\?\?\?)\s+([A-Za-z0-9_-]+)(?:\s+"([^"]+)")?\s*$/);
    if (admonition) {
      const baseIndent = admonition[1].length;
      output.push(`${admonition[1]}:::${asideType(admonition[3])}`);
      if (admonition[4]) output.push(`${admonition[1]}**${admonition[4]}**`);
      stack.push({ indent: baseIndent });
      continue;
    }

    if (stack.length) {
      const baseIndent = stack.at(-1).indent + 4;
      output.push(line.startsWith(' '.repeat(baseIndent)) ? line.slice(baseIndent) : line);
    } else {
      output.push(line);
    }
  }

  while (stack.length) {
    const closing = stack.pop();
    output.push(`${' '.repeat(closing.indent)}:::`);
  }

  return output.join('\n');
}

function stripExistingFrontmatter(source) {
  if (!source.startsWith('---\n')) return source;
  const end = source.indexOf('\n---\n', 4);
  return end === -1 ? source : source.slice(end + 5);
}

function titleFrom(source, fallback) {
  const heading = source.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return (heading || fallback)
    .replace(/[#*_`[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function withFrontmatter(source, title) {
  return `---\ntitle: ${JSON.stringify(title)}\n---\n\n${source.trim()}\n`;
}

function transformMarkdown(source, variables, sourcePath) {
  const withoutFrontmatter = stripExistingFrontmatter(source);
  const substituted = replaceVariables(withoutFrontmatter, variables);
  const normalized = normalizeLinks(substituted, sourcePath);
  const converted = convertAdmonitions(normalized);
  const fallbackTitle = sourcePath.replace(/^docs\//, '').replace(/\.md$/, '').split('/').at(-1) ?? 'Docs';
  return withFrontmatter(converted, titleFrom(converted, fallbackTitle));
}

async function writeEnsured(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, data);
}

async function migrate() {
  const [paths, variablesSource] = await Promise.all([
    fetchTree(),
    fetchText(`${rawBase}variables.yml`)
  ]);
  const variables = parseVariables(variablesSource);

  await rm(docsContentRoot, { recursive: true, force: true });
  await mkdir(docsContentRoot, { recursive: true });
  await mkdir(join(docsPublicRoot, 'img'), { recursive: true });
  await mkdir(join(docsPublicRoot, 'assets'), { recursive: true });

  const markdownPaths = paths.filter((path) => path.startsWith('docs/') && path.endsWith('.md'));
  const imagePaths = paths.filter((path) => path.startsWith('docs/img/'));
  const assetPaths = paths.filter((path) => path.startsWith('docs/assets/'));

  for (const path of markdownPaths) {
    const source = await fetchText(rawBase + encodePath(path));
    const transformed = transformMarkdown(source, variables, path);
    const relativePath = path.replace(/^docs\//, '');
    await writeEnsured(join(docsContentRoot, relativePath), transformed);
  }

  for (const path of [...imagePaths, ...assetPaths]) {
    const bytes = await fetchBytes(rawBase + encodePath(path));
    const publicPath = path.replace(/^docs\//, '');
    await writeEnsured(join(docsPublicRoot, publicPath), bytes);
  }

  const indexPath = join(docsContentRoot, 'index.md');
  const index = await readFile(indexPath, 'utf8');
  await writeFile(
    indexPath,
    index.replace(
      'title: "🐾 Welcome to The Panther Project - FRC Team 2064"',
      'title: "Welcome to The Panther Project - FRC Team 2064"'
    )
  );

  console.log(`Migrated ${markdownPaths.length} Markdown files, ${imagePaths.length} images, and ${assetPaths.length} assets.`);
}

migrate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
