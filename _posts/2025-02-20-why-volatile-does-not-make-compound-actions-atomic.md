---
title: Why volatile Does Not Make Compound Actions Atomic
date: 2025-02-20
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- volatile
- atomicity
- race-condition
- java-memory-model
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Why volatile Does Not Make Compound Actions Atomic
seo_description: Learn why volatile does not make compound actions atomic in
  Java, with examples of counters, check-then-act logic, and lost updates.
header:
  overlay_image: "/assets/images/java-concurrency-module-05-volatile-immutability-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 5
  show_overlay_excerpt: false
---
Many Java concurrency bugs come from one mistaken belief:

“If I mark the field `volatile`, concurrent updates become safe.”

That belief is wrong.

---

## Problem Statement

Suppose multiple threads increment a shared request counter:

```java
class RequestCounter {
    private volatile int count;

    void increment() {
        count++;
    }
}
```

This code has visibility.
It does not have atomicity.

---

## Why It Still Fails

`count++` is not one machine-level conceptual step.

It is:

- read current count
- compute next count
- write next count

Two threads can both read the same old value and both write back a value derived from that same snapshot.

One increment disappears.

---

## Runnable Example

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class VolatileIsNotAtomicDemo {

    public static void main(String[] args) throws Exception {
        RequestCounter counter = new RequestCounter();
        ExecutorService executor = Executors.newFixedThreadPool(8);

        for (int i = 0; i < 1000; i++) {
            executor.submit(counter::increment);
        }

        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);

        System.out.println("Expected = 1000");
        System.out.println("Actual   = " + counter.count());
    }

    static final class RequestCounter {
        private volatile int count;

        void increment() {
            int current = count;
            sleep(1);
            count = current + 1;
        }

        int count() {
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

The counter is visible.
It is still wrong.

---

## Check-Then-Act Still Fails Too

```java
class CouponRegistry {
    private volatile boolean used;

    boolean reserve() {
        if (!used) {
            used = true;
            return true;
        }
        return false;
    }
}
```

This is also broken.

Two threads can both observe `used == false` before either write becomes the decisive winner for correctness.

---

## What to Use Instead

Use:

- `AtomicInteger` or `AtomicLong` for simple numeric atomic updates
- `AtomicBoolean.compareAndSet` for state transitions
- `synchronized` or `Lock` for multi-step or multi-field invariants

The rule is simple:

- `volatile` for visibility
- atomics for single-variable atomic transitions
- locks for richer critical sections

---

## The Mental Model to Remember

`volatile` answers a visibility question:

- when one thread writes, when do other threads reliably see that write

Atomicity answers a different question:

- can this whole multi-step transition be observed or interleaved halfway through

Those questions are related, but they are not interchangeable.
That is why `volatile` can be exactly correct for a stop flag and completely wrong for a counter or reservation step.

## Testing and Review Notes

Whenever code combines `volatile` with logic that spans more than one step, review aggressively.
Look for patterns like:

- read then write
- check then act
- compare one field and update another
- compute a new value from the old one

If the correctness rule depends on those steps staying together, a visibility keyword alone cannot enforce it.

## A Quick Review Shortcut

If you can describe an operation as read-modify-write, compare-and-decide, or check-then-act, stop and verify atomicity explicitly.
Those phrases are strong clues that visibility alone is not enough.
They are the review language that catches many mistaken `volatile` designs early.

## Key Takeaways

- `volatile` does not make read-modify-write or check-then-act code safe.
- Visibility and atomicity are different guarantees.
- If your logic has several dependent steps, `volatile` alone is not enough.
- Pick the primitive that matches the invariant, not the shortest keyword.

Next post: [volatile vs synchronized in Java](/2025/02/21/volatile-vs-synchronized-in-java/)
