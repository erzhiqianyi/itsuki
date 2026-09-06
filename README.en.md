# Itsuki's Digital Garden

[日本語](README.md) · **English**

A personal website that grows over time, documenting software development, Japanese learning, photography, videos, and everyday thoughts.

[Visit the website](https://erzhiqian.cc) · [Report an issue](https://github.com/erzhiqianyi/itsuki/issues) · [Content maintenance](docs/content-maintenance.md)

This repository contains the site's source code and the author's own content. You can use it as a reference for building a digital garden. When adapting it for your own site, replace the profile, media, and external links.

## Features

- **Articles**: Markdown content, categories, tags, featured posts, and pagination.
- **Photography**: Albums, photo previews, and browsing by tag.
- **Projects and videos**: Descriptions, screenshots, video metadata, and external links.
- **Personal records**: A Now page, biography, Japanese learning, books/films/games archive, and changelog.
- **Static publishing**: HTML and a sitemap are generated at build time. No application backend or database is required.

The site is primarily in Japanese. Some content and configuration fields support English, but not every page has a complete bilingual version.

## Tech stack

Astro 5, TypeScript, React 19, Tailwind CSS 3, and Astro Icon / Lucide. Content is managed mainly through Markdown, YAML, and Astro Content Collections.

See [package.json](package.json) for dependency and command definitions.

## Getting started

### Requirements

- Node.js 22 or later, satisfying the installed Astro version's `engines` requirements.
- npm 9.6.5 or later.
- Git.

Basic development and builds do not require API keys or an `.env` file. The X diary import script additionally requires Python 3; you do not need to run it to develop the website.

### Run locally

```sh
git clone https://github.com/erzhiqianyi/itsuki.git
cd itsuki
npm install
npm run dev
```

The default address is [localhost:3000](http://localhost:3000). Check the terminal output for the actual address. The current configuration also allows access over your local network. To use a specific port and restrict access to localhost:

```sh
npm run dev -- --host 127.0.0.1 --port 4322
```

### Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm start` | Alias for `npm run dev` |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Preview the built site locally; run the build first |
| `npm run astro -- check` | Run Astro / TypeScript diagnostics |

There are currently no dedicated `test` or `lint` scripts. Building and type checking are separate checks.

## Project structure

```text
src/
├── pages/                    # Pages and dynamic routes
├── layouts/                  # Page layouts
├── components/               # Astro / React components
├── styles/                   # Shared and page-specific styles
├── data/
│   ├── site-config.yaml      # Branding, social links, and shared copy
│   └── site-config.ts        # Configuration loading and types
└── content/
    ├── content.config.ts     # Collection and field definitions
    ├── blog/                 # Articles and journals
    ├── photos/               # Photography and albums
    ├── projects/             # Project information
    ├── videos/               # Video information
    ├── page-copy/            # Page copy
    ├── now/                  # Current activities
    ├── about/                # Biography
    ├── japanese/             # Japanese learning
    ├── archive/              # Books, films, and games
    └── changelog/            # Update history
public/                       # Static files copied unchanged to the build
scripts/                      # Content import tools
docs/                         # Content maintenance and sync documentation
astro.config.mjs              # Site URL, integrations, and build settings
```

## Managing content

Refer to the [collection definitions](src/content/content.config.ts) and existing files in the relevant directory for field requirements. To add content, copy a similar file and edit its frontmatter. Images usually belong in `public/assets/` and are referenced as `/assets/...` in content.

For example, add a Japanese article as a `.md` file under `src/content/blog/ja/`:

```markdown
---
lang: ja
title: "はじめての記事"
summary: "記事の短い紹介。"
date: "2026-09-06"
category: "日常"
tags: ["日記"]
coverImage: "/assets/blog/my-first-post.jpg"
featured: false
---

ここから本文を書きます。
```

Replace the sample cover with a real image and verify that its path exists. After saving, check the article listing and detail page, then run a build.

Further maintenance documentation is currently written in Chinese:

- [Content maintenance](docs/content-maintenance.md): Where each content type lives and how to edit it.
- [X diary backup](docs/x-backup.md): Capture scope, external source data, import commands, and backup limitations.
- [YouTube video sync](docs/youtube-sync.md): Sync scope and update steps. Scheduled automatic syncing is not currently configured.

Raw X capture data is stored outside this repository and is not included when cloning it. Existing content can be built without that data; re-importing requires you to supply the source file separately.

## Adapting the site

1. Change `site` in [astro.config.mjs](astro.config.mjs) to your deployment domain. It is used to generate the sitemap and related information.
2. Update `brand.siteUrl`, branding, social links, and personal copy in [site-config.yaml](src/data/site-config.yaml) to match your site.
3. Replace `brand.googleAnalyticsId` with your own ID, or set it to an empty string to disable Google Analytics in the current layouts.
4. Replace personal content in `src/content/` and images and icons in `public/`. Also review navigation and external links written directly in layouts and pages.

The current pages use Google Fonts and optionally load Google Analytics based on configuration. Some content also references external media. Adjust these resources if you want to host everything yourself.

## Building and deploying

```sh
npm run build
npm run preview
```

After checking the preview, publish `dist/` to a hosting service that supports static websites.

| Setting | Value |
| --- | --- |
| Project root | Repository root |
| Dependency installation | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js | The same compatible version used locally |

This repository does not include an automated deployment workflow. Configure the domain, deployment branch, and hosting settings on your hosting platform. `npm run preview` is for local checks and does not publish the site.

## Contributing

Bug reports and improvement ideas are welcome through [Issues](https://github.com/erzhiqianyi/itsuki/issues), as are pull requests. Please discuss substantial feature or design changes in an issue first.

1. Fork the repository and create a working branch.
2. Keep changes focused and update documentation where needed.
3. Run `npm run astro -- check` and `npm run build`, and describe the results and any problems in your PR.
4. For UI changes, check desktop and mobile layouts and include screenshots. For content changes, verify listings, detail pages, and image links.

Bug reports should include reproduction steps, expected and actual behavior, and relevant browser or Node.js versions. Do not commit API keys, credentials, or private capture data.

## License

This repository includes the [Apache License 2.0](LICENSE). Refer to the respective licenses and source notices for third-party dependencies and assets as well.
