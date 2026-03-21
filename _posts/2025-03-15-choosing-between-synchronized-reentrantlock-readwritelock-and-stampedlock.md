---
title: Choosing Between synchronized ReentrantLock ReadWriteLock and StampedLock
date: 2025-03-15
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- synchronized
- reentrantlock
- readwritelock
- stampedlock
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Choosing Between synchronized ReentrantLock ReadWriteLock and StampedLock
seo_description: Learn how to choose between synchronized, ReentrantLock,
  ReadWriteLock, and StampedLock in Java based on workload, control needs, and
  complexity.
header:
  overlay_image: "/assets/images/java-concurrency-module-06-explicit-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 6
  show_overlay_excerpt: false
---
Java gives you several ways to coordinate shared mutable state.

That does not mean they are interchangeable.

The right choice depends on:

- what invariant you must protect
- how much operational control you need
- whether the workload is read-heavy
- how much complexity the team can safely carry

---

## Start with the Simplest Correct Tool

A practical default order looks like this:

1. `synchronized` for simple mutual exclusion
2. `ReentrantLock` when you need timed, interruptible, or fairness-aware acquisition
3. `ReadWriteLock` when reads truly dominate and shared mutable state must remain mutable
4. `StampedLock` only for advanced read-mostly cases proven by measurement

This ordering matters because the tools get harder to misuse as you move upward.

---

## Runnable Example

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.concurrent.locks.StampedLock;

public class LockChoiceDemo {

    public static void main(String[] args) throws Exception {
        InventoryLedger ledger = new InventoryLedger();
        ledger.reserveOne();

        ShutdownAwareWorker worker = new ShutdownAwareWorker();
        worker.tryStart();

        CatalogCache cache = new CatalogCache();
        System.out.println(cache.get("P100"));

        GeometryIndex point = new GeometryIndex();
        point.move(3, 4);
        System.out.println(point.distanceFromOrigin());
    }

    // Good fit for simple exclusion with small critical sections.
    static final class InventoryLedger {
        private int stock = 10;

        synchronized boolean reserveOne() {
            if (stock == 0) {
                return false;
            }
            stock--;
            return true;
        }
    }

    // Good fit when interruption or timed waiting matters.
    static final class ShutdownAwareWorker {
        private final Lock lock = new ReentrantLock();

        boolean tryStart() throws InterruptedException {
            if (!lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                return false;
            }
            try {
                return true;
            } finally {
                lock.unlock();
            }
        }
    }

    // Good fit for read-heavy mutable state.
    static final class CatalogCache {
        private final ReadWriteLock lock = new ReentrantReadWriteLock();
        private final Map<String, String> products = new HashMap<>();

        CatalogCache() {
            products.put("P100", "Keyboard");
        }

        String get(String productId) {
            lock.readLock().lock();
            try {
                return products.get(productId);
            } finally {
                lock.readLock().unlock();
            }
        }
    }

    // Specialized fit for tiny optimistic reads on read-mostly state.
    static final class GeometryIndex {
        private final StampedLock lock = new StampedLock();
        private double x;
        private double y;

        void move(double dx, double dy) {
            long stamp = lock.writeLock();
            try {
                x += dx;
                y += dy;
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

The example is intentionally simple.
The decision logic is the real lesson.

---

## Decision Guide

Choose `synchronized` when:

- one monitor is enough
- lock scope is straightforward
- you do not need timed or interruptible acquisition

Choose `ReentrantLock` when:

- cancellation and shutdown matter
- `tryLock` or timeouts are part of the design
- you need multiple `Condition` queues

Choose `ReadWriteLock` when:

- reads dominate clearly
- the data stays mutable
- reader-reader overlap matters in profiling

Choose `StampedLock` when:

- reads are extremely frequent
- optimistic validation usually succeeds
- the team can handle the manual API safely

---

## Common Wrong Choices

Bad selection patterns are usually more revealing than good ones.

Examples:

- choosing `ReentrantLock` just because it looks more advanced
- choosing `ReadWriteLock` when writes are common
- choosing `StampedLock` without measuring read-lock overhead
- using any lock when immutable snapshot publication would remove the problem entirely

The question is not "which lock is fastest?"
The question is "which tool protects this invariant with the least unnecessary complexity?"

---

## Practical Rule

Default toward the lowest-complexity tool that fully matches the requirement.

That usually means:

- start with `synchronized`
- move to `ReentrantLock` for control features
- move to `ReadWriteLock` for real read-heavy contention
- move to `StampedLock` only as a targeted optimization

If you skip that order, you usually add risk before you add value.

---

## Key Takeaways

- Pick the primitive based on the protected invariant and the workload, not on perceived sophistication.
- `synchronized` is a strong default for simple mutual exclusion.
- `ReentrantLock`, `ReadWriteLock`, and `StampedLock` each earn their complexity only in narrower cases.
- Simpler concurrency designs usually win unless measurement proves otherwise.

Next post: [Atomic Classes in Java Overview](/java/concurrency/atomic-classes-in-java-overview/)
