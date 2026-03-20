---
title: ExecutorService invokeAll Example in Java
date: '2015-07-09'
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- executorservice
- callable
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: ExecutorService invokeAll Example in Java
seo_description: Understand how invokeAll runs multiple callables and returns ordered
  Future results.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
`invokeAll` submits a collection of `Callable` tasks and waits until all complete.

## Real-World Use Cases

- fan-out calls to multiple downstream services
- parallel enrichment of API responses
- independent report section generation

## Java 8 Example

```java
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.*;

public class InvokeAllExample {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(3);

        List<Callable<String>> tasks = Arrays.asList(
                () -> "profile-ok",
                () -> "orders-ok",
                () -> "recommendations-ok"
        );

        List<Future<String>> futures = pool.invokeAll(tasks);
        for (Future<String> future : futures) {
            System.out.println(future.get());
        }

        pool.shutdown();
    }
}
```

## What `invokeAll` Guarantees

`invokeAll` has a few behaviors that are important in production:

- returns `List<Future<T>>` in the same order as submitted tasks
- blocks until all tasks complete (or timeout variant expires)
- does not throw task exceptions directly; exceptions surface via `Future#get`

This makes it predictable for deterministic result mapping.

## Timeout Variant and Cancellation Behavior

Use timeout overload to avoid hanging forever when one dependency is slow.

```java
List<Future<String>> futures = pool.invokeAll(tasks, 300, TimeUnit.MILLISECONDS);
for (Future<String> f : futures) {
    if (f.isCancelled()) {
        System.out.println("task timed out and was cancelled");
        continue;
    }
    try {
        System.out.println(f.get());
    } catch (ExecutionException ex) {
        System.out.println("task failed: " + ex.getCause().getMessage());
    }
}
```

When timeout is reached, unfinished tasks are cancelled (`Future#isCancelled` becomes true).

## Example: Response Aggregation with Partial Fallback

In aggregator APIs, some sub-results can be optional. `invokeAll` still works if you map failures deliberately.

```java
record Dashboard(String profile, String orders, String recommendations) {}

Dashboard load(ExecutorService pool, String userId) throws InterruptedException {
    List<Callable<String>> tasks = List.of(
            () -> fetchProfile(userId),
            () -> fetchOrders(userId),
            () -> fetchRecommendations(userId)
    );

    List<Future<String>> futures = pool.invokeAll(tasks, 500, TimeUnit.MILLISECONDS);
    return new Dashboard(
            safeGet(futures.get(0), "profile-unavailable"),
            safeGet(futures.get(1), "orders-unavailable"),
            safeGet(futures.get(2), "recommendations-unavailable")
    );
}

String safeGet(Future<String> future, String fallback) {
    if (future.isCancelled()) return fallback;
    try {
        return future.get();
    } catch (Exception ex) {
        return fallback;
    }
}
```

This preserves endpoint responsiveness while containing downstream instability.

## Operational Pitfalls

1. Using a pool smaller than fan-out size, causing queue delays.
2. Calling `future.get()` without timeout strategy in surrounding flow.
3. Not distinguishing timeout, cancellation, and business failure.
4. Sharing one global pool across unrelated workloads.

## Monitoring Checklist

- fan-out task latency histogram
- cancellation/timeout rate
- per-task failure rate
- queue size and active thread count in the executor

## JDK 11 and Java 17 Notes

For `invokeAll`, there is no major behavioral API shift in JDK 11 or Java 17. Main improvements in those versions are around the broader platform and JVM internals.

## Java 21+ Alternative

For request-scoped orchestration and cancellation, prefer structured concurrency style (`StructuredTaskScope`) where available.

## Java 25 Note

`invokeAll` remains valid and stable. Use timeout variants for resilience in production.

## Key Takeaways

- `invokeAll` is a simple all-or-nothing wait pattern.
- Combine with timeout to avoid indefinite waiting.
- Handle partial failures explicitly when aggregating results.
- Keep result mapping deterministic by relying on task submission order.

---

            ## Problem 1: Use ExecutorService invokeAll Example in Java Without Hiding Concurrency Risk

            Problem description:
            Concurrency primitives become dangerous when ownership, visibility, and cancellation rules live only in the author's head. That is why bugs in this area often feel random even though the underlying rule was always missing.

            What we are solving actually:
            We are making the shared-state rule explicit so a reviewer can answer who owns the state, how threads coordinate, and what signal proves contention or visibility is under control.

            What we are doing actually:

            1. define the shared state or work queue involved
            2. name the exact synchronization or visibility rule protecting it
            3. observe contention, blocking, or lifecycle behavior under stress
            4. simplify the design if a snapshot or immutable handoff removes the race entirely

            ```mermaid
flowchart LR
    A[Shared state] --> B[Concurrency boundary]
    B --> C[Visibility or lock rule]
    C --> D[Observed contention / correctness]
```

            ## Debug Steps

            Debug steps:

            - take thread dumps while the system is slow, not after it recovers
            - verify every wait, lock, or signal path has a clear owner
            - test cancellation and shutdown behavior, not only happy-path throughput
            - reduce shared mutable state first before adding more synchronization
