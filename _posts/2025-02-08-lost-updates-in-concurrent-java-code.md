---
title: Lost Updates in Concurrent Java Code
date: 2025-02-08
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- lost-updates
- race-condition
- atomicity
- threads
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Lost Updates in Concurrent Java Code
seo_description: Learn how lost updates happen in concurrent Java code and how to
  fix them with atomics, synchronization, and better state ownership.
header:
  overlay_image: "/assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 4
  show_overlay_excerpt: false
---
Lost updates are the concrete business symptom of many race conditions.

Two valid operations happen.
Only one of their effects survives.

---

## Problem Statement

Suppose two payment events increment the daily settlement total.

If one update silently overwrites the other, money did not disappear from the database, but the in-memory total became wrong.

That is a lost update.

---

## Naive Version

```java
class RevenueSummary {
    private long totalCents;

    void add(long amountCents) {
        totalCents = totalCents + amountCents;
    }

    long totalCents() {
        return totalCents;
    }
}
```

This looks mathematically correct.
It is not concurrency-safe.

If two threads both read the same old total and both write back a derived value, one addition gets lost.

---

## Runnable Example

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class LostUpdateDemo {

    public static void main(String[] args) throws Exception {
        RevenueSummary summary = new RevenueSummary();
        ExecutorService executor = Executors.newFixedThreadPool(4);

        for (int i = 0; i < 1000; i++) {
            executor.submit(() -> summary.add(100));
        }

        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);

        System.out.println("Expected cents = " + (1000L * 100));
        System.out.println("Actual cents   = " + summary.totalCents());
    }

    static final class RevenueSummary {
        private long totalCents;

        void add(long amountCents) {
            long current = totalCents;
            sleep(1);
            totalCents = current + amountCents;
        }

        long totalCents() {
            return totalCents;
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

The result will often be smaller than expected because updates have been overwritten.

---

## Why Lost Updates Matter

Lost updates are easy to underestimate because the application may keep running.

But the effects are serious:

- counters underreport traffic
- quotas are enforced incorrectly
- balances drift
- stock counts become inaccurate
- retry budgets and circuit-breaker statistics become unreliable

This is one reason concurrency defects are operational defects, not only code-quality defects.

---

## Safe Fix with AtomicLong

```java
import java.util.concurrent.atomic.AtomicLong;

class AtomicRevenueSummary {
    private final AtomicLong totalCents = new AtomicLong();

    void add(long amountCents) {
        totalCents.addAndGet(amountCents);
    }

    long totalCents() {
        return totalCents.get();
    }
}
```

This works well when the state is a single numeric aggregate.

---

## Safe Fix with Synchronization

```java
class SynchronizedRevenueSummary {
    private long totalCents;

    synchronized void add(long amountCents) {
        totalCents += amountCents;
    }

    synchronized long totalCents() {
        return totalCents;
    }
}
```

This is a better fit when the update must preserve several related values together, for example:

- total cents
- transaction count
- last update timestamp

Those fields may need one shared invariant.

---

## Better Design: Avoid One Hot Shared Aggregate

Even when atomics are correct, they are not always the best architecture.

In high-throughput systems, a better pattern can be:

- partition counters by key
- keep ownership local to one worker
- aggregate periodically
- move updates through a queue instead of direct shared mutation

That reduces contention and makes invariants easier to reason about.

---

## Realistic Backend Example

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

class ApiTrafficSummary {
    private final ConcurrentHashMap<String, AtomicLong> requestsByEndpoint =
            new ConcurrentHashMap<>();

    void recordRequest(String endpoint) {
        requestsByEndpoint
                .computeIfAbsent(endpoint, ignored -> new AtomicLong())
                .incrementAndGet();
    }

    long count(String endpoint) {
        AtomicLong counter = requestsByEndpoint.get(endpoint);
        return counter == null ? 0 : counter.get();
    }
}
```

This design avoids a `Map<String, Long>` pattern where `get`, `+1`, and `put` would otherwise create repeated lost-update windows.

---

## Common Mistakes

- treating lost updates as “just eventual consistency”
- relying on `volatile long` for arithmetic updates
- fixing one counter but leaving related derived totals unsynchronized
- assuming a thread-safe collection automatically makes object values inside it thread-safe

A `ConcurrentHashMap` protects map structure.
It does not magically make every value update atomic unless the value design is also safe.

---

## Key Takeaways

- Lost updates happen when concurrent writes overwrite each other instead of accumulating correctly.
- They are a concrete symptom of broken atomicity.
- Atomics are good for single-variable totals and counters.
- For richer invariants, use stronger coordination or redesign ownership.

Next post: [Unsafe Publication in Java and How Objects Leak Broken State](/java/concurrency/unsafe-publication-in-java-and-how-objects-leak-broken-state/)
