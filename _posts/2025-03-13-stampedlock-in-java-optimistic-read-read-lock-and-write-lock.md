---
title: StampedLock in Java Optimistic Read Read Lock and Write Lock
date: 2025-03-13
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- stampedlock
- optimistic-read
- read-lock
- write-lock
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: StampedLock in Java Optimistic Read Read Lock and Write Lock
seo_description: Learn how StampedLock works in Java with optimistic read, read
  lock, and write lock modes for highly read-heavy data access patterns.
header:
  overlay_image: "/assets/images/java-concurrency-module-06-explicit-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 6
  show_overlay_excerpt: false
---
`StampedLock` was added for advanced cases where read-mostly access patterns may benefit from something lighter than ordinary read-lock coordination.

Its defining feature is optimistic read.

That means a thread can:

- read without taking a conventional read lock first
- then validate whether a conflicting write happened

This can reduce coordination overhead in the right workload, but it also makes the API easier to misuse.

---

## Problem Statement

Imagine a routing structure that is read constantly by request threads and updated only occasionally by a refresh thread.

A normal exclusive lock may serialize too much.

A `ReentrantReadWriteLock` allows readers to overlap, but every reader still has to acquire a read lock.

If reads are extremely frequent and writes are rare, even that read-lock coordination may become noticeable.

That is the niche `StampedLock` is trying to address.

---

## Modes

`StampedLock` exposes three major modes:

- optimistic read
- read lock
- write lock

The API returns a numeric stamp token that must later be:

- validated
- or used to unlock the specific acquired mode

This is more powerful than ordinary lock APIs, but also more error-prone.

---

## Why This Change Was Added

Traditional read-write locks still coordinate readers through explicit read-lock acquisition.

In very read-heavy scenarios, that can still add measurable overhead.

`StampedLock` offers an optimistic path:

- read fields quickly
- validate whether a write interfered
- retry with a stronger lock if needed

That can help when:

- reads dominate heavily
- write interference is rare
- profiling shows reader coordination overhead matters

This is not a general-purpose replacement.
It is a specialized optimization tool.

---

## Runnable Example

```java
import java.util.concurrent.locks.StampedLock;

public class StampedLockDemo {

    public static void main(String[] args) {
        Point point = new Point();
        point.move(10, 20);
        System.out.println("Distance = " + point.distanceFromOrigin());
    }

    static final class Point {
        private final StampedLock lock = new StampedLock();
        private double x;
        private double y;

        void move(double deltaX, double deltaY) {
            long stamp = lock.writeLock();
            try {
                x += deltaX;
                y += deltaY;
            } finally {
                lock.unlockWrite(stamp);
            }
        }

        double distanceFromOrigin() {
            long stamp = lock.tryOptimisticRead();
            double currentX = x;
            double currentY = y;

            if (!lock.validate(stamp)) {
                stamp = lock.readLock();
                try {
                    currentX = x;
                    currentY = y;
                } finally {
                    lock.unlockRead(stamp);
                }
            }

            return Math.sqrt(currentX * currentX + currentY * currentY);
        }
    }
}
```

The optimistic-read path is:

1. take a stamp
2. read fields
3. validate the stamp
4. fall back to a read lock if validation fails

If you skip the validation step, the whole design becomes incorrect.

---

## Production-Style Scenario

Potential fits:

- hot read-mostly geometry, routing, or statistics structures
- workloads with many reads and rare writes
- code where profiling shows read-lock overhead matters

Example:

- request threads repeatedly compute derived values from a mostly stable in-memory snapshot
- a background refresher writes only occasionally

In that shape of workload, optimistic reads can avoid some reader coordination cost.

---

## When It Helps

`StampedLock` is most promising when:

- reads dominate heavily
- the read path is hot
- writes are rare and short
- you can tolerate the extra implementation complexity
- the team understands the validation model

Without those conditions, the gains often do not justify the added risk.

---

## When It Hurts

Poor fits:

- general business code where simplicity matters more
- teams unfamiliar with the API
- write-heavy workloads
- codebases where maintainability is a bigger concern than squeezing out some read-side overhead

Because the API is more manual, it is easier to write code that is technically wrong while still looking plausible.

---

## Common Mistakes

- forgetting to validate optimistic reads
- reading fields optimistically and then acting on them without fallback
- using the wrong unlock method for the acquired mode
- choosing `StampedLock` before proving a real read-heavy need

The API gives more control, but it also removes some of the safety rails developers are used to.

---

## Comparison with Other Options

Compared with `ReentrantReadWriteLock`:

- `StampedLock` may reduce read-side coordination overhead
- but it is harder to use correctly

Compared with immutable snapshot replacement:

- `StampedLock` keeps one mutable structure
- immutable replacement may still be simpler in many backend systems

The fastest-looking primitive is not always the best system design.

---

## Key Takeaways

- `StampedLock` adds optimistic read alongside ordinary read and write modes.
- It exists for advanced read-heavy cases where traditional read locking may still cost too much.
- Correctness depends on validating optimistic reads and falling back when needed.
- Use it selectively, with measurement and discipline, not as a blanket upgrade.

Next post: [When StampedLock Helps and When It Hurts](/java/concurrency/when-stampedlock-helps-and-when-it-hurts/)
