---
title: Contention Collapse Under Load in Java Services
date: 2025-02-17
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- contention
- performance
- latency
- throughput
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Contention Collapse Under Load in Java Services
seo_description: Learn how contention collapse happens in Java services when
  shared resources turn load increases into throughput and latency failure.
header:
  overlay_image: "/assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 4
  show_overlay_excerpt: false
---
Sometimes a system performs acceptably at moderate load and then falls apart sharply instead of degrading gradually.

One common reason is contention collapse.

As more requests arrive, more threads fight over the same shared bottleneck, and the extra concurrency makes throughput worse rather than better.

---

## Problem Statement

Suppose every request must enter one synchronized block protecting a shared cache refresh path.

At low traffic, this is fine.
At high traffic:

- many threads queue behind the lock
- context switching increases
- timeouts grow
- retries add more load

Then the system spirals.

---

## Production-Style Example

Imagine an API service with:

- one hot lock around an in-memory token cache
- 200 request threads
- slow downstream token refresh on cache miss

Under burst traffic, one miss can turn into a lock hotspot.
If waiting requests time out and retry, they amplify the collapse.

This is not just “some contention.”
It is contention becoming the dominant system behavior.

---

## Runnable Illustration

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ContentionCollapseDemo {

    public static void main(String[] args) throws Exception {
        HotPathService service = new HotPathService();
        ExecutorService executor = Executors.newFixedThreadPool(32);

        long start = System.currentTimeMillis();
        for (int i = 0; i < 200; i++) {
            executor.submit(service::handleRequest);
        }

        executor.shutdown();
        executor.awaitTermination(30, TimeUnit.SECONDS);
        long elapsed = System.currentTimeMillis() - start;

        System.out.println("Handled = " + service.handled());
        System.out.println("Elapsed millis = " + elapsed);
    }

    static final class HotPathService {
        private final Object lock = new Object();
        private int handled;

        void handleRequest() {
            synchronized (lock) {
                sleep(50);
                handled++;
            }
        }

        int handled() {
            return handled;
        }
    }

    static void sleep(long millis) {
        try {
            TimeUnit.MILLISECONDS.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }
}
```

This code serializes a supposedly concurrent workload on one hot lock.

Adding more request threads does not increase real parallelism here.
It mainly increases waiting and scheduling overhead.

---

## Why Collapse Happens

The feedback loop often looks like this:

- contention increases
- latency rises
- requests wait longer
- timeouts and retries increase pressure
- thread pools saturate
- downstream systems get hit harder

Once the system enters that loop, the bottleneck can dominate everything else.

---

## Better Design

Defenses include:

- reduce shared hot critical sections
- shard state instead of protecting one global structure
- use single-flight techniques for duplicate refresh work
- bound concurrency before the bottleneck
- separate blocking and CPU-bound executors
- monitor queue depth and lock hold time

The best fix is usually not “add more threads.”

---

## Key Takeaways

- Contention collapse happens when more concurrency creates less useful throughput.
- Hot locks, retries, and shared bottlenecks often combine into the failure.
- Adding threads to a serialized hot path usually makes the situation worse.
- Reduce hot shared state, shard ownership, and control concurrency at the real bottleneck.

Next post: [What volatile Does and Does Not Do in Java](/2025/02/18/what-volatile-does-and-does-not-do-in-java/)
