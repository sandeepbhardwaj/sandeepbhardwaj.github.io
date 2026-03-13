---
title: Starvation in Java Concurrency
date: 2025-02-13
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- starvation
- fairness
- executors
- locks
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Starvation in Java Concurrency
seo_description: Learn what starvation means in Java concurrency, why some
  threads never get enough progress, and how to design for fairness.
header:
  overlay_image: "/assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 4
  show_overlay_excerpt: false
---
Starvation happens when a thread is not blocked forever by one circular wait, but still fails to make enough progress because other work keeps getting preference.

The system runs.
Some threads still lose.

---

## Problem Statement

Suppose a shared resource is constantly claimed by fast or favored threads.

A slower thread may technically have a path to progress, but in practice it keeps getting postponed.

That is starvation.

---

## Runnable Example

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class StarvationDemo {

    public static void main(String[] args) throws Exception {
        ExecutorService executor = Executors.newFixedThreadPool(2);

        executor.submit(longRunningTask("worker-a"));
        executor.submit(longRunningTask("worker-b"));
        executor.submit(shortTask("worker-c"));

        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);
    }

    static Runnable longRunningTask(String name) {
        return () -> {
            System.out.println(name + " started");
            sleep(3000);
            System.out.println(name + " finished");
        };
    }

    static Runnable shortTask(String name) {
        return () -> System.out.println(name + " finally got CPU time");
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

This example shows starvation through pool saturation: the short task is ready but waits because all workers are consumed by long-running work.

---

## Common Sources of Starvation

- thread pools with too few workers
- unbounded long-running tasks occupying executor threads
- unfair lock acquisition under heavy contention
- CPU-heavy work monopolizing shared execution resources
- priority schemes that repeatedly prefer some classes of tasks

The details vary, but the pattern is the same: some work gets systematically delayed.

---

## Production-Style Scenario

Imagine one shared executor for:

- request handling
- cache refresh
- audit logging
- email notification

If slow external calls consume all workers, fast but critical housekeeping tasks may wait far too long.

The service is not technically deadlocked.
It is operationally unhealthy because latency and scheduling fairness collapsed.

---

## Why Starvation Is Dangerous

Starvation can look less dramatic than deadlock, but it is often more common.

It causes:

- extreme tail latency
- delayed cleanup and refresh tasks
- missed heartbeats
- timeout storms
- partial outages where only some task classes fail

It is especially common in services that under-separate CPU work, blocking IO, and background maintenance.

---

## Better Design

Mitigation techniques include:

- separate executors by workload type
- bound task duration and handle timeouts
- avoid running blocking IO on pools sized for CPU work
- use fair coordination only when it solves a real problem
- monitor queue depth, active thread count, and wait time

Fairness has a cost, but ignoring starvation has a bigger one.

---

## Lock-Related Starvation

Starvation is not only an executor problem.

Under contention, one thread may repeatedly miss lock acquisition because other threads reacquire quickly.

That is why fairness settings exist on some explicit locks.
They are not free, but they can matter for specific workloads.

---

## Key Takeaways

- Starvation means some threads or tasks repeatedly fail to get enough progress.
- It is often caused by unfair scheduling, pool saturation, or long blocking tasks.
- A system can appear alive while specific work classes are effectively starved.
- Executor separation, timeout discipline, and workload-aware sizing are major defenses.

Next post: [Priority Inversion in Concurrent Systems](/2025/02/14/priority-inversion-in-concurrent-systems/)
