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

## Operational Signals and Review Notes

Starvation is easiest to miss when dashboards show that the service is "up" overall.
The important signal is often unevenness:

- one queue grows while another stays healthy
- some request classes hit timeouts while others stay fast
- housekeeping or refresh jobs drift later and later
- specific thread pools stay saturated for long periods

In review, ask who can be postponed indefinitely by this design.
If there is no clear answer, you probably do not yet understand the fairness story.
That question is especially important with shared executors, unfair locks, and mixed latency classes in one queue.

## Testing Strategy

Tests for starvation should not only assert eventual completion under light load.
They should also simulate sustained occupancy where fast or favored work keeps arriving.
That is when fairness assumptions are exposed.
If one class of work only succeeds when the system is mostly idle, the design is probably already too fragile.

## Design Heuristic

A practical rule is to separate work by latency class before starvation symptoms force you to.
Fast request work, slow blocking maintenance, and low-priority background tasks should not all depend on the same small queue and the same handful of workers if fairness matters to the feature.
That separation is often more effective than trying to rescue a mixed workload later with tuning alone.

## Capacity Planning Note

Starvation is often a sizing and ownership problem as much as a locking problem.
If important work has no reserved path to execution, it will eventually compete with work that should never have been allowed to dominate it.
That is why queue ownership and workload separation are design decisions, not just tuning details.

## Key Takeaways

- Starvation means some threads or tasks repeatedly fail to get enough progress.
- It is often caused by unfair scheduling, pool saturation, or long blocking tasks.
- A system can appear alive while specific work classes are effectively starved.
- Executor separation, timeout discipline, and workload-aware sizing are major defenses.

Next post: [Priority Inversion in Concurrent Systems](/java/concurrency/priority-inversion-in-concurrent-systems/)
