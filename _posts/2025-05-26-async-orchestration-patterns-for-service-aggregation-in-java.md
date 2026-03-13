---
title: Async Orchestration Patterns for Service Aggregation in Java
date: 2025-05-26
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- completablefuture
- async
- service-aggregation
- backend
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Async Orchestration Patterns for Service Aggregation in Java
seo_description: Learn practical async orchestration patterns for Java service
  aggregation using CompletableFuture and deliberate timeout design.
header:
  overlay_image: "/assets/images/java-concurrency-module-11-forkjoin-async-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 11
  show_overlay_excerpt: false
---
Service aggregation is where async composition stops being an academic API topic and becomes real backend architecture.

A single endpoint may need data from:

- profile service
- pricing service
- inventory service
- recommendations service

The orchestration problem is not just "run these concurrently."
It is:

- run them concurrently with deadlines, fallbacks, and clear dependency structure

That is exactly where `CompletableFuture` can help.

---

## Common Aggregation Shapes

### Parallel fan-out and fan-in

Start several independent calls together, then combine the results.

### Optional dependency fallback

Some data is helpful but not required, so timeouts or failures should degrade gracefully.

### Dependent follow-up

One call's result determines the next request, which makes composition order important.

### First-response-wins

Useful for redundant replicas or speculative fallback patterns.

These are not all the same workflow.
That is why operator choice matters.

---

## Runnable Example

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ServiceAggregationDemo {

    public static void main(String[] args) {
        ExecutorService ioExecutor = Executors.newFixedThreadPool(16);

        CompletableFuture<String> profileFuture =
                CompletableFuture.supplyAsync(() -> loadProfile("u-42"), ioExecutor);

        CompletableFuture<String> inventoryFuture =
                CompletableFuture.supplyAsync(() -> loadInventory("sku-99"), ioExecutor)
                        .completeOnTimeout("inventory-unavailable", 200, TimeUnit.MILLISECONDS);

        CompletableFuture<String> pricingFuture =
                CompletableFuture.supplyAsync(() -> loadPricing("sku-99"), ioExecutor)
                        .orTimeout(200, TimeUnit.MILLISECONDS);

        CompletableFuture<String> responseFuture =
                profileFuture.thenCombine(inventoryFuture, (profile, inventory) ->
                                profile + " / " + inventory)
                        .thenCombine(pricingFuture, (partial, pricing) ->
                                partial + " / " + pricing);

        try {
            System.out.println(responseFuture.join());
        } finally {
            ioExecutor.shutdown();
        }
    }

    static String loadProfile(String userId) {
        return "profile:" + userId;
    }

    static String loadInventory(String sku) {
        return "inventory:" + sku;
    }

    static String loadPricing(String sku) {
        return "price:" + sku;
    }
}
```

The important design ideas here are:

- independent fan-out
- explicit timeout policy
- fallback on optional data
- clear combination points

---

## Design Questions That Matter

For each dependency, ask:

1. Is it required or optional?
2. What is its deadline?
3. What executor should run it?
4. What happens on timeout or failure?
5. Should its result be combined, transformed, or ignored?

These are orchestration questions first.
The API only expresses the answers.

---

## Common Mistakes

### Starting dependent calls sequentially when they could run in parallel

This wastes latency budget.

### Treating all dependencies as equally critical

That often causes total request failure when graceful degradation would be better.

### Joining intermediate futures too early

That breaks concurrency and turns orchestration back into serial blocking.

### Ignoring total request deadline

Per-stage timeouts are not enough if the overall response time budget is still uncontrolled.

---

## Production Guidance

Healthy aggregation workflows usually include:

- clear dependency classification
- bounded executor usage
- per-dependency deadlines
- fallback where business semantics allow it
- metrics for timeout rate, fallback rate, and dependency latency

The design goal is not maximum parallelism.
It is controlled latency and graceful behavior when dependencies misbehave.

---

## Key Takeaways

- Async aggregation is about dependency structure, deadlines, and fallback policy, not just starting many futures.
- `CompletableFuture` works well for fan-out/fan-in flows when operator choice matches the dependency graph.
- Optional and required dependencies should not share the same failure strategy by default.
- The best async aggregation design optimizes for bounded latency and graceful degradation, not just raw concurrency.

Next post: [How to Test Concurrent Code Without Fooling Yourself](/2025/05/27/how-to-test-concurrent-code-without-fooling-yourself/)
