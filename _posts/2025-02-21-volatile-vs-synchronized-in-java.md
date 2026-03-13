---
title: volatile vs synchronized in Java
date: 2025-02-21
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- volatile
- synchronized
- visibility
- atomicity
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: volatile vs synchronized in Java
seo_description: Compare volatile and synchronized in Java, including
  visibility, atomicity, locking behavior, and when each is the right choice.
header:
  overlay_image: "/assets/images/java-concurrency-module-05-volatile-immutability-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 5
  show_overlay_excerpt: false
---
`volatile` and `synchronized` are often presented as if they were two competing shortcuts for the same job.

They are not.

They solve different classes of concurrency problems.

If you treat them as interchangeable, you usually end up either:

- under-protecting important invariants
- or overcomplicating simple state publication

---

## Problem Statement

Suppose a service has both of these needs:

- a background worker should stop when a flag changes
- inventory reservation should not oversell under concurrent requests

Both problems involve shared state.

But the required guarantees are different:

- the stop flag needs visibility
- the inventory reservation needs atomic check-and-update behavior

That is why `volatile` and `synchronized` both exist.

---

## What `volatile` Gives You

`volatile` gives:

- visibility of the latest write
- ordering guarantees around that field

It does not give:

- mutual exclusion
- compound atomicity
- protection for multi-field invariants

Two threads can still run the same code at the same time around a `volatile` field.

---

## What `synchronized` Gives You

`synchronized` gives:

- mutual exclusion
- visibility on monitor entry and exit
- one protected critical section at a time for the same monitor

This is why `synchronized` can protect compound operations and invariants.

It is a larger guarantee.

---

## Example Where `volatile` Is Enough

```java
class ServiceStopFlag {
    private volatile boolean running = true;

    void stop() {
        running = false;
    }

    void runLoop() {
        while (running) {
            doWork();
        }
    }

    void doWork() {
    }
}
```

This is a visibility problem.
There is no multi-step invariant around `running`.

That makes `volatile` a good fit.

---

## Example Where `synchronized` Is Required

```java
class Inventory {
    private int available = 10;

    synchronized boolean reserveOne() {
        if (available > 0) {
            available--;
            return true;
        }
        return false;
    }
}
```

This is a check-then-act operation.

The check and decrement must stay together as one protected boundary.

`volatile int available` would not solve that.

---

## Runnable Comparison Example

```java
public class VolatileVsSynchronizedDemo {

    public static void main(String[] args) {
        StopController stopController = new StopController();
        Inventory inventory = new Inventory();

        stopController.stop();
        System.out.println("Worker running = " + stopController.isRunning());

        System.out.println("Reserve #1 = " + inventory.reserveOne());
        System.out.println("Reserve #2 = " + inventory.reserveOne());
    }

    static final class StopController {
        private volatile boolean running = true;

        void stop() {
            running = false;
        }

        boolean isRunning() {
            return running;
        }
    }

    static final class Inventory {
        private int available = 1;

        synchronized boolean reserveOne() {
            if (available > 0) {
                available--;
                return true;
            }
            return false;
        }
    }
}
```

This example is intentionally small, but it captures the key design difference:

- one case is simple visibility
- the other case is compound correctness

---

## Why This Distinction Matters

Developers often misuse `volatile` because it feels lighter than `synchronized`.

That is the wrong decision process.

The deciding question is not:

- which keyword looks cheaper

It is:

- what guarantee does the invariant actually require

If the answer is visibility only, `volatile` may be perfect.
If the answer is atomic multi-step correctness, you need stronger coordination.

---

## Production-Style Guidance

Choose `volatile` for:

- stop flags
- immutable config references
- lifecycle status fields
- one-writer, many-reader status publication

Choose `synchronized` for:

- reservation or transfer logic
- mutable aggregates with several related fields
- guarded state transitions
- monitor-based coordination with `wait` and `notify`

This is why treating them as substitutes is so dangerous.

---

## Common Mistakes

- using `volatile` for counters
- using `volatile` for check-then-act code
- using `synchronized` for every shared field even when simple state publication would do
- discussing the choice only in performance terms and ignoring correctness

Performance matters later.
Correctness comes first.

---

## Decision Guide

Use `volatile` when:

- one field stands alone as the truth
- threads only need the latest visible value
- there is no compound invariant

Use `synchronized` when:

- several steps must behave atomically
- multiple fields must stay consistent together
- one thread must exclude others from a critical section

The right tool follows from the shape of the shared state.

---

## Key Takeaways

- `volatile` is for visibility and ordering of simple published state.
- `synchronized` is for mutual exclusion and compound correctness.
- `synchronized` also provides visibility, which is why it can protect richer invariants.
- Pick based on the actual guarantee required, not on shorthand rules about “lighter” vs “heavier.”

Next post: [volatile vs Locks vs Atomics in Java](/2025/02/22/volatile-vs-locks-vs-atomics-in-java/)
