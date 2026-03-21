# Custom Theme Rebuild Roadmap

Internal roadmap for replacing `minimal-mistakes-jekyll` with a custom plain-CSS Jekyll theme without losing site features, monetization, SEO, or content compatibility.

## Mission

Build a custom Jekyll theme in this repo that is:

- plain SCSS/CSS plus vanilla JavaScript
- configurable from `_config.yml` and `_data/`
- compatible with the current content model
- safe to evolve without third-party theme hacks
- deployable through the existing GitHub Actions pipeline
- aligned with Jekyll’s documented directory structure, configuration model, and plugin system

## Non-Negotiables

- Do not break existing URLs or permalinks.
- Do not lose AdSense, analytics, comments, feed, sitemap, archives, or search.
- Do not require mass edits across existing posts.
- Do not hardcode integration IDs in templates.
- Do not remove current per-page opt-outs like `ads: false`.
- Do not replace the current CI and scheduled publishing flow unless parity is proven.
- Do not add framework or plugin complexity unless Jekyll itself is not enough.

## Progress Log

- 2026-03-21: Added `integrations` and `features` config layers to `_config.yml` while preserving the current Minimal Mistakes-compatible keys.
- 2026-03-21: Refactored the live custom head, footer, and comments includes to read the new config contract with legacy fallbacks.
- 2026-03-21: Verified `bundle exec jekyll build --strict_front_matter` and `JEKYLL_ENV=production bundle exec jekyll build`.
- 2026-03-21: Confirmed production-mode behavior in rendered output: AdSense script loads on regular posts, Giscus still renders, Follow.it still renders, and `ads: false` pages do not load the AdSense script.
- 2026-03-21: Replaced the active Minimal Mistakes layout layer with local Jekyll-native layouts for `default`, `home`, `single`, `post`, `page`, taxonomy index pages, and archive taxonomy pages.
- 2026-03-21: Added local includes for header, footer, analytics, hero/header rendering, page metadata, author profile, share links, related posts, pagination, schema, search UI, and custom TOC scaffolding.
- 2026-03-21: Replaced the theme CSS with a custom plain-SCSS system using CSS variables and a single `assets/css/main.scss` entrypoint.
- 2026-03-21: Rebuilt the client-side UX layer with local JavaScript for theme toggle, search, TOC generation, nav behavior, and code-copy buttons while preserving Mermaid and Giscus theme sync.
- 2026-03-21: Added a generated `search.json` index and removed the dependency on Minimal Mistakes search behavior.
- 2026-03-21: Removed the `minimal-mistakes-jekyll` gem, removed theme-specific config/CSS artifacts, and confirmed no remaining runtime or build dependency on Minimal Mistakes.
- 2026-03-21: Verified sequential `bundle exec jekyll build --strict_front_matter` and `JEKYLL_ENV=production bundle exec jekyll build` after the gem removal. Production output still includes analytics, AdSense on eligible pages, Giscus on posts, Follow.it in the footer, and no AdSense script on `ads: false` pages.

## Current Status

Migration complete.

The site now builds and renders from local layouts, includes, SCSS, and JavaScript without the Minimal Mistakes gem or its layout contracts.

## Version And Upgrade Policy

As of 2026-03-21, the version policy should target official stable releases, not speculative or floating dependencies.

Verified baseline:

- Ruby `4.0.2` is listed on the official Ruby releases page with release date `2026-03-16`.
- Jekyll `4.4.1` is the latest stable version shown on RubyGems and is already the repo baseline.

Rules:

- Use the latest stable Ruby release supported by the full Jekyll/plugin stack.
- Use the latest stable Jekyll release only after compatibility is confirmed in CI.
- Use latest stable plugin releases only when they are compatible with the chosen Jekyll and Ruby versions.
- Pin exact gem versions in `Gemfile` where upgrade risk is meaningful.
- Always commit `Gemfile.lock`.
- Prefer incremental upgrades over bulk “update everything” jumps.
- Re-verify official versions before each upgrade wave.

Important correction:

- “Use all latest plugins” should mean “use the latest stable, maintained, compatible plugins”.
- It should not mean “blindly upgrade every gem the day a new release appears”.

## Jekyll-Aligned Implementation Rules

The new theme should follow Jekyll’s documented patterns as closely as possible.

Structure:

