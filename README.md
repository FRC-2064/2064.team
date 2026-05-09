# 2064.team Website & Docs

Astro monorepo for the Team 2064 public website and Starlight documentation site.

## Workspaces

- `main-site`: public site for `2064 | The Panther Project`
- `docs-site`: Starlight docs site for `docs.2064.team`

## Commands

Use Bun consistently:

```bash
bun install
bun run dev
bun run check
bun run build
```

The root `bun run dev` command starts both apps:

- Main site: <http://localhost:4321>
- Docs site: <http://localhost:4322>

## Content Editing

Robots and events are powered by Astro Content Collections.

- Add robots in `main-site/src/content/robots/`
- Add events in `main-site/src/content/events/`

Each new entry can be a Markdown or MDX file with frontmatter matching `main-site/src/content.config.ts`.

## Deployment

Deploy the repo as two Vercel projects:

- Main project root directory: `main-site`
- Docs project root directory: `docs-site`

No root-level Vercel rewrite is required for the baseline.
