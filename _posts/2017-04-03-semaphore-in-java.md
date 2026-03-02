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

## Key Takeaways

- Semaphore is a concurrency limiter, not a queue.
- Always release permits in `finally`.
- Combine semaphores with retry and timeout logic in production systems.
