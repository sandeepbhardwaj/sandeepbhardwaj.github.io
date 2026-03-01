---
title: "CompletableFuture — Error Handling & Thread Pool Architecture"
date: 2026-03-06
categories: [Java]
tags: [java, java8, completablefuture, backend, error-handling, thread-pool]
author_profile: true
toc: true
seo_title: "CompletableFuture — Error Handling & Thread Pool Architecture"
seo_description: "Production-ready CompletableFuture patterns for exception handling, fallbacks, timeout control, and thread pool architecture."
header:
  overlay_image: /assets/images/java-8-completablefuture-error-handling-banner.svg
  overlay_filter: 0.4
canonical_url: "https://sandeepbhardwaj.github.io/java/java-8-completablefuture-error-handling/"
---

# Introduction

Async code without clear failure policy becomes fragile quickly.
This post focuses on robust `CompletableFuture` error handling and thread-pool design for production systems.

---

# Exception Handling APIs

## `exceptionally`

Use for fallback value on error.

```java
CompletableFuture<User> userF = CompletableFuture
        .supplyAsync(() -> userClient.fetch(userId), ioExecutor)
        .exceptionally(ex -> User.guest(userId));
```

## `handle`

Use when you need both success and failure branches.

```java
CompletableFuture<Response> responseF = future.handle((value, ex) -> {
    if (ex != null) {
        return Response.partial("dependency-failed");
    }
    return Response.ok(value);
});
```

## `whenComplete`

Use for side effects (logging/metrics), not transformation.

```java
future.whenComplete((v, ex) -> {
    if (ex != null) {
        log.error("async call failed", ex);
    }
});
```

---

# Timeout Patterns in Java 8

Java 8 does not provide `orTimeout`/`completeOnTimeout` APIs.
Use scheduled completion.

```java
public static <T> CompletableFuture<T> withTimeout(
        CompletableFuture<T> original,
        long timeoutMs,
        ScheduledExecutorService scheduler) {

    CompletableFuture<T> timeoutFuture = new CompletableFuture<>();
    scheduler.schedule(
            () -> timeoutFuture.completeExceptionally(new TimeoutException("timeout")),
            timeoutMs,
            TimeUnit.MILLISECONDS
    );

    return original.applyToEither(timeoutFuture, Function.identity());
}
```

---

# Fallback Strategy Example

```java
CompletableFuture<CreditScore> creditF = withTimeout(
        CompletableFuture.supplyAsync(() -> creditClient.fetch(userId), ioExecutor),
        300,
        scheduler
).exceptionally(ex -> CreditScore.unknown());
```

This keeps endpoint latency bounded and avoids total failure from one dependency.

---

# Thread Pool Architecture

Use separate pools by workload type:

- IO executor for network/database calls
- CPU executor for heavy computation
- scheduler for timeouts/retries

```java
ExecutorService ioExecutor = Executors.newFixedThreadPool(48);
ExecutorService cpuExecutor = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
```

Avoid using one giant pool for everything.

---

# Error Taxonomy Guidance

Treat errors differently:

- transient network failures -> retry/fallback
- validation/domain errors -> fail fast
- timeout/circuit open -> degrade gracefully

`CompletionException` wraps inner exception, so unwrap root cause in logging and metrics.

---

# Observability Pattern

```java
long start = System.nanoTime();
future.whenComplete((v, ex) -> {
    long durationMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);
    metrics.timer("profile.fetch.ms").record(durationMs, TimeUnit.MILLISECONDS);
    if (ex != null) {
        metrics.counter("profile.fetch.errors").increment();
    }
});
```

Without timing/error metrics, async failures remain invisible until incidents.

---

# Best Practices Checklist

- define timeout per dependency
- implement fallback or partial response policy
- use explicit executors, not common pool
- separate IO and CPU workloads
- unwrap and classify exceptions
- instrument latency and failure counters

---

# Related Posts

- [CompletableFuture Deep Dive](/java/java-8-completablefuture-deep-dive/)
- [Parallel Streams Performance](/java/java-8-parallel-streams-performance/)
- [Java 8 Date & Time API](/java/java-8-date-time-api/)
