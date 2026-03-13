---
title: Context Switching and Why Threads Are Expensive
date: 2025-01-05
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- threads
- performance
- context-switching
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Context Switching and Why Threads Are Expensive
seo_description: Learn why threads are expensive in Java systems, how context switching
  hurts throughput, and what that means for backend thread pool design.
header:
  overlay_image: "/assets/images/java-concurrency-module-01-foundations-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 1
  show_overlay_excerpt: false
---
Threads are useful, but they are not free.
If you treat them like cheap magic, your system will waste CPU, memory, and latency budget just coordinating execution.

This post explains the cost behind the abstraction.

---

## Problem Statement

A service under load becomes slower after increasing its worker threads from 32 to 256.
At first that feels backward.
More workers should mean more throughput, right?

Not always.

One reason is context switching:
the CPU spends more time swapping between threads and less time doing useful work.

---

## Naive Mental Model

The naive model is:

- more threads = more work done

That only holds in a narrow range.

Real systems pay for threads in several ways:

- memory for stacks and runtime metadata
- scheduler overhead
- cache disruption
- lock contention amplification
- harder debugging and tuning

---

## What Context Switching Actually Means

The CPU can only execute a limited number of threads at once.
When many runnable threads compete, the scheduler switches from one to another.

That switch involves work:

- saving execution state
- restoring another thread’s state
- disturbing CPU caches
- increasing coordination overhead

Individually, a switch can be cheap.
At scale, thousands of unnecessary switches degrade throughput and tail latency.

---

## Why Threads Feel Cheap Until They Don’t

At small scale, threads are convenient because:

- Java makes them easy to create
- blocking code is easy to write
- early tests rarely create serious pressure

At production scale, the same design can become expensive because:

- blocked threads still occupy memory
- oversubscribed CPU-bound work thrashes the scheduler
- too many workers increase queueing and lock competition

So the right question is not “can I create this thread?”
The right question is “what sustained resource pressure does this execution model create?”

---

## Runnable Example

This example is not a benchmark.
It is a teaching demo that shows how many threads can end up mostly waiting or competing.

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ThreadCostDemo {

    public static void main(String[] args) throws Exception {
        ExecutorService executor = Executors.newFixedThreadPool(50);
        List<Runnable> tasks = new ArrayList<>();

        for (int i = 0; i < 200; i++) {
            final int id = i;
            tasks.add(() -> {
                busyCpu(100);
                sleep(200);
                System.out.println("Task " + id + " finished on " + Thread.currentThread().getName());
            });
        }

        long start = System.currentTimeMillis();
        for (Runnable task : tasks) {
            executor.submit(task);
        }

        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.MINUTES);
        long duration = System.currentTimeMillis() - start;

        System.out.println("Total duration: " + duration + " ms");
    }

    static void busyCpu(long millis) {
        long end = System.nanoTime() + TimeUnit.MILLISECONDS.toNanos(millis);
        long x = 0;
        while (System.nanoTime() < end) {
            x += System.nanoTime() % 13;
        }
        if (x == -1) {
            System.out.println(x);
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

What this illustrates:

- threads may alternate between CPU demand and blocking
- large worker counts can create more scheduling work than useful work
- the right pool size depends on workload shape, not intuition

---

## Production-Style Scenario

Suppose an API service has:

- 300 request threads
- each request does a small amount of CPU work
- each request also makes blocking database and HTTP calls

Symptoms under overload:

- thread count looks “healthy” because threads exist
- CPU is inconsistent
- latency spikes
- GC pressure rises because queues and request objects accumulate

The system is not bottlenecked only by business logic.
It is bottlenecked by the execution model itself.

---

## Where Cost Comes From

### 1. Stack Memory

Every thread needs a stack.
High thread counts mean significant reserved memory.

### 2. Scheduler Overhead

Runnable threads compete for CPU time.
Too many runnable threads increase switch frequency.

### 3. Cache Disruption

Switching between threads can reduce cache locality.
That hurts CPU efficiency.

### 4. Coordination Cost

More threads often means:

- more lock contention
- more queue contention
- more wake-up coordination

Threads do not just execute business logic.
They also compete with each other.

---

## Failure Modes

Common design mistakes:

- creating a thread per request
- using very large fixed pools for CPU-heavy work
- mixing blocking I/O and CPU-heavy work in the same executor
- assuming idle threads are harmless

These mistakes produce systems that look flexible at small scale and unstable at larger scale.

---

## Testing and Debugging Notes

Useful signals:

- thread count
- runnable thread count
- CPU saturation
- lock contention
- queue depth
- p95 and p99 latency

If latency gets worse after increasing threads, investigate:

1. context switching pressure
2. queue growth
3. lock contention
4. blocked external dependencies

More threads can hide the real bottleneck for a while, then magnify it.

---

## Decision Guide

- for CPU-bound work, keep thread count near available cores
- for blocking I/O, use more threads than CPU count, but still with limits
- separate CPU-heavy and I/O-heavy work into different executors
- do not use thread count as a substitute for backpressure

Later posts on executors and thread pools will make this concrete.

---

## Key Takeaways

- threads are useful but expensive
- context switching is real overhead, not an academic detail
- more threads can reduce performance instead of increasing it
- executor sizing must match workload shape
- concurrency is a resource-management problem as much as a correctness problem

---

## Next Post

[Shared Memory vs Message Passing in Java Applications](/java/concurrency/shared-memory-vs-message-passing-java-applications/)
