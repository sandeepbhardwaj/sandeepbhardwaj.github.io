---
title: Thread Pool Sizing for CPU Bound Workloads
date: 2025-05-05
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- thread-pool-sizing
- cpu-bound
- executors
- performance
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Thread Pool Sizing for CPU Bound Workloads
seo_description: Learn how to size Java thread pools for CPU-bound workloads,
  why too many threads hurt throughput, and what to measure in practice.
header:
  overlay_image: "/assets/images/java-concurrency-module-10-executors-futures-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 10
  show_overlay_excerpt: false
---
CPU-bound thread pool sizing is one of the few concurrency topics where "more parallelism" often becomes worse surprisingly quickly.

If the work is truly CPU-bound, then threads compete for the same finite thing:

- processor time

Beyond a certain point, extra threads do not create useful parallelism.
They create:

- context switching
- cache disruption
- scheduling overhead

That is why CPU-bound pool sizing is usually much tighter than teams first expect.

---

## Problem Statement

Suppose tasks spend most of their time doing:

- parsing
- compression
- encryption
- image processing
- local computation

and very little time waiting on external I/O.

In that case, the question is not:

- how many tasks can we queue

It is:

- how many threads should actively contend for CPU at once

If that number is too low, hardware sits underutilized.
If that number is too high, throughput and latency both degrade.

---

## Mental Model

For a CPU-bound pool:

- the processors are the true scarce resource
- each runnable thread competes for CPU slices

So the pool size usually wants to be around the number of available cores, sometimes plus a small adjustment.

A practical starting point is:

- roughly `Runtime.getRuntime().availableProcessors()`

This is not a sacred formula.
It is a starting point because CPU-bound work benefits most when:

- there are enough runnable threads to keep cores busy
- but not so many that the scheduler becomes the main actor

---

## Runnable Example

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class CpuBoundSizingDemo {

    public static void main(String[] args) throws Exception {
        int cores = Runtime.getRuntime().availableProcessors();
        ExecutorService executor = Executors.newFixedThreadPool(cores);

        try {
            Future<Long> future = executor.submit(CpuBoundSizingDemo::cpuHeavyWork);
            System.out.println("Computed value = " + future.get());
        } finally {
            executor.shutdown();
        }
    }

    static long cpuHeavyWork() {
        long sum = 0;
        for (int i = 0; i < 10_000_000; i++) {
            sum += (i * 31L) % 7;
        }
        return sum;
    }
}
```

The example is intentionally small.
The important point is the sizing principle, not the arithmetic.

---

## Why Too Many Threads Hurt

Once CPU is saturated, additional runnable threads tend to cause:

- more context switches
- worse cache locality
- less predictable latency

This means "more threads" can reduce total useful work completed per second.

That surprises teams used to I/O-bound systems, where extra threads sometimes help hide waiting.

For CPU-bound work, thread count is not mainly about hiding wait time.
It is about matching available compute resources closely.

---

## Practical Sizing Guidance

Start with:

- core count

Then measure:

- CPU utilization
- throughput
- latency
- run queue saturation

Possible adjustments:

- slightly above core count if there is minor incidental blocking
- slightly below if the machine is shared with other important workloads

The right size is contextual.
The wrong pattern is choosing a large number because "more workers sounds safer."

---

## Common Mistakes

### Using huge pools for compute-heavy work

This usually hurts throughput and increases tail latency.

### Ignoring container or cgroup CPU limits

The visible logical CPU count may not match what the process is truly allowed to use in deployment.

### Mixing blocking work into the same CPU pool

That distorts the assumptions behind the sizing.

### Measuring only average latency

Oversized CPU pools often show their harm more clearly in tail latency and scheduler behavior than in simple averages.

---

## Testing and Observability

Useful metrics:

- CPU utilization
- task throughput
- queue depth
- p95 and p99 latency
- system load and run queue pressure

Useful experiments:

- run the same workload at pool sizes near `cores - 1`, `cores`, `cores + 1`, and much larger
- compare throughput and latency, not just one metric

This is one of the best places for small local load experiments because the workload is easy to isolate.

---

## Decision Guide

For CPU-bound workloads:

- start near available core count
- separate them from blocking I/O pools
- tune with measurement rather than folklore

If the pool needs to be much larger to stay busy, the work may not be as CPU-bound as assumed.

---

## Key Takeaways

- CPU-bound pool sizing is mostly about matching available compute resources, not maximizing thread count.
- A good starting point is roughly the number of available processors.
- Too many runnable CPU-bound threads usually reduce efficiency through scheduler and cache costs.
- Measure throughput and tail latency together when tuning.

Next post: [Thread Pool Sizing for IO Bound Workloads](/java/concurrency/thread-pool-sizing-for-io-bound-workloads/)
