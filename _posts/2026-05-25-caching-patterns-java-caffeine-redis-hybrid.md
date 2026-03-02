---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-25
seo_title: "Caching Patterns in Java with Caffeine and Redis"
seo_description: "Design hybrid local plus distributed cache layers in Java backend services."
tags: [java, caching, caffeine, redis, backend]
canonical_url: "https://sandeepbhardwaj.github.io/java/caching-patterns-java-caffeine-redis-hybrid/"
title: "Caching Patterns in Java (Caffeine Redis Hybrid)"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Multi-Layer Cache Design for Latency and Resilience"
---

# Caching Patterns in Java (Caffeine Redis Hybrid)

Hybrid caching combines low-latency local reads with shared distributed consistency.
Done right, it reduces tail latency and protects primary databases under burst traffic.

---

## Layered Cache Model

- L1: in-process Caffeine cache (microseconds)
- L2: Redis cache (network roundtrip)
- Source of truth: primary database/service

Read flow:

1. check L1
2. fallback to L2
3. fallback to source
4. repopulate upward

---

## Java Skeleton

```java
LoadingCache<String, User> l1 = Caffeine.newBuilder()
        .maximumSize(100_000)
        .expireAfterWrite(Duration.ofMinutes(5))
        .build(this::loadFromL2OrSource);

private User loadFromL2OrSource(String key) {
    User cached = redisClient.get(key);
    if (cached != null) return cached;
    User fresh = userRepository.findById(key);
    redisClient.set(key, fresh, Duration.ofMinutes(30));
    return fresh;
}
```

---

## Invalidation Strategy

- use explicit versioned keys for safer rollout.
- invalidate on write using event-driven signals.
- avoid broad key scans in hot paths.
- treat cache miss storms as incident scenarios.

---

## Metrics to Track

- L1 hit ratio
- L2 hit ratio
- source fallback rate
- stale-read incident count
- refill latency and stampede frequency

---

## Key Takeaways

- hybrid caches optimize latency and resilience, not only throughput.
- correctness depends on explicit invalidation and key strategy.
- monitor miss storms and fallback pressure continuously.
