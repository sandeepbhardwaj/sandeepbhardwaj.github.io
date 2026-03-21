---
title: Reentrancy of Intrinsic Locks in Java
date: 2025-01-26
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- synchronized
- reentrancy
- monitor
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Reentrancy of Intrinsic Locks in Java
seo_description: Learn what reentrancy means for Java intrinsic locks and why synchronized
  methods can safely call each other on the same object.
header:
  overlay_image: "/assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 3
  show_overlay_excerpt: false
---
Java intrinsic locks are reentrant.
That means a thread that already owns a monitor may enter another synchronized section guarded by the same monitor again without deadlocking itself.

This sounds like a small detail.
It is actually one of the reasons synchronized code is usable in real object-oriented designs.

---

## Problem Statement

Suppose a synchronized method calls another synchronized method on the same object.

Should that deadlock?

If Java intrinsic locks were not reentrant, it would.
That would make ordinary object-oriented factoring extremely awkward.

Instead, Java tracks monitor ownership per thread and allows re-entry by the owner.

---

## Naive Fear

A common concern sounds like this:

- method A is synchronized
- method A calls method B
- method B is also synchronized
- “won’t the same thread block on its own lock?”

In Java, the answer is no when both use the same intrinsic lock and the same thread already owns it.

That is reentrancy.

---

## Correct Mental Model

Reentrancy means:

- lock ownership is not just “locked or unlocked”
- the runtime also knows which thread owns it
- the owning thread may enter again

Conceptually, reentrant entry increases an ownership count.
Exiting synchronized sections reduces it until the lock is fully released.

This makes nested synchronized calls on the same object practical.

---

## Runnable Example

```java
public class ReentrancyDemo {

    public static void main(String[] args) throws Exception {
        Service service = new Service();

        Thread thread = new Thread(service::outerOperation, "service-thread");
        thread.start();
        thread.join();
    }

    static final class Service {
        synchronized void outerOperation() {
            System.out.println("Entered outerOperation");
            innerOperation();
            System.out.println("Leaving outerOperation");
        }

        synchronized void innerOperation() {
            System.out.println("Entered innerOperation on same monitor");
        }
    }
}
```

This works because the same thread already owns the monitor for the `Service` instance.

---

## Why Reentrancy Matters in Real Code

Without reentrancy, designs like these would become painful:

- synchronized template methods calling synchronized helpers
- invariant-preserving methods composed from smaller synchronized methods
- layered object methods reusing shared lock boundaries

Reentrancy makes these patterns possible without manual lock flattening everywhere.

That said, reentrancy is a convenience and a capability.
It is not a license to build huge tangled synchronized call graphs.

---

## Production-Style Example

Imagine an account aggregate:

- `reserveFunds()`
- `applyFee()`
- `recordAuditState()`

You may want a top-level synchronized operation to call smaller synchronized helpers that assume the same invariant boundary.

```java
public final class AccountLedger {
    private int available;
    private int held;

    public synchronized boolean reserveWithFee(int amount, int fee) {
        if (!reserveFunds(amount)) {
            return false;
        }
        applyFee(fee);
        return true;
    }

    private synchronized boolean reserveFunds(int amount) {
        if (available < amount) {
            return false;
        }
        available -= amount;
        held += amount;
        return true;
    }

    private synchronized void applyFee(int fee) {
        if (available < fee) {
            throw new IllegalStateException("Fee exceeds remaining funds");
        }
        available -= fee;
    }
}
```

This structure would be awkward if the same owning thread could not re-enter the monitor.

---

## Common Mistakes

### Mistake 1: Assuming reentrancy solves all lock composition problems

It only helps when the same thread re-enters the same lock.
It does not prevent deadlocks involving:

- different locks
- different threads
- inconsistent lock ordering

### Mistake 2: Building deep synchronized call chains

Reentrancy keeps them from self-deadlocking, but it does not make them easy to reason about.

Large reentrant call graphs often hide oversized critical sections.

---

## Testing and Debugging Notes

When reviewing synchronized code, ask:

1. is nested synchronized access intentional?
2. does the code rely on the same monitor consistently?
3. is reentrancy keeping the design clean, or hiding overly coupled logic?

If a synchronized object requires many nested locked calls, it may be protecting too much behavior in one place.

---

## Decision Guide

Reentrancy is useful when:

- one invariant boundary spans several helper methods

It becomes a design smell when:

- synchronized methods call each other so deeply that lock scope becomes hard to see

Prefer clarity over clever nesting.

---

## Key Takeaways

- Java intrinsic locks are reentrant
- the same thread may enter the same monitor multiple times
- reentrancy supports normal object-oriented factoring
- it does not eliminate deadlocks involving multiple locks or threads

---

## Next Post

[wait notify and notifyAll in Java Explained Properly](/java/concurrency/wait-notify-and-notifyall-in-java-explained-properly/)
