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
excerpt: "Structured learning paths that turn the archive into guided progression across Java, concurrency, DSA, and system design."
---
<div class="roadmaps-hub">
  <section class="roadmaps-intro full-width">
    <div class="roadmaps-intro__surface">
      <div class="roadmaps-intro__copy">
        <p class="roadmaps-kicker">Learning hub</p>
        <h2 class="roadmaps-intro__title">Use roadmaps when you want direction, not just more links.</h2>
        <p class="roadmaps-intro__text">Roadmaps turn the archive into a deliberate path. Start with a guided sequence when you want progression, then jump into the topic archive when you need depth on a specific subject.</p>
      </div>

      <div class="roadmaps-intro__meta">
        <a class="roadmaps-pill" href="#live-roadmaps">Live roadmaps</a>
        <a class="roadmaps-pill" href="#planned-tracks">Planned tracks</a>
        <a class="roadmaps-pill" href="#how-to-use-these">How to use these</a>
        <a class="roadmaps-pill" href="{{ '/categories/' | relative_url }}">Browse topics</a>
      </div>
    </div>
  </section>

  <section id="live-roadmaps" class="roadmaps-block full-width">
    <div class="roadmaps-section-head">
      <p class="roadmaps-kicker">Live now</p>
      <h2 class="roadmaps-section-title">Start with the roadmaps already available</h2>
      <p class="roadmaps-section-copy">These are the structured paths you can follow today if you want deliberate progression instead of browsing one post at a time.</p>
    </div>

    <div class="roadmaps-grid">
      <a class="roadmap-hub-card roadmap-hub-card--live" href="{% post_url 2024-12-31-java-multithreading-concurrency-series-roadmap %}">
        <span class="roadmap-hub-card__status">Live roadmap</span>
        <h3 class="roadmap-hub-card__title">Java Concurrency Roadmap</h3>
        <p class="roadmap-hub-card__copy">Move from thread fundamentals and memory visibility to locks, atomics, executors, futures, debugging, and modern Java concurrency patterns.</p>
        <ul class="roadmap-hub-card__list">
          <li>foundations and mental models</li>
          <li>coordination, safety, and throughput</li>
          <li>diagnostics and modern Java concurrency</li>
        </ul>
        <span class="roadmap-hub-card__meta">Java · Concurrency</span>
      </a>

      <a class="roadmap-hub-card roadmap-hub-card--live" href="{% post_url 2025-12-01-java-design-patterns-series-roadmap %}">
        <span class="roadmap-hub-card__status">Live roadmap</span>
        <h3 class="roadmap-hub-card__title">Java Design Patterns Roadmap</h3>
        <p class="roadmap-hub-card__copy">A guided path through practical Java design patterns with backend examples, trade-offs, and system-oriented design decisions.</p>
        <ul class="roadmap-hub-card__list">
          <li>core composition and object design</li>
          <li>behavioral and structural patterns</li>
          <li>backend use cases and trade-offs</li>
        </ul>
        <span class="roadmap-hub-card__meta">Java · Design</span>
      </a>
    </div>
  </section>

  <section id="planned-tracks" class="roadmaps-block roadmaps-block--planned full-width">
    <div class="roadmaps-section-head">
      <p class="roadmaps-kicker">Planned next</p>
      <h2 class="roadmaps-section-title">Tracks that will expand the learning hub</h2>
      <p class="roadmaps-section-copy">These are the next roadmap directions the site is being shaped around, so the homepage, navigation, and topic structure already have room for them.</p>
    </div>

    <div class="roadmaps-grid">
      <article id="dsa-roadmap" class="roadmap-hub-card roadmap-hub-card--planned">
        <span class="roadmap-hub-card__status">Planned track</span>
        <h3 class="roadmap-hub-card__title">DSA Roadmap</h3>
        <p class="roadmap-hub-card__copy">A guided progression across interview-oriented patterns, templates, and problem-solving signals in Java.</p>
        <ol class="roadmap-hub-card__sequence">
          <li>recursion, backtracking, and search trees</li>
          <li>tree and graph traversal patterns</li>
          <li>dynamic programming and advanced structures</li>
        </ol>
        <span class="roadmap-hub-card__meta">DSA · Interview Prep</span>
      </article>

      <article id="distributed-systems-roadmap" class="roadmap-hub-card roadmap-hub-card--planned">
        <span class="roadmap-hub-card__status">Planned track</span>
        <h3 class="roadmap-hub-card__title">Distributed Systems Roadmap</h3>
        <p class="roadmap-hub-card__copy">A future path through coordination, consistency, replication, reliability, and operational decision-making at scale.</p>
        <ol class="roadmap-hub-card__sequence">
          <li>ownership, coordination, and messaging</li>
          <li>consistency, failure recovery, and scaling</li>
          <li>operability, observability, and trade-offs</li>
        </ol>
        <span class="roadmap-hub-card__meta">Distributed Systems · Architecture</span>
      </article>

      <article class="roadmap-hub-card roadmap-hub-card--planned">
        <span class="roadmap-hub-card__status">Planned track</span>
        <h3 class="roadmap-hub-card__title">Backend Architecture Roadmap</h3>
        <p class="roadmap-hub-card__copy">A bridge between implementation and design for engineers who want service-level thinking, not just isolated code examples.</p>
        <ol class="roadmap-hub-card__sequence">
          <li>service boundaries and API design</li>
          <li>reliability, concurrency, and state management</li>
          <li>operational readiness and scaling decisions</li>
        </ol>
        <span class="roadmap-hub-card__meta">Backend · Architecture</span>
      </article>
    </div>
  </section>

  <section id="how-to-use-these" class="roadmaps-block roadmaps-block--workflow full-width">
    <div class="roadmaps-section-head">
      <p class="roadmaps-kicker">How to use these</p>
      <h2 class="roadmaps-section-title">A simple way to move through the site</h2>
    </div>

    <div class="roadmaps-steps">
      <div class="roadmaps-step">
        <span class="roadmaps-step__index">01</span>
        <h3 class="roadmaps-step__title">Pick a roadmap when you want sequence</h3>
        <p class="roadmaps-step__copy">Use a roadmap when you want a deliberate path from fundamentals to deeper implementation and architecture trade-offs.</p>
      </div>

      <div class="roadmaps-step">
        <span class="roadmaps-step__index">02</span>
        <h3 class="roadmaps-step__title">Use topics when you want depth fast</h3>
        <p class="roadmaps-step__copy">Jump into <a href="{{ '/categories/' | relative_url }}">Topics</a> if you already know the area you want to study and need a faster entry point.</p>
      </div>

      <div class="roadmaps-step">
        <span class="roadmaps-step__index">03</span>
        <h3 class="roadmaps-step__title">Return to the homepage for guided entry</h3>
        <p class="roadmaps-step__copy">The homepage is now designed as the front door: topic tracks for quick entry and roadmaps for structured progression.</p>
      </div>
    </div>
  </section>
</div>
