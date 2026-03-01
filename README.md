# Sandeep Bhardwaj Blog

Personal technical blog built with Jekyll and the `minimal-mistakes-jekyll` theme.

## Stack

- Jekyll `4.4.1`
- Theme: `minimal-mistakes-jekyll` `4.27.3`
- Ruby version pinned in `.ruby-version` (`4.0.1`)
- GitHub Pages deployment via GitHub Actions

## Run Locally

1. Install Ruby using the version in `.ruby-version`.
2. Install dependencies:

```bash
bundle install
```

3. Start the site:

```bash
bundle exec jekyll serve
```

4. Open `http://127.0.0.1:4000`.

## Common Commands

Build static site:

```bash
bundle exec jekyll build
```

Build with strict front matter checks:

```bash
bundle exec jekyll build --strict_front_matter
```

## Write a New Post

1. Create a file in `_posts/` named:
   `YYYY-MM-DD-your-title.md`
2. Add front matter with at least:
   `title`, `date`, `categories`, `tags`, `excerpt`
3. Add a cover image in `assets/images/` if needed and reference it in front matter.

## Project Structure

```text
.
├── _config.yml                  # Site configuration
├── _posts/                      # Blog posts
├── _pages/                      # Static pages (about, tags, categories, contact)
├── _data/navigation.yml         # Header navigation links
├── _includes/head/custom.html   # Custom head tags/snippets
├── assets/
│   ├── css/                     # Custom styles
│   ├── images/                  # Images and banners
│   └── js/theme-toggle.js       # Light/dark theme toggle logic
├── .github/workflows/ci.yml     # PR/main build checks
└── .github/workflows/deploy-pages.yml # GitHub Pages deploy pipeline
```

## Deployment

- `CI` workflow runs on pull requests and on pushes to `main`.
- On successful CI for `main`, `Deploy Jekyll site to Pages` builds and deploys `_site` to GitHub Pages.
- Live URL: `https://sandeepbhardwaj.github.io`

## Configuration Notes

- Update GA4 ID in `_config.yml` under:
  `analytics.google.tracking_id`
- Update author/contact links in `_config.yml`.
- `README.md` is excluded from Jekyll build output.

## Troubleshooting

If gems become inconsistent:

```bash
rm -rf .bundle vendor Gemfile.lock
bundle install
bundle exec jekyll serve --trace
```
