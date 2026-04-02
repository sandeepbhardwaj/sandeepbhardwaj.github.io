---
title: Advanced caching in Spring with Caffeine + Redis + invalidation
date: 2026-07-08
categories:
- Java
- Spring Boot
- Backend
permalink: /java/spring-boot/backend/spring-caching-caffeine-redis-invalidation-part-1/
tags:
- java
- spring-boot
- backend
- architecture
- production
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Advanced caching in Spring with Caffeine + Redis + invalidation - Advanced
  Guide
seo_description: Advanced practical guide on advanced caching in spring with caffeine
  + redis + invalidation with architecture decisions, trade-offs, and production patterns.
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Advanced Spring Boot Runtime Engineering
---
Caching gets dangerous when it is treated as a pure speed feature.
In production systems, the real question is not "can we cache this?"
The real question is whether the service can still explain freshness, invalidation, and failure behavior once the cache is introduced.

---

## The Right Mental Model

A Caffeine plus Redis design is usually trying to combine:

- **local speed** from in-memory lookups
- **cross-instance sharing** from Redis
- **controlled freshness** through explicit invalidation or expiry

That can work well, but only if the team decides up front:

- what data may be stale
- how stale it may be
- what event removes or refreshes bad entries
- what happens when Redis is slow or unavailable

> [!IMPORTANT]
> A cache design is part of your correctness model, not just your latency model.

---

## Why Two Layers Exist at All

Caffeine is useful because it is process-local and extremely fast.
Redis is useful because multiple instances can share cached values.

That means the common pattern is:

- check local cache first
- fall back to Redis
- fall back to the database or upstream source

The danger is that each extra layer adds one more place where stale data can survive.

---

## A Concrete Shape

Imagine a product-read path where product metadata changes occasionally but read traffic is high.

```java
@Service
class ProductService {

    private final ProductRepository repository;

    @Cacheable(cacheNames = "productById", key = "#productId")
    public ProductView getProduct(String productId) {
        return repository.findViewById(productId);
    }
}
```

That only gives you the cache abstraction.
The real design appears in the cache manager setup.

```java
@Bean
CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
    CaffeineCacheManager caffeine = new CaffeineCacheManager("productById");
    caffeine.setCaffeine(Caffeine.newBuilder()
            .maximumSize(10_000)
            .expireAfterWrite(Duration.ofMinutes(2)));
    return caffeine;
}
```

For a real two-layer strategy, teams usually go beyond a single annotation and make the lookup order explicit in code or in a composed cache abstraction.

---

## A More Honest Two-Layer Pattern

When the behavior matters, a hand-rolled read-through shape is often clearer than hiding everything behind one annotation.

```java
@Service
class ProductCacheService {

    private final Cache<String, ProductView> localCache;
    private final StringRedisTemplate redisTemplate;
    private final ProductRepository repository;

    ProductView getProduct(String productId) {
        ProductView local = localCache.getIfPresent(productId);
        if (local != null) return local;

        String redisValue = redisTemplate.opsForValue().get(redisKey(productId));
        if (redisValue != null) {
            ProductView value = deserialize(redisValue);
            localCache.put(productId, value);
            return value;
        }

        ProductView dbValue = repository.findViewById(productId);
        localCache.put(productId, dbValue);
        redisTemplate.opsForValue().set(redisKey(productId), serialize(dbValue), Duration.ofMinutes(10));
        return dbValue;
    }
}
```

This is more verbose, but it makes the order of truth explicit:

1. local cache
2. distributed cache
3. source of record

That clarity matters when incidents start.

---

## Invalidation Is the Real Design Problem

The hardest part is not cache population.
It is invalidation.

Common strategies:

- short TTL only
- write-through or write-behind
- explicit invalidation on update
- event-driven invalidation across instances

If the business cannot tolerate stale reads after an update, TTL alone is usually too weak.
That usually pushes you toward explicit invalidation or event propagation.

```java
public void updateProduct(ProductUpdate update) {
    repository.update(update);
    localCache.invalidate(update.productId());
    redisTemplate.delete(redisKey(update.productId()));
}
```

That is still only instance-local plus Redis-local invalidation.
If multiple application nodes keep local Caffeine caches, you also need a way to fan out invalidation across instances.

> [!NOTE]
> The most dangerous cache bug is not a miss. It is a confident hit on data that should have been invalidated already.

---

## When Caffeine + Redis Is Worth It

This hybrid model is strongest when:

- reads are much more frequent than writes
- the source of truth is expensive enough that a local cache pays off
- some staleness is acceptable within a defined window
- the team can support invalidation and observability properly

It is weaker when:

- write frequency is high
- freshness requirements are strict
- invalidation events are hard to produce reliably
- the data is small enough that one cache layer would be simpler and safer

---

## Failure Drill

A strong drill is invalidation lag:

1. update a cached record
2. verify one node invalidates correctly
3. verify a second node with a warm local cache also stops serving stale data
4. simulate Redis delay or event propagation delay and measure the stale-read window

This tells you whether the cache design is merely fast in steady state or actually trustworthy under real change.

---

## Debug Steps

- measure hit rate separately for local cache and Redis
- track stale-read incidents, not just latency improvements
- verify invalidation on every write path, not only the main happy path
- inspect what happens when Redis is unavailable or slow
- keep cache keys explicit and reviewable

---

## Production Checklist

- the source of truth is clearly defined
- the stale-data tolerance is explicitly documented
- local and distributed cache hit rates are both visible
- invalidation paths are tested across multiple instances
- fallback behavior under Redis failure is acceptable

---

## Key Takeaways

- Caffeine plus Redis is useful when you need both local speed and shared cache state, but it raises the invalidation bar immediately.
- A cache hierarchy should make freshness rules easier to explain, not harder.
- The design is only as good as its invalidation strategy.
- In production, stale correctness matters more than impressive hit rates.
