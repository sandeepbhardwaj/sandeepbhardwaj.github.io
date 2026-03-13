---
title: Atomicity Visibility and Ordering in Java Concurrency
date: 2025-01-10
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- atomicity
- visibility
- ordering
- jmm
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Atomicity Visibility and Ordering in Java Concurrency
seo_description: Learn the difference between atomicity, visibility, and ordering
  in Java concurrency with practical examples and production-oriented design guidance.
header:
  overlay_image: "/assets/images/java-concurrency-module-01-foundations-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 1
  show_overlay_excerpt: false
---
Atomicity, visibility, and ordering are three different concerns.
Many concurrency bugs happen because developers fix one and assume the other two are automatically solved.

They are not.

This post closes Module 1 by separating those ideas cleanly.

---

## Problem Statement

Suppose you have a shared counter:

```java
class Counter {
    volatile int value;

    void increment() {
        value++;
    }
}
```

A lot of developers see `volatile` and think the code is now safe.

It is not.

Why?
Because `volatile` helps visibility and ordering, but `value++` is still not atomic.

That single example is enough to show why the three ideas must be understood separately.

---

## The Three Concepts

### Atomicity

Atomicity asks:
is this operation indivisible?

If two threads increment the same counter, can they interfere in the middle of the update?

If yes, atomicity is broken.

### Visibility

Visibility asks:
when one thread writes a value, when can another thread see it?

If a stop flag changes but another thread keeps reading the old value, visibility is broken.

### Ordering

Ordering asks:
in what order can actions be observed across threads?

If one thread publishes data and then flips a ready signal, can another thread see the signal without safely seeing the data?

Without proper synchronization, ordering assumptions are unsafe.

---

## Runnable Example: Visibility Without Atomicity

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class AtomicityDemo {

    public static void main(String[] args) throws Exception {
        Counter counter = new Counter();
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
        System.out.println("Final count = " + counter.value);
    }

    static final class Counter {
        volatile int value;

        void increment() {
            value++;
        }
    }
}
```

What this shows:

- `volatile` helps with visibility
- it does not make `value++` atomic
- lost updates are still possible

That is the exact distinction many developers miss early.

---

## Safe Version with Atomicity

One simple correction is a lock:

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

Now:

- increments are atomic inside the monitor
- writes and reads also gain visibility through synchronization

One primitive can address more than one concern, but only because it gives stronger guarantees.

---

## Ordering Example

Consider this publication pattern:

```java
class Publication {
    int data;
    volatile boolean ready;

    void publish() {
        data = 42;
        ready = true;
    }
}
```

If another thread sees `ready == true`, it can safely observe the earlier `data = 42` because the volatile write/read pair creates the necessary ordering and visibility edge.

That is not atomicity.
That is ordering plus visibility.

This is why the three concepts must not be merged into one vague idea of “thread safety.”

---

## Production-Style Example

Imagine a billing service with these shared elements:

- `shutdownRequested`
- `pendingBatches`
- `currentRules`

These do not all need the same primitive.

Possible design:

- `shutdownRequested` may only need visibility -> `volatile`
- `pendingBatches` may need atomic increment/decrement -> atomic class or lock
- `currentRules` may need immutable snapshot publication -> atomic or volatile reference

Trying to solve all three with one reflexive choice creates either bugs or unnecessary complexity.

---

## Failure Modes

Common mistakes:

- using `volatile` for compound updates
- using locks for simple immutable publication when a simpler approach exists
- assuming visibility implies atomicity
- assuming atomic single-variable operations preserve multi-field invariants

These mistakes are subtle because parts of the program appear to work.

---

## Performance and Trade-Offs

Atomicity, visibility, and ordering are not only correctness questions.
They also affect performance design.

Examples:

- using a lock for every simple flag may add unnecessary contention
- using `volatile` where compound invariants exist creates correctness bugs
- using immutable snapshots can reduce both locking and reasoning cost

The best design is usually the smallest primitive that fully preserves correctness.

---

## Testing and Debugging Notes

When reviewing concurrent code, ask three separate questions:

1. is the operation atomic?
2. are updates visible to other threads?
3. is the ordering assumption guaranteed?

If a design cannot answer each question clearly, it is incomplete.

This checklist should become second nature.

---

## Decision Guide

- need only a visibility flag? consider `volatile`
- need atomic read-modify-write? use a lock or atomic primitive
- need ordering across publication and signal? use a proper happens-before edge
- need multi-field invariants? use stronger coordination, not just visibility

These questions are the foundation for every later concurrency primitive in the series.

---

## Key Takeaways

- atomicity, visibility, and ordering are different problems
- one primitive may solve more than one, but only if its guarantees actually cover them
- many early Java concurrency bugs come from solving only one of the three

---

## Next Post

[Creating Threads with Thread in Java and Where It Breaks Down](/java/concurrency/creating-threads-with-thread-in-java-and-where-it-breaks-down/)
