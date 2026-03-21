---
title: ReentrantLock in Java Deep Dive
date: 2025-03-03
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- reentrantlock
- lock
- reentrancy
- synchronization
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: ReentrantLock in Java Deep Dive
seo_description: Learn ReentrantLock in detail, including reentrancy, lock
  discipline, operational features, and production-style usage.
header:
  overlay_image: "/assets/images/java-concurrency-module-06-explicit-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 6
  show_overlay_excerpt: false
---
`ReentrantLock` is the most widely used explicit lock in Java.

It gives you the same basic mutual exclusion goal as `synchronized`, but with a larger control surface around acquisition, waiting, fairness, and conditions.

The name matters too: it is reentrant, which means the thread that already holds the lock can acquire it again safely.

---

## Problem Statement

Suppose an order service updates order state and writes an audit record inside helper methods.

Both methods need the same critical section.

If the lock were not reentrant, a thread could deadlock itself by calling one lock-protected method from another.

---

## What Reentrancy Means

```java
import java.util.concurrent.locks.ReentrantLock;

class OrderService {
    private final ReentrantLock lock = new ReentrantLock();

    void updateOrder() {
        lock.lock();
        try {
            writeAudit();
        } finally {
            lock.unlock();
        }
    }

    void writeAudit() {
        lock.lock();
        try {
            System.out.println("Audit written");
        } finally {
            lock.unlock();
        }
    }
}
```

The second `lock()` works because the same thread already owns the lock.

Important detail:

- each successful acquisition increments the hold count
- each `unlock()` decrements it
- the lock is not truly released until the hold count returns to zero

---

## Basic Discipline

The essential usage pattern never changes:

```java
lock.lock();
try {
    // critical section
} finally {
    lock.unlock();
}
```

If you forget the `finally` block, the code is not “slightly unsafe.”
It is broken under failure paths.

---

## Runnable Example

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockDemo {

    public static void main(String[] args) throws Exception {
        OrderWorkflow workflow = new OrderWorkflow();
        workflow.processPaidOrder("ORD-101");
    }

    static final class OrderWorkflow {
        private final ReentrantLock lock = new ReentrantLock();

        void processPaidOrder(String orderId) {
            lock.lock();
            try {
                System.out.println("Hold count in processPaidOrder = " + lock.getHoldCount());
                updateStatus(orderId);
            } finally {
                lock.unlock();
            }
        }

        void updateStatus(String orderId) {
            lock.lock();
            try {
                System.out.println("Hold count in updateStatus = " + lock.getHoldCount());
                sleep(100);
                System.out.println("Updated order " + orderId);
            } finally {
                lock.unlock();
            }
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

This demo makes the reentrancy visible through the hold count.

---

## What `ReentrantLock` Adds Beyond `synchronized`

The practical additions are:

- fairness option
- `tryLock()`
- timed acquisition
- `lockInterruptibly()`
- `Condition`
- inspection helpers such as `isHeldByCurrentThread()` and `getHoldCount()`

That is why it is often the explicit-lock workhorse in application code.

---

## Production-Style Example

Imagine a bounded API token cache:

- refresh logic needs exclusive mutation
- request paths may skip if the lock is too hot
- shutdown wants blocked maintenance threads to stop waiting
- one condition waits for refresh completion

That is a natural `ReentrantLock` use case because monitor semantics alone become awkward.

---

## Common Mistakes

- locking in one method and unlocking in another without clear ownership
- forgetting `finally`
- using `ReentrantLock` only because it feels more advanced than `synchronized`
- assuming reentrancy means recursive locking is always a good design

Reentrancy is a capability, not a recommendation to create deep lock-heavy call trees.

---

## Key Takeaways

- `ReentrantLock` is an explicit, reentrant mutual exclusion primitive with richer operational behavior than `synchronized`.
- Reentrancy means the owning thread can reacquire the same lock, but must still release it the same number of times.
- The main reasons to choose it are timed acquisition, interruptible acquisition, fairness, and `Condition`.
- Always pair acquisition and release in the same logical ownership boundary.

Next post: [Fair vs Non Fair Locks in Java](/java/concurrency/fair-vs-non-fair-locks-in-java/)
