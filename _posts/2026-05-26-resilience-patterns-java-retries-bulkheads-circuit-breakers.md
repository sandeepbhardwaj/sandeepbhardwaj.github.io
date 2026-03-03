---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-26
seo_title: "Resilience Patterns in Java Microservices"
seo_description: "Apply retry, bulkhead, and circuit breaker controls in Java services under failure."
tags: [java, resilience, retries, circuit-breaker, backend]
canonical_url: "https://sandeepbhardwaj.github.io/java/resilience-patterns-java-retries-bulkheads-circuit-breakers/"
title: "Resilience Patterns in Java (Retries Bulkheads Circuit Breakers)"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Dependency Failure Containment and Recovery Controls"
---

# Resilience Patterns in Java (Retries Bulkheads Circuit Breakers)

Resilience patterns protect your service during dependency failures.
They work only when composed as one policy, not added independently.

---

## Recommended Composition Order

1. timeout (bound waiting)
2. bulkhead (bound concurrency)
3. circuit breaker (fast-fail unhealthy dependency)
4. retry with jitter (limited recovery attempts)

Wrong order can create retry storms and queue collapse.

---

## Policy by Failure Type

Not every error should be retried.

- `429`, `503`, transient network timeout: retry with backoff
- `400`, validation, business rule failures: do not retry
- non-idempotent write without idempotency key: do not retry

A generic retry-all policy is a production anti-pattern.

---

## Example (Resilience4j Style Composition)

```java
Supplier<Response> call = () -> client.fetch(orderId);

Supplier<Response> guarded = Decorators.ofSupplier(call)
    .withBulkhead(bulkhead)
    .withTimeLimiter(timeLimiter)
    .withCircuitBreaker(circuitBreaker)
    .withRetry(retry)
    .decorate();

Response response = guarded.get();
```

Tune each dependency separately. One global configuration is rarely correct.

---

## Dependency Budgeting

Every dependency should have:

- timeout budget (e.g. 150ms)
- max concurrent calls (bulkhead)
- max retry attempts (usually 1-2 additional tries)
- fallback behavior (optional, explicit)

This creates predictable degradation under stress.

---

## Dry Run: Partial Outage Scenario

Dependency `inventory-service` starts returning 60% timeouts.

1. timeout trips quickly (150ms), preventing long request blocking.
2. bulkhead limits concurrent inventory calls.
3. circuit breaker opens after failure threshold, fast-failing new calls.
4. retries are limited and jittered, avoiding synchronized retry spikes.
5. service returns degraded response for inventory data.

Without these controls, request queues expand and unrelated endpoints degrade.

---

## Metrics to Operate By

- timeout rate per dependency
- bulkhead saturation/rejection count
- circuit breaker state transitions
- retry attempts per request
- fallback activation rate

These metrics should feed alerts and capacity reviews.

---

## Common Mistakes

- retrying inside retries (nested retry policies)
- using long timeout plus many retries
- sharing one bulkhead across unrelated dependencies
- enabling fallback that hides real incident severity

---

## Key Takeaways

- resilience is controlled load-shedding and recovery, not just retry logic.
- enforce strict time, concurrency, and retry budgets per dependency.
- validate policies in failure drills before production incidents.
