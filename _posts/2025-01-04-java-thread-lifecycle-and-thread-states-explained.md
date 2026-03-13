---
title: Java Thread Lifecycle and Thread States Explained
date: 2025-01-04
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- threads
- lifecycle
- multithreading
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Java Thread Lifecycle and Thread States Explained
seo_description: Understand Java thread lifecycle and thread states with practical
  examples, scheduling behavior, blocking scenarios, and debugging guidance.
header:
  overlay_image: "/assets/images/java-concurrency-module-01-foundations-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 1
  show_overlay_excerpt: false
---
If you do not understand thread states, thread dumps will look like random noise.
You will see `RUNNABLE`, `WAITING`, or `BLOCKED` and still have no idea whether the system is healthy or stuck.

This post gives the lifecycle model you need before deeper concurrency topics.

---

## Problem Statement

A production incident says:

- request latency is rising
- CPU is low
- thread dump shows many threads in `WAITING`

Is that healthy backpressure, an idle pool, a deadlock precursor, or a dependency stall?

Without thread-state literacy, you cannot answer.

---

## Naive Mental Model

Many developers think a thread is either:

- running
- or not running

Java thread behavior is more nuanced.
Threads pass through multiple states depending on creation, scheduling, locking, waiting, sleeping, and completion.

---

## The Java Thread Lifecycle

The main thread states are:

- `NEW`
- `RUNNABLE`
- `BLOCKED`
- `WAITING`
- `TIMED_WAITING`
- `TERMINATED`

### `NEW`

Thread object created, but `start()` not yet called.

### `RUNNABLE`

Thread is eligible to run.
It may actually be executing, or ready to execute when scheduled.

### `BLOCKED`

Thread is waiting to acquire a monitor lock.
This usually points to `synchronized` contention.

### `WAITING`

Thread waits indefinitely for another thread’s action.
Examples:

- `Object.wait()`
- `Thread.join()`
- `LockSupport.park()`

### `TIMED_WAITING`

Thread waits for a bounded duration.
Examples:

- `Thread.sleep(...)`
- `wait(timeout)`
- `join(timeout)`

### `TERMINATED`

Thread completed execution.

---

## Why `RUNNABLE` Confuses People

In Java, `RUNNABLE` does not mean “currently on CPU right now.”
It means the thread is in a runnable state from the JVM’s perspective.

That means:

- it could be actively executing
- it could be waiting for CPU scheduling
- it could even be in native work that still maps to a runnable status

This is why thread dumps need interpretation, not just scanning.

---

## Runnable Example

This program creates threads that visit several states.

```java
import java.util.concurrent.TimeUnit;

public class ThreadStateDemo {

    private static final Object MONITOR = new Object();

    public static void main(String[] args) throws Exception {
        Thread sleepingThread = new Thread(() -> sleep(3000), "sleeping-thread");

        Thread lockHolder = new Thread(() -> {
            synchronized (MONITOR) {
                sleep(3000);
            }
        }, "lock-holder");

        Thread blockedThread = new Thread(() -> {
            synchronized (MONITOR) {
                System.out.println("Acquired monitor");
            }
        }, "blocked-thread");

        System.out.println("Before start: " + sleepingThread.getState()); // NEW

        sleepingThread.start();
        lockHolder.start();
        sleep(200);
        blockedThread.start();

        sleep(300);
        System.out.println("Sleeping thread: " + sleepingThread.getState());
        System.out.println("Lock holder: " + lockHolder.getState());
        System.out.println("Blocked thread: " + blockedThread.getState());

        sleepingThread.join();
        lockHolder.join();
        blockedThread.join();

        System.out.println("After completion: " + sleepingThread.getState()); // TERMINATED
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

Typical observations:

- before `start()`, thread is `NEW`
- a sleeping thread is `TIMED_WAITING`
- a thread waiting for a monitor is `BLOCKED`
- after completion, thread is `TERMINATED`

---

## Production Interpretation Guide

### Many `BLOCKED` threads

Usually means monitor contention.
Look for:

- broad `synchronized` sections
- shared singleton bottlenecks
- slow work inside monitor-held paths

### Many `WAITING` threads

This may be normal or bad.

Normal:

- idle executor workers waiting for tasks
- threads parked by coordination utilities

Bad:

- stuck joins
- lost-notification bugs
- threads waiting forever for an event that will never happen

### Many `TIMED_WAITING` threads

Often benign:

- scheduled retries
- polling loops
- backoff logic

But it may also mean wasted threads sleeping instead of using proper coordination.

---

## Production-Style Example

Imagine a report service:

- request threads submit report jobs
- worker threads process them
- idle workers wait for new tasks

In a healthy idle period, workers may be `WAITING`.
That is not a problem.

Now imagine billing refresh holds a global lock while making a slow remote call.
Other threads trying to update shared state may become `BLOCKED`.
That is a real concurrency smell.

The state alone is not enough.
You must combine state with what the thread is waiting on.

---

## Failure Modes and Edge Cases

Common misreadings:

- assuming `RUNNABLE` means “busy CPU”
- assuming `WAITING` means deadlock
- assuming `TIMED_WAITING` is harmless
- ignoring `BLOCKED` chains in hot request paths

A good concurrent engineer reads states in context:

- what code path is involved?
- what lock or condition is involved?
- how many threads show the same pattern?

---

## Testing and Debugging Notes

Useful habits:

- print thread names in learning examples
- capture thread dumps during artificial contention tests
- compare dumps under idle load and peak load
- distinguish pool idleness from request-path blockage

Later in the series, these skills become essential for diagnosing deadlocks, lock contention, and bad executor designs.

---

## Decision Guide

If a design frequently produces `BLOCKED` threads in request paths, reduce shared lock scope.
If it produces many parked or waiting threads, ask whether the waiting model is explicit and healthy.
If thread states are hard to explain, the concurrency design is probably too opaque.

---

## Key Takeaways

- Java threads move through specific lifecycle states
- `RUNNABLE` is broader than “currently executing”
- `BLOCKED`, `WAITING`, and `TIMED_WAITING` must be interpreted in context
- thread-state literacy is essential for debugging production concurrency issues

---

## Next Post

[Context Switching and Why Threads Are Expensive](/java/concurrency/context-switching-and-why-threads-are-expensive/)