- keep layouts in `/_layouts`
- keep reusable partials in `/_includes`
- keep reusable configuration data in `/_data`
- keep Sass partials in `/_sass`
- keep rendered or copied assets in `/assets`
- keep post/page behavior driven by front matter and front matter defaults

Configuration:

- keep site-wide behavior in `_config.yml`
- use front matter defaults instead of repeating layout/config flags in every post
- use `site.data` for navigation, theme options, and reusable metadata
- use Liquid and built-in Jekyll rendering before reaching for custom plugins

Extension strategy:

- prefer official Jekyll features first
- prefer plugins over monkey-patching Jekyll internals
- prefer build-time plugins over runtime DOM hacks when the problem is content generation
- avoid copying third-party theme files unless we fully own that code path

## Plugin Policy

We should keep the plugin surface intentionally small and high-quality.

Selection criteria:

- actively maintained or stable and widely used
- compatible with the current Jekyll major version
- compatible with the current Ruby major version
- build-time focused
- no requirement to fight the theme’s HTML structure
- replaceable without forcing content rewrites

Preferred categories:

- SEO and metadata
- feed and sitemap
- archives and pagination
- content transforms such as admonitions
- timestamps and content metadata

Avoid when possible:

- plugins that own the entire page shell
- plugins that require large amounts of custom override CSS
- plugins that inject fragile client-side behavior into core navigation or layout
- plugins that are abandoned or pinned to outdated Jekyll majors

## Dependency Governance

Use the dependency process below for long-term stability:

- keep Dependabot enabled for Bundler and GitHub Actions
- review release notes before any Jekyll or Ruby major/minor upgrade
- run `bundle exec jekyll build --strict_front_matter` on every upgrade PR
- add a second CI check that runs `bundle exec jekyll doctor` if useful
- upgrade one concern at a time:
  - Ruby
  - Jekyll
  - plugins
  - theme code
- keep a short compatibility note in this roadmap after each upgrade wave

## Preferred Use Of Core Jekyll Features

Before adding any new plugin, check whether Jekyll already supports the capability through:

- layouts
- includes
- data files
- front matter defaults
- collections
- generated JSON or XML pages via Liquid
- Sass support in `/assets`

Example:

- search should ideally use a simple generated `search.json` page plus lightweight client-side JavaScript before considering a search-specific plugin

## Current Source Of Truth

These files define the behavior we must preserve or intentionally replace:

- `_config.yml`
- `Gemfile`
- `.github/workflows/ci.yml`
- `.github/workflows/deploy-pages.yml`
- `_data/navigation.yml`
- `_includes/head/custom.html`
- `_includes/footer/custom.html`
- `_includes/comments-providers/custom.html`
- `_includes/comments-providers/custom_scripts.html`
- `_includes/seo.html`
- `_includes/archive-single.html`
- `_includes/posts-taxonomy.html`
- `assets/js/theme-toggle.js`
- `assets/js/code-copy.js`
- `assets/js/mermaid-init.js`
- `ads.txt`
- `robots.txt`
- `verification-follow_it-Eh2ugYwruBUE7XrB6DR2.html`

## Feature Contract

### Publishing and routing

Must preserve:

- home page
- post pages
- standalone pages
- 404 page
- paginated index pages
- category archive pages
- tag index page
- existing permalink format `/:categories/:title/`
- future-dated publishing via the scheduled deploy workflow

Current implementation notes:

- `index.html` uses `layout: home`
- archives are driven by `jekyll-archives`
- pagination is driven by `jekyll-paginate`
- deploy runs on success, manual trigger, and nightly schedule

### Content and front matter compatibility

The new theme must continue to support these fields without requiring content rewrites:

- `title`
- `date`
- `categories`
- `tags`
- `excerpt`
- `layout`
- `permalink`
- `seo_title`
- `seo_description`
- `canonical_url`
- `toc`
- `toc_label`
- `toc_icon`
- `comments`
- `share`
- `related`
- `ads`
- `author_profile`
- `header.overlay_image`
- `header.image`
- `header.teaser`
- `header.og_image`
- `header.og_image_alt`

### Reader experience

Must preserve:

- light/dark theme toggle
- code copy buttons
- Mermaid rendering and expanded viewer
- GitHub-style admonitions
- table of contents
- read time
- related posts
- share links
- search

Important note:

- Search is currently inherited from Minimal Mistakes behavior, so a custom theme must explicitly replace that UI and search index flow. This is a parity requirement, not a nice-to-have.

