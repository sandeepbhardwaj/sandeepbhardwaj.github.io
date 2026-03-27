# Theme Hardening Roadmap

Implementation roadmap for the post-migration improvements identified during the custom theme review.

## Goals

- tighten search performance and accessibility
- remove empty TOC rail states
- activate the reading progress experience
- improve long-form reading ergonomics
- strengthen keyboard and focus accessibility
- make taxonomy filtering and code-copy feedback clearer
- remove unused font loading overhead

## Workstreams

### 1. Search UX, Accessibility, And Payload

- reduce `search.json` content payload so the modal opens and responds faster
- keep scoring based on title, taxonomy, excerpt, and a shorter content snippet
- add modal focus trapping
- restore focus to the opening control when search closes
- make background content inert while the modal is open
- add better load failure handling and live status updates

### 2. Article Navigation And Reading Flow

- collapse the TOC rail completely when a page has no generated headings
- keep the article shell full-width when the TOC is absent
- enable the sticky header so the reading progress bar is visible and useful
- keep heading anchors and TOC behavior aligned with the sticky header offset

### 3. Content Ergonomics

- restore a bounded reading measure for direct article children
- preserve full-width treatment for tables, Mermaid diagrams, taxonomy pages, and figures
- refine focus-visible states for navigation, taxonomy links, TOC links, search results, and buttons
- make code-copy success and failure states visible without relying only on color

### 4. Taxonomy Directory Usability

- filter both the left taxonomy index and the accordion sections
- automatically open the first matching section when filtering
- keep empty-state messaging accurate when no taxonomies match

### 5. Theme Cleanup

- remove unused webfont requests from the document head
- verify the site still builds cleanly with strict front matter checks

## Verification

- run `bundle exec jekyll build --strict_front_matter`
- confirm search modal keyboard flow
- confirm TOC rail disappears on pages without headings
- confirm reading progress appears once the header is sticky
- confirm taxonomy filtering hides both index and content
