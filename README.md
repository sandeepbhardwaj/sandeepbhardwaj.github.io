# Sandeep Bhardwaj Technical Blog

Production-ready Jekyll blog using **minimal-mistakes-jekyll**, built for technical deep dives and SaaS architecture content.

## Tech profile

- Name: Sandeep Bhardwaj
- Role: Backend Engineer | SaaS Builder
- Focus: Technical deep dives and SaaS architecture
- Stack: Spring Boot, PostgreSQL, Docker, OCI, AWS

## Folder structure

```text
.
├── .github/workflows/deploy-pages.yml
├── .ruby-version
├── Gemfile
├── _config.yml
├── _data/navigation.yml
├── _includes/head/custom.html
├── _pages/
│   ├── about.md
│   ├── categories.md
│   ├── contact.md
│   └── tags.md
├── _posts/
│   └── 2026-02-27-spring-boot-saas-observability-stack.md
├── assets/
│   ├── css/main.scss
│   └── js/theme-toggle.js
├── index.html
└── README.md
```

## Local setup (macOS)

1. Ensure Ruby and Bundler versions:

```bash
ruby -v    # should be 4.0.1
bundle -v  # should be 4.0.7
```

2. Install dependencies fresh:

```bash
bundle install
```

3. Run locally:

```bash
bundle exec jekyll serve
```

4. Open:

- http://127.0.0.1:4000

## GitHub deployment (Pages)

1. Push repository to `sandeepbhardwaj.github.io` on `main`.
2. In GitHub: **Settings > Pages > Source = GitHub Actions**.
3. Push triggers `.github/workflows/deploy-pages.yml`.
4. Site is published to `https://sandeepbhardwaj.github.io`.

## Production notes

- Uses Jekyll `4.4.1`.
- Uses Ruby `4.0.1` and Bundler `4.0.7`.
- Uses `minimal-mistakes-jekyll` theme.
- Pagination, sitemap, feed, and SEO tag enabled.
- Categories/tags archive pages configured.
- Author profile sidebar enabled for posts.
- Dark mode auto-enabled using OS preference.
- Google Analytics placeholder configured in `_config.yml`.
- Google AdSense placeholder included but commented in `_includes/head/custom.html`.

## If you see `tainted?` or `faraday-retry` errors

```bash
rm -rf .bundle vendor/bundle Gemfile.lock
bundle update liquid faraday-retry
bundle install
bundle exec jekyll serve --trace
```

## Configure before launch

- Replace `analytics.google.tracking_id` in `_config.yml`.
- Update contact links if needed.
- Add social preview image at `assets/images/site-og-image.png`.
