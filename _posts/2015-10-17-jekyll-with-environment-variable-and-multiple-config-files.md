---
title: Jekyll Environment Variables and Multiple Config Files
date: '2015-10-17'
categories:
- Blogging
tags:
- jekyll
- configuration
- deployment
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
The cleanest Jekyll setups treat configuration as layered input, not one giant file with commented-out production values.

If local development, staging previews, and production deploys all share the same `_config.yml`, mistakes are not a matter of style.
They become broken URLs, accidental analytics noise, and hard-to-explain differences between your laptop and the deployed site.

## The Core Rule

Keep shared defaults in `_config.yml`.
Put environment-specific overrides in small, separate files.
Use `JEKYLL_ENV` only for behavior that should switch inside templates or runtime logic.

That division keeps the setup easy to reason about.

## Quick Summary

| Concern | Best place | Why |
| --- | --- | --- |
| shared defaults | `_config.yml` | one source of truth for common settings |
| local URL, local-only flags | `_config-dev.yml` | avoids polluting base config |
| staging values | `_config-staging.yml` | useful for previews and pre-prod checks |
| production identifiers | `_config-prod.yml` | keeps deploy-specific values explicit |
| analytics or ad tags inside templates | `JEKYLL_ENV` checks | cleaner than copying template logic across files |

## Why This Matters More Than It Looks

The visible difference between local and production may seem small:

- site URL
- analytics IDs
- Disqus or comments
- cache or indexing toggles
- robots behavior

But the operational difference is large.
Once environment-specific settings are scattered across markdown, includes, and base config, it becomes hard to answer a simple question:

"What config is Jekyll actually using for this build?"

Good configuration structure makes that answer obvious.

## Recommended File Layout

For a site that has local, staging, and production environments:

- `_config.yml`
- `_config-dev.yml`
- `_config-staging.yml`
- `_config-prod.yml`

The base file should contain only values that are genuinely shared.

Example:

```yaml
# _config.yml
title: My Site
markdown: kramdown
permalink: /:categories/:title/
defaults:
  - scope:
      path: ""
    values:
      layout: single
```

Local override:

```yaml
# _config-dev.yml
url: http://localhost:4000
google_analytics:
disqus_user:
```

Production override:

```yaml
# _config-prod.yml
url: https://example.com
google_analytics: UA-XXXXXX-X
disqus_user: your-disqus-id
```

The goal is not to duplicate the whole config tree.
The goal is to override only the few keys that differ by environment.

## How Jekyll Merges Config Files

When you pass multiple config files, later files override earlier ones.

That means:

```bash
jekyll serve --config _config.yml,_config-dev.yml
```

uses `_config.yml` as the base and overlays `_config-dev.yml` on top of it.

That ordering matters.
If you reverse it, the result changes.

This is one of the easiest ways to create confusing behavior, so write the command once in documentation or scripts and reuse it consistently.

## Where `JEKYLL_ENV` Fits

`JEKYLL_ENV` is best for template behavior, not for replacing layered configuration.

Development serve:

```bash
JEKYLL_ENV=development jekyll serve --watch --config _config.yml,_config-dev.yml
```

Production build:

```bash
JEKYLL_ENV=production jekyll build --config _config.yml,_config-prod.yml
```

Template usage:

```liquid
{% if jekyll.environment == "production" %}
  <!-- analytics script -->
{% endif %}
```

This is a strong pattern for things like:

- analytics
- ad scripts
- production-only verification tags
- optional third-party embeds

It is a weaker pattern for core site values that already belong in config files.

## A Practical Setup That Ages Well

If you want a maintainable setup, aim for this split:

### `_config.yml`

Use for:

- site-wide defaults
- plugin configuration shared by every environment
- layouts, collections, markdown engine, permalinks

### `_config-dev.yml`

Use for:

- localhost URL
- debug-oriented flags
- disabling analytics and production-only integrations

### `_config-staging.yml`

Use for:

- preview domain
- test-only service identifiers
- any temporary validation settings needed before production

### `_config-prod.yml`

Use for:

- canonical production URL
- production analytics identifiers
- production comment or search configuration

That layout keeps responsibility clear.

## Common Mistakes That Cause Confusion Later

### Duplicating Too Much Into Override Files

If `_config-dev.yml` is almost a copy of `_config.yml`, you no longer have layering.
You have two sources of truth that will drift.

Keep override files small on purpose.

### Hardcoding Production URLs in Content or Includes

If markdown files or templates contain raw production URLs, your environment system is already leaking.

Prefer `site.url`, `site.baseurl`, and other config-driven values.

### Using `JEKYLL_ENV` Everywhere

Not every difference needs a runtime template branch.
If a value is a configuration concern, keep it in config.
Use environment checks only where the template genuinely changes behavior.

### Forgetting That Order Matters

This command:

```bash
jekyll build --config _config.yml,_config-prod.yml
```

is not the same as:

```bash
jekyll build --config _config-prod.yml,_config.yml
```

If the wrong value keeps winning, check the order before checking everything else.

## How to Inspect What Jekyll Is Really Doing

When a build behaves differently than expected, run with more visibility:

```bash
JEKYLL_ENV=development jekyll build --config _config.yml,_config-dev.yml --verbose
```

This does not magically print every merged key in a perfect format, but it helps distinguish:

- config loading problems
- template conditional problems
- content/linking problems
- plugin behavior differences

The important habit is to debug the effective build, not just the files you think should matter.

## A Small but Valuable Improvement: Script the Commands

If your project uses the same commands repeatedly, put them behind scripts or documented aliases.

Examples:

```bash
bundle exec jekyll serve --config _config.yml,_config-dev.yml
bundle exec jekyll build --config _config.yml,_config-prod.yml
```

That reduces command-order mistakes and makes onboarding easier.

## Practical Recommendation

For most Jekyll sites, the most durable approach is:

1. keep `_config.yml` small and shared
2. add tiny override files per environment
3. use `JEKYLL_ENV` for production-only template behavior
4. avoid duplicating values unless they truly differ
5. document the canonical build commands once

That setup stays understandable even months later.

## Final Checklist

- Can you explain which file owns each environment-specific value?
- Are your override files short enough to scan quickly?
- Are production-only scripts gated by `jekyll.environment`?
- Are canonical commands documented and reused?
- If a local build looks wrong, do you know which config file to inspect first?

If yes, your Jekyll configuration is probably in a healthy place.
