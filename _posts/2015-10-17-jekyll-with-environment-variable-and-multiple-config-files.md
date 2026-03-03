---
title: Jekyll Environment Variables and Multiple Config Files
date: '2015-10-17'
categories:
- Blogging
tags:
- jekyll
- configuration
- deployment
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Jekyll Environment Variables and Multiple _config Files
seo_description: Configure separate Jekyll settings for local and production builds
  using multiple config files.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Jekyll Environment Variables and Multiple Config Files

When developing locally, you often need different settings than production (URL, analytics, Disqus, etc.).

## Typical Local vs Production Difference

```yaml
# local
url: http://localhost:4000
google_analytics:
disqus_user:
```

```yaml
# production
url: http://sandeepbhardwaj.github.io
google_analytics: UA-XXXXXX-X
disqus_user: your-disqus-id
```

## Option 1: Separate Config File

Create `_config-dev.yml` and run:

```bash
jekyll serve --watch --config _config-dev.yml
```

## Option 2: Override the Base Config

Keep base config and override only changed values:

```bash
jekyll serve --watch --config _config.yml,_config-dev.yml
```

Example `_config-dev.yml`:

```yaml
url: http://localhost:4000
google_analytics:
disqus_user:
```

## Environment Variable Pattern (`JEKYLL_ENV`)

Jekyll exposes `JEKYLL_ENV` so templates can toggle behavior by environment.

Run local development:

```bash
JEKYLL_ENV=development jekyll serve --watch --config _config.yml,_config-dev.yml
```

Run production build:

```bash
JEKYLL_ENV=production jekyll build --config _config.yml,_config-prod.yml
```

In templates:

```liquid
{% if jekyll.environment == "production" %}
  <!-- analytics script -->
{% endif %}
```

This keeps analytics/ads disabled locally while enabling them in production.

## Practical Multi-Environment Setup

A clean structure for growing sites:

- `_config.yml`: shared defaults
- `_config-dev.yml`: localhost URL, debug flags, no analytics
- `_config-staging.yml`: staging URL and test integrations
- `_config-prod.yml`: final URL + production identifiers

Example staging serve:

```bash
JEKYLL_ENV=staging jekyll serve --config _config.yml,_config-staging.yml
```

## Common Pitfalls

1. Overriding too many keys in env files (hard to reason about final config).
2. Hardcoding production URLs inside markdown instead of using `site.url` and `site.baseurl`.
3. Running production build without `JEKYLL_ENV=production`.
4. Forgetting that later config files override earlier ones in `--config`.

## Debug Tip: Inspect Effective Config

To verify what Jekyll is actually using:

```bash
JEKYLL_ENV=development jekyll build --config _config.yml,_config-dev.yml --verbose
```

Use this when local behavior differs from CI or GitHub Pages builds.

## Recommendation

Use option 2 for cleaner maintenance. Keep shared defaults in `_config.yml` and environment-specific overrides in `_config-dev.yml`.

## Key Takeaways

- Separate defaults from environment overrides.
- Keep local and production behavior deterministic.
- Use minimal override files to reduce maintenance overhead.
- Use `JEKYLL_ENV` + config layering for reliable deploy pipelines.
