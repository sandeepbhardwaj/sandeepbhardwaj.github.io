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

## Recommendation

Use option 2 for cleaner maintenance. Keep shared defaults in `_config.yml` and environment-specific overrides in `_config-dev.yml`.

## Key Takeaways

- Separate defaults from environment overrides.
- Keep local and production behavior deterministic.
- Use minimal override files to reduce maintenance overhead.
