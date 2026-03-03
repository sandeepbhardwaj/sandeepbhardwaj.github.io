---
title: Semaphore in Java
date: '2017-04-03'
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- semaphore
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Semaphore in Java with Example
seo_description: Limit concurrent access using Java Semaphore with a practical code
  example.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Semaphore in Java

A `Semaphore` controls how many threads can access a shared resource at the same time.

## Real-World Use Cases

- limiting concurrent outbound API calls
- database connection throttling
- download/upload slot management
- rate-limited integrations

## Core Concept

A semaphore has permits:

- `acquire()` takes a permit (waits if none available)
- `release()` returns a permit

You can also choose fairness:

```java
Semaphore fair = new Semaphore(10, true);
```

Fair semaphores reduce starvation risk, but may have lower throughput.

## Java 8 Style Example

```java
import java.util.concurrent.Semaphore;

public class SemaphoreExample {
    private static final Semaphore semaphore = new Semaphore(2);

    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            final int id = i;
            new Thread(() -> runTask(id), "worker-" + id).start();
        }
    }

    private static void runTask(int id) {
        try {
            semaphore.acquire();
            System.out.println("Task " + id + " acquired permit");
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            semaphore.release();
            System.out.println("Task " + id + " released permit");
        }
    }
}
```

## Timeout Pattern (`tryAcquire`)

In request paths, blocking forever is dangerous. Prefer timeout-based acquisition.

```java
if (!semaphore.tryAcquire(100, TimeUnit.MILLISECONDS)) {
    throw new RuntimeException("dependency busy, please retry");
}
try {
    callDownstream();
} finally {
    semaphore.release();
}
```

This gives predictable backpressure behavior under saturation.

## Bulkhead Pattern with Semaphore

A common production pattern is one semaphore per downstream dependency:

- `paymentApiSemaphore` for payment provider
- `searchApiSemaphore` for search dependency
- `emailApiSemaphore` for notifications

This prevents one slow dependency from consuming all worker capacity.

## Permit Leak Prevention

Permit leaks are serious: eventually all requests block.

Checklist:

1. release only if acquisition succeeded
2. use `finally` always
3. avoid branching paths that skip release
4. track available permits and waiting threads in metrics

## JDK 11 and Java 17 Notes

`Semaphore` API is stable in JDK 11 and Java 17. The same concurrency-limit pattern is still the recommended approach.

## Java 21+ Example (Virtual Threads)

```java
try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
    Semaphore semaphore = new Semaphore(50);

    for (int i = 0; i < 10_000; i++) {
        int id = i;
        executor.submit(() -> {
            semaphore.acquire();
            try {
                // remote call / IO task
            } finally {
                semaphore.release();
            }
            return id;
        });
    }
}
```

This is useful when you run many lightweight tasks but still need strict external resource limits.

## Java 25 Note

`Semaphore` API remains stable. The same design works; focus on observability and backpressure instead of API migration.

## Monitoring Checklist

- `availablePermits()` trend
- acquire timeout count
- average wait time before acquire
- request failure rate during saturation

These signals tell you whether permit counts match real dependency capacity.

## Key Takeaways

- Semaphore is a concurrency limiter, not a queue.
- Always release permits in `finally`.
- Combine semaphores with retry and timeout logic in production systems.
- Prefer timeout-based acquisition on latency-sensitive paths.
