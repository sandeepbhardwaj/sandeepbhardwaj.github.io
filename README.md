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
├── .github/dependabot.yml
├── .github/workflows/ci.yml
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
│   ├── 2026-02-27-java-8-lambdas-practical-guide.md
│   └── 2026-02-28-default-methods-java8-blog.md
├── assets/
│   ├── css/main.scss
│   ├── css/main-dark.scss
│   ├── images/java-lambdas-banner.png
│   ├── images/java-default-methods-banner.svg
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

1. Open a PR to run `.github/workflows/ci.yml` (build + strict front matter checks).
2. Merge to `main` after CI passes.
3. Successful CI on `main` triggers `.github/workflows/deploy-pages.yml`.
4. Site is published to `https://sandeepbhardwaj.github.io`.

## Production notes

- Uses Jekyll `4.4.1`.
- Uses Ruby `4.0.1` and Bundler `4.0.7`.
- Uses `minimal-mistakes-jekyll` theme.
- Pagination, sitemap, feed, and SEO tag enabled.
- Categories/tags archive pages configured.
- Author profile sidebar enabled for posts.
- Header theme toggle supports light/dark, with system preference as default.
- Google Analytics placeholder configured in `_config.yml`.
- Google AdSense placeholder included but commented in `_includes/head/custom.html`.
- Dependabot updates GitHub Actions and Bundler dependencies weekly.

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
