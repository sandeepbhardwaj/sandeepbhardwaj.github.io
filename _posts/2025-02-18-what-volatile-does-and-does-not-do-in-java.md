---
title: What volatile Does and Does Not Do in Java
date: 2025-02-18
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- volatile
- visibility
- java-memory-model
- atomicity
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: What volatile Does and Does Not Do in Java
seo_description: Learn exactly what volatile does in Java, what guarantees it
  provides, and where developers misuse it as a substitute for synchronization.
header:
  overlay_image: "/assets/images/java-concurrency-module-05-volatile-immutability-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 5
  show_overlay_excerpt: false
---
`volatile` is one of the most misunderstood keywords in Java concurrency.

Many developers learn one true fact about it, then overgeneralize that fact into several wrong conclusions.

So this article is about precision:

- what `volatile` actually guarantees
- what it very specifically does not guarantee
- why Java added this keyword in the first place

---

## Problem Statement

Suppose one thread sets a `shutdownRequested` flag and another thread loops until it sees that flag change.

Without the right visibility guarantee, the second thread is not required to observe the update promptly or reliably.

That is the kind of problem `volatile` exists to solve.

But now change the example:

- several threads increment a shared counter

That is not a visibility-only problem anymore.
That is where `volatile` stops being enough.

---

## What `volatile` Does

For a `volatile` field, Java gives you:

- visibility of writes across threads
- ordering guarantees around reads and writes of that field

In practice that means:

- when one thread writes a new value to a `volatile` field
- another thread reading that field is guaranteed to observe the latest published value according to the Java Memory Model rules

This is why `volatile` is a visibility tool.

---

## Why This Change Was Added

Modern CPUs and optimizing runtimes do not behave like one shared whiteboard where every thread instantly sees every update.

Without rules, threads can observe stale values because:

- writes may still be sitting in a core-local path
- reads may keep using cached or reordered views
- loops may be optimized in ways that assume no visible cross-thread update exists

`volatile` exists to create a disciplined visibility boundary for simple shared state.

It is not “magic thread safety.”
It is a specific memory-visibility mechanism.

---

## Runnable Good Example

```java
import java.util.concurrent.TimeUnit;

public class VolatileStopFlagDemo {

    public static void main(String[] args) throws Exception {
        WorkerControl workerControl = new WorkerControl();

        Thread worker = new Thread(workerControl::runLoop, "polling-worker");
        worker.start();

        TimeUnit.SECONDS.sleep(1);
        workerControl.stop();

        worker.join();
        System.out.println("Worker stopped cleanly");
    }

    static final class WorkerControl {
        private volatile boolean running = true;

        void stop() {
            running = false;
        }

        void runLoop() {
            long iterations = 0;
            while (running) {
                iterations++;
            }
            System.out.println("Stopped after iterations = " + iterations);
        }
    }
}
```

This works because the state is simple:

- one thread publishes a stop signal
- another thread must see the latest value

That is exactly a visibility problem.

---

## What `volatile` Does Not Do

`volatile` does not:

- make compound actions atomic
- protect multi-field invariants
- replace locking for critical sections
- turn `count++` into a safe concurrent increment

This is the most common mistake in intermediate Java concurrency code: confusing visibility with atomicity.

---

## Runnable Bad Example

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class VolatileCounterBugDemo {

    public static void main(String[] args) throws Exception {
        Counter counter = new Counter();
        ExecutorService executor = Executors.newFixedThreadPool(8);

        for (int i = 0; i < 1000; i++) {
            executor.submit(counter::increment);
        }

        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);

        System.out.println("Expected = 1000");
        System.out.println("Actual   = " + counter.getCount());
    }

    static final class Counter {
        private volatile int count;

        void increment() {
            int current = count;
            count = current + 1;
        }

        int getCount() {
            return count;
        }
    }
}
```

The field is visible.
The update is still not atomic.

That distinction is the whole point.

---

## Production-Style Use Cases

Good fits:

- stop flags
- immutable configuration snapshot references
- lifecycle state such as `STARTING`, `RUNNING`, or `STOPPING`
- one-writer status fields that many threads read

Bad fits:

- counters
- reservation logic
- check-then-act flows
- multi-field state transitions
- inventory, balance, quota, or workflow invariants

If business correctness depends on several steps behaving like one unit, `volatile` is the wrong tool by itself.

---

## Practical Mental Model

Think of `volatile` as:

- a visibility and ordering guarantee for one field

Do not think of it as:

- a substitute for mutual exclusion
- a substitute for atomic updates
- a “lightweight lock”

That mental correction prevents most misuse.

---

## Decision Guide

Reach for `volatile` when the problem is:

- “other threads must see the latest published value”

Reach for atomics when the problem is:

- “one variable must change atomically”

Reach for `synchronized` or `Lock` when the problem is:

- “a whole critical section or multi-field invariant must stay correct”

---

## Common Mistakes

- marking a mutable object reference `volatile` and then mutating the object's internals unsafely
- assuming `volatile` fixes stale reads and lost updates at the same time
- using it because it looks cheaper than real synchronization without checking whether the invariant is actually simple enough

The shorter keyword is not the safer choice if the problem shape is wrong.

---

## Key Takeaways

- `volatile` solves visibility and ordering for a field, not general thread safety.
- It is excellent for simple published state such as stop flags and immutable snapshot references.
- It does not make compound actions atomic.
- Correct concurrency design starts by matching the primitive to the invariant.

Next post: [Using volatile for Visibility in Java](/java/concurrency/using-volatile-for-visibility-in-java/)
