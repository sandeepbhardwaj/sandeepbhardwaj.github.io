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
excerpt: "Browse the ScaleMind archive by topic when you know the area and want depth fast."
---
{% assign total_posts = site.posts | size %}
{% assign total_topics = site.categories | size %}
<section class="topics-intro full-width">
  <div class="topics-intro__surface">
    <div class="topics-intro__copy">
      <p class="topics-kicker">Topics</p>
      <h2 class="topics-intro__title">Browse the archive by subject.</h2>
      <p class="topics-intro__text">Open the part of the ScaleMind archive that matches the language, problem space, or system area you want to explore next.</p>
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
      <a class="topics-pill" href="{{ '/roadmaps/' | relative_url }}">Browse roadmaps</a>
      <a class="topics-pill" href="{{ '/' | relative_url }}#latest-posts">Latest writing</a>
    </div>
  </div>
</section>
