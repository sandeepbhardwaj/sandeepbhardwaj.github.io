# Code to Architecture

[![CI](https://github.com/sandeepbhardwaj/sandeepbhardwaj.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/sandeepbhardwaj/sandeepbhardwaj.github.io/actions/workflows/ci.yml)
[![Deploy Jekyll site to Pages](https://github.com/sandeepbhardwaj/sandeepbhardwaj.github.io/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/sandeepbhardwaj/sandeepbhardwaj.github.io/actions/workflows/deploy-pages.yml)

Personal technical blog built with Jekyll and the `minimal-mistakes-jekyll` theme.

🌐 Live site: `https://sandeepbhardwaj.github.io`

## Overview

- ⚙️ Static blog powered by Jekyll and Minimal Mistakes
- 🚀 Deployed to GitHub Pages through GitHub Actions
- 📡 Publishes an RSS feed at `https://sandeepbhardwaj.github.io/feed.xml`
- ✉️ Includes a footer subscribe link for `follow.it`

## Tech Stack

- 💎 Ruby `4.0.1`
- 🧱 Jekyll `4.4.1`
- 🎨 `minimal-mistakes-jekyll` `4.27.3`
- 🔄 GitHub Actions for CI and deployment

## Local Development

1. Install Ruby `4.0.1`.
2. Install dependencies:

```bash
bundle install
```

3. Start the site locally:

```bash
bundle exec jekyll serve
```

4. Open `http://127.0.0.1:4000`.

## Useful Commands

🛠️ Run a production-style build:

```bash
bundle exec jekyll build
```

🔍 Run the stricter CI-style build:

```bash
bundle exec jekyll build --strict_front_matter
```

## Content Workflow

📝 Create a new post in `_posts/` using:

```text
YYYY-MM-DD-your-title.md
```

Recommended front matter fields:

- `title`
- `date`
- `categories`
- `tags`
- `excerpt`

Add related cover/banner assets under `assets/images/` when needed.

## Project Structure

```text
.
├── _config.yml
├── _data/navigation.yml
├── _includes/footer/custom.html
├── _includes/head/custom.html
├── _pages/
├── _posts/
├── _sass/custom/
├── assets/
│   ├── css/
│   ├── images/
│   └── js/
└── .github/workflows/
    ├── ci.yml
    └── deploy-pages.yml
```

## CI/CD

`CI` runs on every pull request and on pushes to `main`. It:

- ✅ installs Ruby dependencies
- ✅ builds the site with `bundle exec jekyll build --strict_front_matter`
- ✅ validates that `_site/sitemap.xml` exists and only contains production HTTPS URLs

`Deploy Jekyll site to Pages` runs when:

- `CI` succeeds on `main`
- triggered manually with `workflow_dispatch`
- triggered by the scheduled nightly run

The deploy workflow builds the site and publishes `_site` to GitHub Pages.

## Configuration

Core site settings live in [`_config.yml`](/Users/sandeepbhardwaj/Work/GitHub/sandeepbhardwaj.github.io/_config.yml).

Notable settings:

- 📈 `analytics.google.tracking_id`: GA4 tracking ID
- 👤 `author`: author profile and social links
- 🔗 `footer.links`: footer navigation links
- ✉️ `followit.url`: `follow.it` subscription URL used in the footer
- 🏷️ `followit.footer_label`: footer label text for the subscribe link

## Email Subscriptions

📡 The site exposes an RSS feed at:

```text
https://sandeepbhardwaj.github.io/feed.xml
```

The footer subscribe link is rendered from [`_includes/footer/custom.html`](/Users/sandeepbhardwaj/Work/GitHub/sandeepbhardwaj.github.io/_includes/footer/custom.html) and configured in [`_config.yml`](/Users/sandeepbhardwaj/Work/GitHub/sandeepbhardwaj.github.io/_config.yml).

## Troubleshooting

🧰 If the local environment gets out of sync:

```bash
rm -rf .bundle vendor Gemfile.lock
bundle install
bundle exec jekyll serve --trace
```

`README.md` is excluded from the generated site output.
