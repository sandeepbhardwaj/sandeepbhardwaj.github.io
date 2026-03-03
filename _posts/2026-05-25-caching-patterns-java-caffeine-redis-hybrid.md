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

A hybrid cache combines fast local reads with shared distributed cache consistency.
The common production setup is:

- L1: Caffeine in-process cache
- L2: Redis shared cache
- source of truth: database/service

---

## Read Path Pattern

1. lookup L1 (Caffeine)
2. on miss, lookup L2 (Redis)
3. on miss, load from source
4. repopulate L2 then L1

```java
LoadingCache<String, Product> l1 = Caffeine.newBuilder()
    .maximumSize(200_000)
    .expireAfterWrite(Duration.ofSeconds(30))
    .build(this::loadThrough);

private Product loadThrough(String key) {
    Product fromRedis = redisClient.get(key);
    if (fromRedis != null) {
        return fromRedis;
    }
    Product fromDb = repository.findById(key);
    if (fromDb != null) {
        redisClient.set(key, fromDb, Duration.ofMinutes(5));
    }
    return fromDb;
}
```

Shorter L1 TTL and longer L2 TTL is a common balance.

---

## Write Path Pattern (Cache-Aside)

On update:

1. write DB (source of truth)
2. invalidate Redis key
3. invalidate local key (or local namespace)

Do not update cache first and DB later unless you implement write-through guarantees.

---

## Stampede Protection

When hot keys expire together, source load can spike.
Mitigations:

- single-flight per key (only one loader computes value)
- TTL jitter to avoid synchronized expiry
- stale-while-revalidate for non-critical data
- negative caching for "not found" with short TTL

Stampede defense is mandatory for read-heavy traffic.

---

## Key Design Rules

- include version namespace in keys (`product:v3:{id}`)
- keep key schema documented and stable
- avoid expensive wildcard scans in request path
- include tenant partition when multi-tenant (`tenant:{tid}:product:v3:{id}`)

Key design mistakes are a major source of stale-data incidents.

---

## Dry Run: Product Catalog Rollout

1. enable L1 only and measure hit ratio.
2. add Redis as L2 with read-through fallback.
3. introduce write invalidation events.
4. run load test with forced hot-key expiry.
5. verify source DB does not saturate during miss storm.

Success criteria:

- p95 latency drops
- DB QPS reduced
- stale-read incidents remain within SLO

---

## Metrics You Must Track

- L1 hit ratio
- L2 hit ratio
- source fallback rate
- cache fill latency
- key-level miss storm alerts
- stale-read count and age distribution

Without these metrics, cache issues stay invisible until incidents.

---

## Key Takeaways

- hybrid caching improves latency and resilience when invalidation is explicit.
- design keys, TTLs, and stampede controls before scaling traffic.
- treat cache correctness as a data consistency problem, not just a speed feature.
