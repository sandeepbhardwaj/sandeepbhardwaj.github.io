---
title: Read-Modify-Write Race Condition in Java
date: 2025-02-06
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- race-condition
- read-modify-write
- atomicity
- threads
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Read-Modify-Write Race Condition in Java
seo_description: Understand read-modify-write races in Java with realistic
  examples, lost updates, and correct synchronization and atomic fixes.
header:
  overlay_image: "/assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 4
  show_overlay_excerpt: false
---
Read-modify-write is another core race pattern.

The bug happens when one thread reads a value, computes a new value from it, and writes the result back while another thread does the same at the same time.

One update can overwrite the other.

---

## Problem Statement

Suppose a metrics service increments a request counter for every incoming call.

At first glance, `count++` looks harmless.
In concurrent code, it is not one indivisible operation.

It is a sequence:

- read current value
- compute new value
- write new value

If two threads interleave those steps, some increments disappear.

---

## Naive Version

```java
class RequestCounter {
    private int count;

    void increment() {
        count++;
    }

    int getCount() {
        return count;
    }
}
```

This is broken under concurrent access.

`count++` is not atomic.

---

## Runnable Example

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ReadModifyWriteRaceDemo {

    public static void main(String[] args) throws Exception {
        RequestCounter counter = new RequestCounter();
        ExecutorService executor = Executors.newFixedThreadPool(8);
        List<Runnable> tasks = new ArrayList<>();

        for (int i = 0; i < 1000; i++) {
            tasks.add(counter::increment);
        }

        for (Runnable task : tasks) {
            executor.submit(task);
        }

        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);

        System.out.println("Expected count = 1000");
        System.out.println("Actual count   = " + counter.getCount());
    }

    static final class RequestCounter {
        private int count;

        void increment() {
            int current = count;
            sleep(1);
            count = current + 1;
        }

        int getCount() {
            return count;
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

The sleep exaggerates the interleaving window.
The real issue is that two threads can both read the same old value and both write a value derived from that same snapshot.

---

## Why This Is Different from Check-Then-Act

Check-then-act usually looks like:

- check condition
- perform action if condition holds

Read-modify-write looks like:

- read current state
- derive next state from the old value
- store the derived value

Both are races, but read-modify-write is especially common in counters, balances, totals, and accumulators.

---

## Production-Style Example

This pattern appears in systems like:

- incrementing API rate-limit counters
- adding order totals to daily revenue
- updating retry counts
- incrementing login failure counters
- maintaining in-memory cache statistics

A typical symptom is drift:

- reported requests are lower than actual requests
- balance adjustments disappear
- retries happen more times than expected because the retry count was lost

These bugs can corrupt operational dashboards and business logic at the same time.

---

## Safe Fix with Synchronization

```java
class SynchronizedCounter {
    private int count;

    synchronized void increment() {
        count++;
    }

    synchronized int getCount() {
        return count;
    }
}
```

This works because the whole read-modify-write sequence becomes protected by one monitor boundary.

---

## Safe Fix with AtomicInteger

```java
import java.util.concurrent.atomic.AtomicInteger;

class AtomicCounter {
    private final AtomicInteger count = new AtomicInteger();

    void increment() {
        count.incrementAndGet();
    }

    int getCount() {
        return count.get();
    }
}
```

This is often the better fit for simple counters because:

- the invariant lives in one numeric field
- the JDK already provides the atomic update
- the intent is obvious

---

## Realistic Backend Example

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

class LoginAttemptTracker {
    private final ConcurrentHashMap<String, AtomicInteger> attempts = new ConcurrentHashMap<>();

    int recordFailure(String username) {
        return attempts.computeIfAbsent(username, ignored -> new AtomicInteger())
                .incrementAndGet();
    }
}
```

This design works better than a plain mutable `Map<String, Integer>` with `get`, `+1`, and `put`, because the increment is explicit and atomic at the per-user counter level.

---

## Common Mistakes

- assuming `++`, `+=`, or `--` are atomic because they are short
- using `volatile int` for counters and expecting correctness
- protecting writers but allowing unsynchronized reads that feed later writes
- composing several atomic operations and assuming the composition is also atomic

`volatile` can make the latest write visible.
It still does not turn read-modify-write into one indivisible update.

---

## Decision Guide

Use `AtomicInteger` or `AtomicLong` when:

- you need a standalone counter or numeric state machine
- the update maps to a built-in atomic operation
- contention is moderate and the code should stay simple

Use `synchronized` or `Lock` when:

- more than one field must move together
- the update logic spans multiple dependent steps
- you need richer coordination than a single numeric update

---

## Key Takeaways

- Read-modify-write races happen because a derived update is based on a stale snapshot.
- `count++` is not atomic in concurrent code.
- `volatile` does not fix lost increments.
- Atomics are excellent for simple state transitions, but multi-field invariants still need stronger coordination.

Next post: [Visibility Bugs Without Synchronization in Java](/java/concurrency/visibility-bugs-without-synchronization-in-java/)
