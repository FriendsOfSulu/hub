---
name: generate-bundle-md
description: Generate new bundle markdown files in content/bundles from a GitHub repository URL for this sulu-hub project, using composer.json and README to fill frontmatter and summary.
---

# Generate bundle markdown from a GitHub repo

## When to use

Use this skill whenever the user provides one or more GitHub repository links and wants new bundle entries created under `content/bundles` that match the existing bundle schema.

## Target format

Create one `.md` file per bundle in `content/bundles/` with this frontmatter shape (follow exact keys and order):

```yaml
---
title: <BundleClassLikeName>
packageName: <vendor/package>
shortDescription: <single-sentence summary from README>
license: <SPDX id, e.g. MIT>
githubMaintainer: <GitHub owner or organization>
githubLink: "<https://github.com/owner/repo>"
githubAvatar: ""
githubStars: 0
totalDownloads: 0
latestRelease: ""
targetSuluVersion: ""
lastRepositoryUpdate: "1970-01-01T00:00:00.000Z"
categories: []
---
<1–2 sentence description from README, can match shortDescription>
```

The required keys are defined in `content.config.ts` for the `bundle` collection; keep types consistent (`githubStars`/`totalDownloads` are numbers, `categories` is a string array, dates are ISO strings).

## Filename and title rules

- **Filename**: start from the GitHub repo name (`owner/repo` → `repo`), lowercase, keep dashes, add `.md`, and put it in `content/bundles/` (e.g. `SuluTailwindThemeBundle` → `sulu-tailwind-theme-bundle.md`).
- If there are likely collisions (e.g. multiple `SuluNewsBundle`), prefix the slug with the vendor in lowercase (e.g. `manuxi-sulu-news-bundle.md`, `thecadien-sulu-news-bundle.md`).
- **title**: use the bundle class-style name from README or repo name (strip `-bundle` suffix, convert to StudlyCase, keep `Sulu` prefix), e.g. `SuluTailwindThemeBundle`, `YiggleFormWizardBundle`.

## How to populate frontmatter

Given a GitHub URL like `https://github.com/owner/repo`:

1. **Fetch composer.json**
   - Read `https://raw.githubusercontent.com/owner/repo/main/composer.json`.
   - If that 404s, retry with `master` instead of `main`.
   - From composer data:
     - `packageName`: `composer.name` (e.g. `"itech-world/sulu-tailwind-theme-bundle"`).
     - `license`: `composer.license` (string or first element of array).
     - `targetSuluVersion`: value of `"sulu/sulu"` in `composer.require` if present, otherwise leave as empty string.

2. **GitHub metadata**
   - `githubMaintainer`: the `owner` segment from the URL (e.g. `steeven-th`, `Predjee`).
   - `githubLink`: the original HTTPS URL.
   - Leave `githubAvatar`, `githubStars`, `totalDownloads`, `latestRelease`, and `lastRepositoryUpdate` as their default placeholder values; they will be filled later by the bundles metadata updater.

3. **Description fields (README-based)**
   - Fetch `README.md` from `main` (fallback `master`) via raw GitHub.
   - Derive:
     - `shortDescription`: a **single sentence** (plain text, no markdown) summarizing what the bundle does, focusing on its main purpose in Sulu (e.g. “Complete theming system for Sulu 3 that manages design tokens in the admin and compiles them to Tailwind-based CSS custom properties.”).
     - Body text: 1–3 short sentences expanding the same idea; you may reuse or slightly rephrase the first line of the README.

## Category assignment

Use at most **two** categories from a set of categories that can be retrieved from `app/components/BundleList.vue`.

Guidance:

- `form`: bundles primarily about forms, form wizards, submissions, or contact handling.
- `content`: bundles that power or structure site content (pages, wiki, documentation, theming of page blocks, etc.).
- `blog`: article/news/blog-oriented features or article-related helpers.
- `media`: image/video/file related features.
- `translation`: i18n or translation features.
- `seo`: search-engine-related features (sitemaps, IndexNow, meta fields).
- `events`: event management or calendaring.
- `settings`: cross-cutting configuration or site-wide settings in the admin.
- `dx`: developer-experience utilities (tooling, infrastructure, low-level helpers).

Pick the **primary** category first, then a second only if it clearly applies.

## Final checks

Before saving the new `.md` file:

1. Ensure all required frontmatter keys exist and types match the existing bundle files.
2. Confirm `packageName` and `license` came from `composer.json` (not guessed).
3. Confirm `shortDescription` is one sentence, no markdown formatting.
4. Ensure `categories` contains 0–2 valid category strings (no typos, all lowercase).
5. Place the file under `content/bundles/` with the correct slugified filename.
