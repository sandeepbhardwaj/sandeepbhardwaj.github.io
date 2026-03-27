---
title: "Topics"
layout: categories
permalink: /categories/
author_profile: false
comments: false
share: false
related: false
toc: false
classes:
  - page-topics
excerpt: "Browse the archive by topic when you know the area and want depth fast."
---
{% assign total_posts = site.posts | size %}
{% assign total_topics = site.categories | size %}
<section class="topics-intro full-width">
  <div class="topics-intro__surface">
    <div class="topics-intro__copy">
      <p class="topics-kicker">Topic directory</p>
      <h2 class="topics-intro__title">Jump straight into the part of the archive you want to master.</h2>
      <p class="topics-intro__text">Use Topics when you already know the domain and want depth fast. Scan the directory, filter it down, and open the lane that matches what you want to study next.</p>
    </div>

    <div class="topics-intro__stats" aria-label="Topics overview">
      <div class="topics-stat">
        <span class="topics-stat__value">{{ total_topics }}</span>
        <span class="topics-stat__label">topic groups</span>
      </div>
      <div class="topics-stat">
        <span class="topics-stat__value">{{ total_posts }}</span>
        <span class="topics-stat__label">published posts</span>
      </div>
    </div>

    <div class="topics-intro__actions">
      <a class="topics-pill" href="#topics-directory">Browse topics</a>
      <a class="topics-pill" href="{{ '/roadmaps/' | relative_url }}">Use roadmaps</a>
      <a class="topics-pill" href="{{ '/' | relative_url }}#recent-writing">Recent writing</a>
    </div>
  </div>
</section>

<section class="topics-block topics-block--guide full-width">
  <div class="topics-section-head">
    <p class="topics-kicker">How to use this page</p>
    <h2 class="topics-section-title">Use topics when the subject is already clear.</h2>
    <p class="topics-section-copy">Think of this page as a technical map. Pick the area you want, filter quickly, then open the group that takes you deeper into that part of the archive.</p>
  </div>

  <div class="topics-guide-grid">
    <div class="topic-guide-card">
      <h3 class="topic-guide-card__title">Start with the atlas</h3>
      <p class="topic-guide-card__copy">Use the topic atlas as a fast-entry layer when you already know the subject area you want to study.</p>
    </div>

    <div class="topic-guide-card">
      <h3 class="topic-guide-card__title">Filter, then compare</h3>
      <p class="topic-guide-card__copy">Use search to narrow the atlas quickly, then open the topic section below and compare the posts inside that cluster.</p>
    </div>

    <div class="topic-guide-card">
      <h3 class="topic-guide-card__title">Switch to roadmaps for sequence</h3>
      <p class="topic-guide-card__copy">Topics help you browse sideways. <a href="{{ '/roadmaps/' | relative_url }}">Roadmaps</a> help you move in order when you want a more deliberate path.</p>
    </div>
  </div>
</section>
