---
title: synchronized Methods and Blocks in Java
date: 2025-01-21
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- synchronized
- monitor
- threads
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: synchronized Methods and Blocks in Java
seo_description: Learn how synchronized methods and blocks work in Java with practical
  examples, production-style locking boundaries, and concurrency trade-offs.
header:
  overlay_image: "/assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 3
  show_overlay_excerpt: false
---
`synchronized` is the first real shared-state protection mechanism most Java developers use.
It is simple enough to learn quickly and powerful enough to build correct concurrency boundaries when used carefully.

This post starts Module 3 by focusing on what `synchronized` actually guarantees and where developers misuse it.

---

## Problem Statement

Suppose multiple threads update shared inventory or account balances.
Without coordination, updates can interleave and corrupt state.

You need a boundary that says:

- only one thread may execute this critical section at a time
- writes inside that boundary must become visible correctly

That is the role of `synchronized`.

---

## Naive Version

Here is the classic broken counter:

```java
class Counter {
    private int value;

    void increment() {
        value++;
    }

    int get() {
        return value;
    }
}
```

Under concurrent access, this can lose updates because `value++` is not atomic.

---

## Correct Mental Model

`synchronized` creates a monitor-based critical section.

At a high level it gives:

- mutual exclusion
- visibility guarantees when entering and exiting the monitor
- reentrant locking behavior

It does not give:

- magic scalability
- fair scheduling
- timeout-based acquisition

It is a correctness tool first.

---

## synchronized Method vs synchronized Block

### synchronized method

```java
class SafeCounter {
    private int value;

    synchronized void increment() {
        value++;
    }

    synchronized int get() {
        return value;
    }
}
```

### synchronized block

```java
class SafeCounter {
    private int value;
    private final Object lock = new Object();

    void increment() {
        synchronized (lock) {
            value++;
        }
    }

    int get() {
        synchronized (lock) {
            return value;
        }
    }
}
```

The block form is often better when:

- you want a smaller critical section
- you do not want callers synchronizing on the object itself
- you want a dedicated lock object

---

## Runnable Example

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class SynchronizedCounterDemo {

    public static void main(String[] args) throws Exception {
        SafeCounter counter = new SafeCounter();
        ExecutorService executor = Executors.newFixedThreadPool(8);
        List<Callable<Void>> tasks = new ArrayList<>();

        for (int i = 0; i < 1000; i++) {
            tasks.add(() -> {
                counter.increment();
                return null;
            });
        }

        List<Future<Void>> futures = executor.invokeAll(tasks);
        for (Future<Void> future : futures) {
            future.get();
        }

        executor.shutdown();
        System.out.println("Final value = " + counter.get());
    }

    static final class SafeCounter {
        private int value;

        synchronized void increment() {
            value++;
        }

        synchronized int get() {
            return value;
        }
    }
}
```

This is one of the simplest correct shared-state boundaries in Java.

---

## Production-Style Example

Consider an inventory reservation service:

- available units
- reserved units
- sold units

Those fields form an invariant.
They should move together under one protected boundary.

```java
public final class Inventory {
    private int available;
    private int reserved;
    private int sold;

    public Inventory(int available) {
        this.available = available;
    }

    public synchronized boolean reserve(int quantity) {
        if (available < quantity) {
            return false;
        }
        available -= quantity;
        reserved += quantity;
        return true;
    }

    public synchronized void confirmSale(int quantity) {
        if (reserved < quantity) {
            throw new IllegalStateException("Reserved stock too low");
        }
        reserved -= quantity;
        sold += quantity;
    }
}
```

Why this matters:

- the invariant stays inside one atomic boundary
- readers and writers do not observe partially updated state under the same lock discipline

This is much more realistic than treating `synchronized` as a toy counter keyword.

---

## Common Mistakes

### Synchronizing on the wrong object

If readers and writers use different lock objects, there is no real shared protection.

### Holding the lock across slow I/O

This increases contention sharply.

### Exposing the lock implicitly

Synchronizing on `this` can be acceptable, but it also means outside code could synchronize on the same object and affect your behavior.

### Using huge critical sections

Correctness may improve, but throughput and latency may get worse.

---

## Performance and Trade-Offs

`synchronized` is often the safest default when:

- critical sections are small
- invariants are local
- advanced lock features are unnecessary

It becomes less attractive when:

- you need timed acquisition
- you need interruptible lock attempts
- you want multiple conditions
- contention is high and finer control matters

Those cases lead into later posts on explicit locks.

---

## Testing and Debugging Notes

When reviewing synchronized code, ask:

1. what shared state is protected?
2. is every access guarded by the same monitor?
3. is the critical section small and meaningful?
4. is any slow external work happening inside the lock?

Those questions catch most structural locking mistakes early.

---

## Decision Guide

Use `synchronized` when:

- shared mutable state must be protected
- lock scope is small and clear
- advanced lock features are unnecessary

Prefer block form over method form when:

- only part of the method needs protection
- a dedicated private lock object is safer

---

## Key Takeaways

- `synchronized` provides mutual exclusion and visibility guarantees
- synchronized methods and blocks solve the same core problem but offer different scoping control
- it is a strong default for local shared-state correctness
- it should guard invariants, not huge slow paths

---

## Next Post

[What a Monitor Is in Java and How Intrinsic Locking Works](/java/concurrency/what-a-monitor-is-in-java-and-how-intrinsic-locking-works/)
