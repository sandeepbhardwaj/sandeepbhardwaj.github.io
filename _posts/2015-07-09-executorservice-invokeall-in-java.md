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
`ExecutorService.invokeAll` is useful when you have a fixed set of tasks, want to submit them together, and need to wait until the whole batch completes.

It is not the most flexible concurrency API in Java, but it is still a practical tool for bounded fan-out work where deterministic ordering of results matters more than fancy composition.

---

## What `invokeAll` Actually Guarantees

The method gives you a few important behaviors:

- all tasks are submitted as one batch
- the caller blocks until all complete, or until the timeout variant expires
- the returned `Future` list preserves submission order
- task failures appear through `Future#get`, not directly from `invokeAll`

That makes it a good fit for request aggregation and batch coordination where the caller already expects to wait for the group.

---

## A Simple Example

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

The important thing here is not concurrency for its own sake. It is that the three pieces of work belong to one bounded batch and the caller wants all the outcomes before moving on.

---

## The Timeout Variant Is Often the Safer Default

Without a timeout, one slow dependency can keep the entire batch waiting.

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

This is especially important in request-serving code, where "wait forever because one subtask is stuck" is almost never the right policy.

---

## A Good Use Case: Response Aggregation

Suppose one endpoint needs:

- profile data
- order history
- recommendations

That is a reasonable place for `invokeAll`, because:

- the work is independent
- the task set is known up front
- the caller naturally waits for the batch

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

This makes sense when partial fallback is an explicit product decision.

---

## Where `invokeAll` Starts to Feel Heavy

It becomes a weaker fit when you need:

- incremental completion handling
- dependency-aware composition
- structured cancellation across nested subtasks
- sophisticated error orchestration

In those cases, `CompletableFuture` or modern structured concurrency can express the workflow more clearly.

So the question is not "is `invokeAll` old?" The better question is whether your workflow is truly a wait-for-the-whole-batch pattern.

---

## Operational Pitfalls

Common mistakes include:

- using a pool smaller than the batch size and then being surprised by queueing
- forgetting that `Future#get` still surfaces task exceptions individually
- treating timeout, cancellation, and business failure as the same outcome
- sharing one global executor across unrelated workloads

`invokeAll` is simple, but it still inherits all the executor design problems around queueing, sizing, and overload behavior.

> [!TIP]
> `invokeAll` works best when the task batch is small, bounded, and clearly owned by one caller. If the workflow needs richer lifecycle control, reach for a higher-level abstraction.

---

## Key Takeaways

- `invokeAll` is a good all-tasks-or-timeout batch primitive.
- The returned futures preserve submission order, which is useful for deterministic result mapping.
- Timeouts and explicit partial-failure handling matter in real systems.
- It is best for bounded fan-out, not for complex async orchestration.
