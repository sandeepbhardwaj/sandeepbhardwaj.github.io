---
categories:
- Java
- Backend
date: 2026-05-25
seo_title: Caching Patterns in Java with Caffeine and Redis
seo_description: Design hybrid local plus distributed cache layers in Java backend
  services.
tags:
- java
- caching
- caffeine
- redis
- backend
title: Caching Patterns in Java (Caffeine Redis Hybrid)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Multi-Layer Cache Design for Latency and Resilience
---
A hybrid cache is useful when the system needs both very fast local reads and some shared notion of cached state across instances.

That is why the common shape is:

- `L1`: in-process cache such as Caffeine
- `L2`: shared cache such as Redis
- source of truth: database or upstream service

The trick is that this design improves latency by introducing more places where stale or conflicting data can exist. So a good hybrid cache is not just a speed feature. It is a consistency policy with acceleration layers.

---

## The Real Design Question

Before talking about TTLs or libraries, decide:

- which layer owns truth
- how invalidation propagates
- how much staleness is acceptable
- what happens during miss storms or cache outages

If those answers are vague, the cache will eventually become the incident rather than the optimization.

---

## A Typical Read Path

The common lookup order is:

1. read `L1`
2. on miss, read `L2`
3. on miss, read the source
4. repopulate `L2`, then `L1`

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

Shorter `L1` TTL and longer `L2` TTL is a common balance, but the better question is whether that balance matches the business tolerance for stale reads.

---

## Write Path Discipline Matters More Than Read Speed

The usual safe pattern is cache-aside:

1. write to the source of truth
2. invalidate Redis
3. invalidate local cache

This is boring, but it keeps the write path anchored in the real owner of the data.

Where teams get into trouble is trying to update multiple cache layers optimistically without a coherent invalidation story. That tends to look fast until one partial failure makes the staleness model impossible to explain.

---

## Stampede Protection Is Part of the Design, Not a Tuning Detail

Hot keys and synchronized expirations can turn a healthy cache into a source-load amplifier.

Useful defenses include:

- single-flight loading per key
- TTL jitter
- stale-while-revalidate for tolerant data
- short-lived negative caching for misses

If the workload is read-heavy, this is not optional hardening. It is core architecture.

```mermaid
flowchart LR
    A[Application] --> B[L1 Caffeine]
    B -->|miss| C[L2 Redis]
    C -->|miss| D[Primary store]
    D --> C
    C --> B
```

---

## Key Design Is a Reliability Concern

Cache incidents often start with key design mistakes:

- missing version namespace
- missing tenant scoping
- unclear ownership of key schema
- wildcard scan habits that do not survive scale

Good keys usually make versioning explicit:

- `product:v3:{id}`
- `tenant:{tid}:product:v3:{id}`

This is not cosmetic. It affects invalidation safety, rollout flexibility, and blast radius.

---

## Measure Staleness, Not Just Hit Rate

Teams love dashboards that show cache hit ratio climbing. That number is useful, but incomplete.

You also want:

- stale-read count
- stale-read age distribution
- source fallback rate
- fill latency
- hot-key miss storms

High hit rate with unexplained stale data is not a success story.

> [!TIP]
> A cache that is fast but operationally inexplicable is still a bad cache design.

---

## A Sensible Rollout Pattern

For a product catalog or pricing cache:

1. enable `L1` first and measure local hit behavior
2. add `L2` for cross-instance sharing
3. wire invalidation to writes or change events
4. load test with forced hot-key expiry
5. confirm the source does not saturate during coordinated misses

That sequence proves the hierarchy under stress, not just in the steady state.

---

## When Hybrid Caching Is the Wrong Shape

Sometimes the data is:

- too volatile
- too correctness-sensitive
- too hard to invalidate precisely

In those cases, a simpler cache or no cache may be the better answer.

Hybrid caching is powerful when the staleness budget is understood. Without that, it can create a lot of hidden behavior very quickly.

---

## Key Takeaways

- A hybrid cache is a consistency design with acceleration layers, not just a performance trick.
- The most important decisions are truth ownership, invalidation, and staleness budget.
- Stampede protection and key design are first-class concerns.
- Measure stale behavior alongside hit ratio if you want the cache to stay trustworthy.
