# Sulu Hub

Sulu Hub is a small Nuxt application that lists and showcases community bundles for the [Sulu](https://sulu.io) CMS.  
Bundle metadata is stored as markdown files and automatically enriched (GitHub stars, downloads, Sulu version, etc.) whenever the app starts.

---

## Goals

- **Discoverability**: Provide a browsable, searchable overview of Sulu bundles in one place.
- **Up‑to‑date metadata**: Keep stars, downloads and repository activity fresh via an automatic updater.
- **Simple contribution model**: Make it easy to add new bundles via a single markdown file per bundle.

---

## Tech Stack

- **Nuxt 4** (`nuxt`) as the application framework.
- **Nuxt UI** (`@nuxt/ui`) for the component library and styling baseline.
- **Nuxt Content** (`@nuxt/content`) to source bundle data from markdown files under `content/bundles`.
- **Tailwind CSS 4** (`tailwindcss`) for additional utility styling.
- **Custom Nuxt module** `bundles-metadata-updater`  for keeping bundle metadata in sync with GitHub and Packagist.

---

## Setup

Make sure to install the dependencies:

```bash
npm install
```

---

## Development

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

This will:

- Launch the Nuxt dev server.
- Run the `bundles-metadata-updater` module once on startup to refresh bundle metadata if the last update is older than its configured max age (24h by default).

---

## Production

Build the application for production:

```bash
npm run generate
```

Locally preview the production build:

```bash
npm run preview
```

On each cold start of the Nuxt app (build or dev), the `bundles-metadata-updater` module runs once and refreshes bundle markdown frontmatter where needed.

---

## How bundles are stored

- All bundles live under `content/bundles/*.md`.
- The bundle collection schema is defined in `content.config.ts`.
- Each file uses frontmatter with fields like `title`, `packageName`, `githubStars`, `totalDownloads`, `targetSuluVersion`, `lastRepositoryUpdate`, and `categories`.

You normally only need to author the static parts; the updater takes care of dynamic metadata (`githubStars`, `totalDownloads`).

---

## Adding a new bundle

There are two ways to add a bundle entry.

### 1. Using the `generate-bundle-md` skill (recommended)

If you are using this repository in an AI‑assisted environment (Cursor with the `generate-bundle-md` skill enabled), you can:

- Provide one or more GitHub repository URLs for Sulu bundles.
- Let the skill:
  - Fetch `composer.json` and `README.md` from GitHub.
  - Create a new markdown file under `content/bundles/` with the correct filename, frontmatter keys and types.
  - Pre‑fill:
    - `title` and `packageName`.
    - `shortDescription` and body text from the README.
    - `license` and `githubMaintainer`.
    - `githubLink` and initial `categories`.

### 2. Manually creating a markdown file

If you prefer to do it by hand:

1. **Create a file** under `content/bundles/`, e.g. `sulu-tailwind-theme-bundle.md`.  
   - Filenames are typically the bundle name in kebab case, ending with `-bundle.md`.
2. **Add frontmatter** matching the schema in `content.config.ts`

3. **Run the app** (`npm run dev` or `npm run generate`) so that the metadata updater can enrich the new entry.