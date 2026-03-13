---
title: thenApply thenCompose thenCombine allOf and anyOf in CompletableFuture
date: 2025-05-21
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- completablefuture
- async
- composition
- futures
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: thenApply thenCompose thenCombine allOf and anyOf in CompletableFuture
seo_description: Learn how to compose CompletableFuture stages correctly with
  thenApply, thenCompose, thenCombine, allOf, and anyOf.
header:
  overlay_image: "/assets/images/java-concurrency-module-11-forkjoin-async-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 11
  show_overlay_excerpt: false
---
Most `CompletableFuture` code becomes readable or unreadable based on one thing:

- whether the composition method matches the workflow shape

These methods look similar at first, but they solve different problems:

- transform one result
- flatten a future-producing step
- combine two independent results
- wait for all results
- race for the first result

Choosing the right operator matters a lot.

---

## Mental Model Map

Use `thenApply` for:

- synchronous transformation of one completed result

Use `thenCompose` for:

- chaining to another asynchronous step that itself returns a `CompletableFuture`

Use `thenCombine` for:

- combining two independent futures after both complete

Use `allOf` for:

- waiting for a group of futures

Use `anyOf` for:

- taking the first completed result among several futures

That map is the easiest way to avoid most beginner mistakes.

---

## Runnable Example

```java
import java.util.concurrent.CompletableFuture;

public class CompletableFutureCompositionDemo {

    public static void main(String[] args) {
        CompletableFuture<String> orderId =
                CompletableFuture.supplyAsync(() -> "order-42");

        CompletableFuture<String> enriched =
                orderId.thenApply(id -> "validated-" + id);

        CompletableFuture<String> loaded =
                orderId.thenCompose(id -> CompletableFuture.supplyAsync(() -> "loaded-" + id));

        CompletableFuture<String> pricing =
                CompletableFuture.supplyAsync(() -> "price-ready");

        CompletableFuture<String> combined =
                loaded.thenCombine(pricing, (left, right) -> left + " / " + right);

        CompletableFuture<Void> all =
                CompletableFuture.allOf(enriched, loaded, pricing);

        CompletableFuture<Object> any =
                CompletableFuture.anyOf(enriched, loaded, pricing);

        all.join();
        System.out.println(combined.join());
        System.out.println(any.join());
    }
}
```

This small example captures the main composition shapes you use in real services.

---

## `thenApply` Versus `thenCompose`

This is the distinction developers trip over most often.

`thenApply` means:

- "I have a value, and I want to transform it"

`thenCompose` means:

- "I have a value, and the next step is itself asynchronous"

If the function returns a `CompletableFuture`, `thenCompose` is usually the right tool because it avoids nested futures such as:

- `CompletableFuture<CompletableFuture<T>>`

That flattening behavior is the whole point.

---

## `thenCombine`

Use `thenCombine` when two futures can progress independently and you only need both results at the end.

This is common in service aggregation:

- profile future
- pricing future
- combine into final response

That is different from `thenCompose`, where the second step depends on the first step's value.

---

## `allOf` and `anyOf`

`allOf` is useful when:

- you need a set of futures to complete before proceeding

It returns `CompletableFuture<Void>`, so you usually still read individual futures afterward.

`anyOf` is useful when:

- you want the first completed outcome

That can model:

- fastest replica wins
- fallback races
- speculative execution patterns

Use it carefully, because the type becomes `Object` unless you wrap it more deliberately.

---

## Common Mistakes

### Using `thenApply` for a future-returning function

That creates awkward nested futures.

### Using `allOf` and forgetting to inspect individual failures

It coordinates completion, but you still need a failure policy.

### Replacing a simple sequence with over-composition

Some workflows are clearer as normal synchronous code.

### Mixing dependency and independence

If step B depends on step A, use `thenCompose`, not `thenCombine`.

---

## Decision Guide

Ask:

1. Am I transforming one result?
2. Am I starting another async step from that result?
3. Am I merging two independent results?
4. Do I need all of them?
5. Do I need the first one?

That maps directly to:

1. `thenApply`
2. `thenCompose`
3. `thenCombine`
4. `allOf`
5. `anyOf`

---

## Second Example: Nested Futures versus Flattened Futures

The most common operator confusion is easier to understand when you see the bad and good shapes next to each other.

```java
import java.util.concurrent.CompletableFuture;

public class NestedFutureDemo {

    public static void main(String[] args) {
        CompletableFuture<String> orderId = CompletableFuture.completedFuture("order-42");

        CompletableFuture<CompletableFuture<String>> nested =
                orderId.thenApply(NestedFutureDemo::loadAsync);

        CompletableFuture<String> flat =
                orderId.thenCompose(NestedFutureDemo::loadAsync);

        System.out.println(nested.join().join());
        System.out.println(flat.join());
    }

    static CompletableFuture<String> loadAsync(String id) {
        return CompletableFuture.completedFuture("loaded-" + id);
    }
}
```

That small contrast explains why `thenCompose` exists much better than prose alone.

## Key Takeaways

- `thenApply` transforms a result, `thenCompose` chains to another async stage, and `thenCombine` merges independent futures.
- `allOf` coordinates many completions, while `anyOf` races for the first.
- Choosing the wrong composition method makes async workflows much harder to read and reason about.
- Most `CompletableFuture` design improves once you name the exact dependency shape first.

Next post: [Error Handling with CompletableFuture in Java](/2025/05/22/error-handling-with-completablefuture-in-java/)
