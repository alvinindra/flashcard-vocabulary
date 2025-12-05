# Flashcard Vocabulary (English ↔ Bahasa Indonesia)

Web flashcard app (React + Tailwind v4) built with Bun. Includes 2,000+ practical vocabulary items and speech synthesis for both languages.

## Requirements

- [Bun](https://bun.sh) v1.3+ (runtime, package manager, bundler)

## Quick start

```bash
# install deps
bun install

# run dev server with HMR
bun dev

# production serve (uses bundled output from src/index.ts)
bun start
```

## Build

Builds all HTML entrypoints in `src` to `dist/` with Tailwind and minification:

```bash
bun run build        # uses build.ts, outputs to dist/
# optional flags (examples):
# bun run build --outdir=dist --sourcemap=linked --minify --public-path=/flashcard-vocabulary/
```

## Deploy to GitHub Pages (recommended)

1. Push the repo to GitHub.
2. Ensure GitHub Pages is set to “Deploy from a branch” and leave it to be managed by Actions.
3. Workflow `.github/workflows/deploy.yml` (added here) will:
   - Install Bun
   - Build to `dist/`
   - Upload the artifact and deploy to Pages
4. Trigger by pushing to `main` (or via “Run workflow” manually).

If your repo uses a project subpath (e.g., `/username/repo`), pass `--public-path=/repo/` to the build (or set that in the workflow) so assets resolve correctly on Pages.

## Project structure

- `src/index.ts` — Bun server entry (serves the SPA)
- `src/frontend.tsx` — React entrypoint
- `src/App.tsx` — UI
- `src/data/vocabulary.json` — vocabulary deck
- `build.ts` — Bun build script (HTML entry discovery, Tailwind plugin)

## Scripts

- `bun dev` — dev server with hot reload
- `bun start` — production serve
- `bun run build` — production bundle to `dist/`

## Notes

- Uses native Web Speech API; pronunciation buttons depend on browser voices.
- All commands use Bun (no npm/yarn/pnpm).