### Integrations and monetization

Must preserve:

- Google AdSense account meta tag
- production-only AdSense script loading
- page-level ad opt-out with `ads: false`
- `ads.txt`
- Google site verification meta
- Google Analytics `gtag`
- Giscus comments
- Giscus light/dark theme sync
- Follow.it footer subscribe link
- RSS feed
- sitemap
- SEO and social metadata
- last-modified metadata in SEO output

### Static assets and trust files

Must preserve:

- `favicon.ico`
- `assets/images/favicon.svg`
- `robots.txt`
- `ads.txt`
- Follow.it verification HTML file
- site OG image assets

## Recommended Architecture

Use the same repo on a dedicated branch such as `theme-v2`.

Do not build the new theme in a separate empty repository. Building in-place is safer because:

- real content is available for testing immediately
- existing permalinks and data stay intact
- CI and deployment can validate the migration continuously
- rollback is simple

## Layout Strategy

Content-facing layouts:

- `post.html`
- `page.html`

Support layouts and templates:

- `default.html`
- `home.html`
- `archive.html`
- `404.html` or a dedicated not-found wrapper

Reasoning:

- The blog can stay conceptually simple with two main content layouts.
- We should still use dedicated support templates for home, archives, and not-found pages instead of stuffing conditionals into one page layout.

## Target File Structure

```text
_layouts/
  default.html
  post.html
  page.html
  home.html
  archive.html

_includes/
  head.html
  seo.html
  analytics.html
  adsense.html
  header.html
  nav.html
  footer.html
  post-hero.html
  post-meta.html
  toc.html
  related-posts.html
  share-links.html
  comments.html
  search.html
  archive-card.html
  taxonomy-list.html

_data/
  navigation.yml
  theme.yml

assets/css/
  main.scss

assets/js/
  main.js
  theme-toggle.js
  code-copy.js
  mermaid-init.js
  search.js
```

## Configuration Model

Move all integration values out of templates and into config.

Recommended structure:

```yml
integrations:
  adsense:
    enabled: true
    client: "ca-pub-..."
    load_in_production_only: true
    auto_ads: true
  google_site_verification: "..."
  analytics:
    provider: "google-gtag"
    tracking_id: "G-..."
    anonymize_ip: true
  comments:
    provider: "giscus"
    enabled: true
    repo: "owner/repo"
    repo_id: "..."
    category: "Comments"
    category_id: "..."
    mapping: "pathname"
    strict: "0"
    reactions_enabled: "1"
    input_position: "top"
    light_theme: "light"
    dark_theme: "dark_dimmed"
    lang: "en"
    loading: "lazy"
  newsletter:
    provider: "followit"
    enabled: true
    url: "https://follow.it/..."
    footer_label: "Subscribe via email"

features:
  search:
    enabled: true
    provider: "simple-jekyll-search"
  toc:
    enabled_by_default: false
    sticky: false
    default_label: "In This Article"
    default_icon: "cog"
  theme_toggle: true
  mermaid: true
  code_copy: true
  read_time: true
  related_posts: true
  social_share: true
  author_box: true
```

Rules:

- Page-level front matter overrides must win over site defaults.
- No provider IDs should remain hardcoded in includes.
- Legal pages must remain able to disable ads.
- Keep config names human-readable and close to Jekyll naming where practical.

## Search Recommendation

Recommended default for the custom theme:

- use a lightweight client-side search implementation independent of Minimal Mistakes
- prefer a generated `search.json` file over an extra Ruby plugin if parity is good enough

Preferred order:

1. `Simple-Jekyll-Search` with generated `search.json`
2. Lunr if stronger ranking becomes necessary
3. Algolia only if external indexing is intentionally adopted later

Why:

- simpler than re-creating theme-specific search behavior
- no dependency on the old theme's JavaScript stack
- easier to style with a custom UI

## Theme System Recommendation

Replace the current dual-stylesheet light/dark approach with:

- one compiled stylesheet
- CSS variables for tokens
- `[data-theme="light"]` and `[data-theme="dark"]` overrides

Why:

- simpler runtime logic
- smaller surface area than swapping entire stylesheets
- easier to keep Giscus and Mermaid visually aligned

## Migration Phases

### Phase 0: Freeze the contract

