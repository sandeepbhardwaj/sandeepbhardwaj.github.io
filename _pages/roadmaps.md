---
title: "Roadmaps"
layout: single
permalink: /roadmaps/
author_profile: false
comments: false
share: false
related: false
toc: false
classes:
  - page-roadmaps
excerpt: "Structured ScaleMind reading paths that organize the archive into clear sequences across Java, concurrency, system design, and backend engineering."
---
{% assign roadmap_posts = site.tags.roadmap | sort: "date" | reverse %}
<div class="roadmaps-hub">
  <section class="roadmaps-intro full-width">
    <div class="roadmaps-intro__surface">
      <div class="roadmaps-intro__copy">
        <p class="roadmaps-kicker">Roadmaps</p>
        <h2 class="roadmaps-intro__title">Follow a structured path through the archive.</h2>
        <p class="roadmaps-intro__text">ScaleMind roadmaps organize related writing into a clear sequence. Start here when continuity matters more than browsing one article at a time.</p>
      </div>

      <div class="roadmaps-intro__meta">
        <a class="roadmaps-pill" href="#available-roadmaps">Available roadmaps</a>
        <a class="roadmaps-pill" href="#reading-flow">Reading flow</a>
        <a class="roadmaps-pill" href="{{ '/categories/' | relative_url }}">Browse topics</a>
      </div>
    </div>
  </section>

  <section id="available-roadmaps" class="roadmaps-block full-width">
    <div class="roadmaps-section-head">
      <p class="roadmaps-kicker">Available</p>
      <h2 class="roadmaps-section-title">Roadmaps you can follow now</h2>
      <p class="roadmaps-section-copy">These paths already collect related posts into a deliberate sequence, so you can read with continuity instead of jumping across the archive.</p>
    </div>

    <div class="roadmaps-grid">
      {% for post in roadmap_posts %}
        <a class="roadmap-hub-card roadmap-hub-card--live" href="{{ post.url | relative_url }}">
          <span class="roadmap-hub-card__status">Roadmap</span>
          <h3 class="roadmap-hub-card__title">{{ post.title }}</h3>
          {% if post.roadmap_summary %}
            <p class="roadmap-hub-card__copy">{{ post.roadmap_summary }}</p>
          {% elsif post.excerpt %}
            <p class="roadmap-hub-card__copy">{{ post.excerpt | strip_html | truncate: 180 }}</p>
          {% endif %}
          {% if post.roadmap_highlights %}
            <ul class="roadmap-hub-card__list">
              {% for item in post.roadmap_highlights limit: 3 %}
                <li>{{ item }}</li>
              {% endfor %}
            </ul>
          {% endif %}
          <span class="roadmap-hub-card__meta">{{ post.roadmap_meta | default: post.categories | join: " · " }}</span>
        </a>
      {% endfor %}
    </div>
  </section>

  <section id="reading-flow" class="roadmaps-block roadmaps-block--workflow full-width">
    <div class="roadmaps-section-head">
      <p class="roadmaps-kicker">Reading flow</p>
      <h2 class="roadmaps-section-title">A simple way to move through the site</h2>
    </div>

    <div class="roadmaps-steps">
      <div class="roadmaps-step">
        <h3 class="roadmaps-step__title">Start with a roadmap when sequence matters</h3>
        <p class="roadmaps-step__copy">Use a roadmap when you want a deliberate path from fundamentals to deeper implementation and architecture trade-offs.</p>
      </div>

      <div class="roadmaps-step">
        <h3 class="roadmaps-step__title">Move into topics when you want range</h3>
        <p class="roadmaps-step__copy">Jump into <a href="{{ '/categories/' | relative_url }}">Topics</a> if you already know the area you want to study and need a faster entry point.</p>
      </div>

      <div class="roadmaps-step">
        <h3 class="roadmaps-step__title">Return to the latest writing for new material</h3>
        <p class="roadmaps-step__copy">Use the homepage and recent posts to follow what is new, then step back into roadmaps or topics when you want more structure.</p>
      </div>
    </div>
  </section>
</div>
