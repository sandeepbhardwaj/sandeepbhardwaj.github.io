---
title: Custom ThreadFactory in Java
date: 2025-05-09
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- threadfactory
- executors
- threads
- observability
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Custom ThreadFactory in Java
seo_description: Learn why custom ThreadFactory implementations matter in Java
  executors for naming, diagnostics, and thread configuration.
header:
  overlay_image: "/assets/images/java-concurrency-module-10-executors-futures-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 10
  show_overlay_excerpt: false
---
Most thread pools are easier to operate once their threads stop looking anonymous.

That is the first practical reason to care about `ThreadFactory`.

The second is that thread creation is where you centralize thread policy:

- naming
- daemon status
- uncaught exception handling
- priority if you truly need it

Without a custom `ThreadFactory`, executors often work fine in development and become harder to reason about in production.

---

## Problem Statement

An executor gives you control over task execution, but it still has to create threads somehow.

If you accept the default factory blindly, you often lose easy control over:

- readable thread names
- consistent daemon settings
- predictable error logging

Those omissions hurt later when you are reading:

- thread dumps
- logs
- monitoring dashboards

`ThreadFactory` exists to make thread creation deliberate instead of accidental.

---

## Mental Model

`ThreadFactory` is simple:

- the executor asks for a new thread
- the factory creates and returns it

That is the seam where you attach execution identity.

A custom thread factory is not about changing task logic.
It is about standardizing the threads that run that logic.

---

## Runnable Example

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;

public class CustomThreadFactoryDemo {

    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(2, new NamedThreadFactory("orders"));

        executor.execute(() -> System.out.println("Running on " + Thread.currentThread().getName()));
        executor.execute(() -> System.out.println("Running on " + Thread.currentThread().getName()));

        executor.shutdown();
    }

    static final class NamedThreadFactory implements ThreadFactory {
        private final String prefix;
        private final AtomicInteger sequence = new AtomicInteger(1);

        NamedThreadFactory(String prefix) {
            this.prefix = prefix;
        }

        @Override
        public Thread newThread(Runnable runnable) {
            Thread thread = new Thread(runnable);
            thread.setName(prefix + "-" + sequence.getAndIncrement());
            thread.setDaemon(false);
            thread.setUncaughtExceptionHandler((t, e) ->
                    System.err.println("Uncaught exception on " + t.getName() + ": " + e.getMessage()));
            return thread;
        }
    }
}
```

This example is intentionally modest.
The important point is the policy centralization.

---

## Why Naming Matters So Much

Named threads improve:

- log readability
- thread dump analysis
- JFR and profiling interpretation
- on-call debugging speed

Compare:

- `pool-7-thread-3`
- `inventory-refresh-3`

One of those names tells you something useful instantly.

In large services, that difference pays off repeatedly.

---

## Other Useful Factory Choices

### Daemon versus non-daemon

Background-only helper executors sometimes use daemon threads.
Core business executors usually should not stop silently just because the main thread exits.

### Uncaught exception handler

Most task failures are captured by executor APIs, but explicit uncaught handlers still help with direct thread visibility and defensive logging.

### Priority

Usually leave this alone.
Thread priorities rarely fix real throughput problems and can create platform-specific surprises.

### Thread group

Rarely important in ordinary application code, but some environments still care about it.

---

## Common Mistakes

### Forgetting names entirely

This makes incidents slower to debug than they need to be.

### Marking business-critical worker threads as daemon threads

This can lead to surprising shutdown behavior.

### Putting heavy logic inside `newThread`

Thread creation should stay lightweight.

### Assuming `UncaughtExceptionHandler` replaces task-level error handling

For `ExecutorService`, failures in submitted tasks are usually surfaced through `Future` or other task coordination APIs.

---

## Production Guidance

A useful thread naming strategy often includes:

- subsystem name
- executor role
- sequence number

For example:

- `orders-io-1`
- `billing-timeout-2`
- `cache-refresh-3`

That naming scheme becomes even more valuable when the application has several executors for different latency classes.

A custom factory is also a good place to standardize:

- `Thread.NORM_PRIORITY`
- non-daemon by default
- a shared uncaught exception logger

Keep the policy boring and consistent.

---

## Testing and Diagnostics

Easy checks:

- verify names appear correctly in logs
- verify daemon status matches expectations
- verify failures are still visible when tasks crash

You do not need elaborate tests here.
You need confidence that thread identity and configuration are what operations teams expect.

---

## Key Takeaways

- `ThreadFactory` is the clean place to centralize thread naming and thread-level policy.
- Custom names materially improve logs, thread dumps, and incident diagnosis.
- Daemon settings and uncaught exception handlers should be deliberate, not accidental.
- Keep custom factories simple; their value is consistency, not cleverness.

Next post: [Metrics and Instrumentation for Executors in Production](/java/concurrency/metrics-and-instrumentation-for-executors-in-production/)