- Create this roadmap and keep it updated.
- Capture screenshots of key pages before migration.
- Confirm current official stable Ruby, Jekyll, and plugin versions before beginning migration work.
- List parity pages for testing:
  - one long DSA post
  - one backend/concurrency post
  - one legal page
  - one archive page
  - home page
  - 404 page

### Phase 1: Build the shell

- Add custom `default.html`, `post.html`, `page.html`, `home.html`, and `archive.html`.
- Build top navigation from `_data/navigation.yml`.
- Build header, footer, main container, and typography system.
- Follow the standard Jekyll directory layout rather than inventing new theme conventions.
- Keep the current theme gem installed until the shell is stable.

### Phase 2: Port content rendering

- Port post hero rendering from existing front matter.
- Port post metadata, read time, and last-modified display if desired.
- Port archive cards and taxonomy pages.
- Port pagination UI.
- Keep permalink and archive URLs unchanged.

### Phase 3: Port integrations

- Port SEO include behavior first, then refactor only after parity.
- Port AdSense config and production-only loading.
- Port analytics config.
- Port Giscus comments and theme sync.
- Port Follow.it footer CTA.
- Preserve `ads.txt`, verification files, robots, and favicon assets.

### Phase 4: Port reader UX

- Rebuild theme toggle using CSS variables.
- Port code copy behavior.
- Port Mermaid rendering and viewer.
- Port TOC rendering with a theme-native layout.
- Rebuild search UI and search data flow.
- Rebuild share links and related posts.

### Phase 5: Remove theme dependency

- Remove `minimal-mistakes-jekyll` only after parity is confirmed.
- Remove obsolete Minimal Mistakes overrides and inherited assumptions.
- Keep existing Jekyll plugins unless we intentionally replace one.
- Do not keep compatibility code that exists only to mimic old theme markup.

### Phase 6: Regression pass

- Run `bundle exec jekyll build --strict_front_matter`.
- Re-run the build on the current target Ruby version after any version bump.
- Run normal production build.
- Verify sitemap and feed output.
- Verify ads only load in production.
- Verify pages with `ads: false` stay ad-free.
- Verify comments load only where enabled.
- Verify search works on desktop and mobile.
- Verify future-dated posts still publish via scheduled deploy.

## Definition Of Done

The migration is done only when all of the following are true:

- every current post and page renders without front matter changes
- URLs and canonical tags are unchanged unless explicitly approved
- AdSense, analytics, comments, feed, sitemap, search, and archives all work
- legal pages still support `ads: false`
- theme toggle still updates comments and Mermaid correctly
- CI and deploy workflows pass unchanged or with clearly justified improvements
- no remaining dependency exists on Minimal Mistakes layout markup or assets

## Things We Should Not Do

- Do not keep a hybrid system where the new theme still depends on old theme markup.
- Do not hardcode AdSense, Giscus, analytics, or Follow.it values inside templates.
- Do not reintroduce layout hacks for TOC/sidebar behavior.
- Do not force all page types through one giant layout with many conditionals.
- Do not remove search just because the old theme provided it implicitly.
- Do not chase “latest” by removing version pins and hoping Bundler resolves everything safely.
- Do not build around undocumented theme internals when Jekyll has a documented first-class mechanism.

## First Execution Checklist

- [ ] Create `theme-v2` branch
- [ ] Scaffold new layouts and includes
- [x] Introduce `site.integrations` and `site.features` config structure
- [ ] Port header, footer, nav, and base typography
- [ ] Port home, post, page, archive, and 404 templates
- [ ] Port SEO, AdSense, analytics, comments, and newsletter
- [ ] Port theme toggle, Mermaid, code copy, TOC, search, share, and related posts
- [ ] Validate build, routing, sitemap, feed, and future-post publishing
- [ ] Remove Minimal Mistakes gem and obsolete overrides

## Open Decisions

- Search provider: `Simple-Jekyll-Search` vs Lunr
- Whether related posts remain Jekyll-native or become category/tag based
- Whether TOC should be inline-only or sticky within the article column
- Whether author profile should stay page-only or become a reusable post component
- Whether to package the custom theme as a gem later, after the in-repo implementation is stable

## Reference Notes

Official references that should guide implementation and upgrades:

- Jekyll Configuration docs
- Jekyll Themes docs
- Jekyll Plugins docs
- Jekyll Directory Structure docs
- Jekyll Data Files docs
- Jekyll Front Matter docs
- Jekyll Assets docs
- Ruby official releases page
- RubyGems release pages for Jekyll and every production plugin
