---
title: Benchmarking Concurrency Correctly with JMH
date: 2025-06-03
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- jmh
- benchmarking
- performance
- profiling
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Benchmarking Concurrency Correctly with JMH
seo_description: Learn how to benchmark concurrent Java code correctly with JMH
  and avoid misleading microbenchmark results.
header:
  overlay_image: "/assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 12
  show_overlay_excerpt: false
---
Concurrency benchmarking is easy to get wrong in ways that still produce impressive-looking numbers.

That is why JMH matters.

The framework exists to reduce benchmarking errors around:

- JVM warmup
- dead-code elimination
- measurement noise
- thread coordination

If you are evaluating concurrent code without those protections, your benchmark results may be more storytelling than evidence.

---

## Problem Statement

Teams often want to answer questions like:

- is `LongAdder` faster than `AtomicLong` here
- does this lock-free design beat a lock-based one
- what pool size gives best throughput

A naive benchmark can give the wrong answer because:

- the JIT optimizes away work
- warmup is inadequate
- state sharing is unrealistic
- threads are not actually contending the way production does

JMH helps structure benchmarks so those problems are less likely.

---

## Mental Model

JMH is not magic.
It is disciplined benchmarking infrastructure.

It gives you good defaults for:

- warmup
- measurement iterations
- forks
- state setup
- multi-thread benchmark execution

Your job is still to design a benchmark that represents the question honestly.

---

## Runnable Example

```java
import java.util.concurrent.atomic.AtomicLong;
import org.openjdk.jmh.annotations.Benchmark;
import org.openjdk.jmh.annotations.Scope;
import org.openjdk.jmh.annotations.State;

public class CounterBenchmark {

    @State(Scope.Group)
    public static class SharedState {
        AtomicLong counter = new AtomicLong();
    }

    @Benchmark
    public long increment(SharedState state) {
        return state.counter.incrementAndGet();
    }
}
```

This is only a skeleton, but it shows an important JMH idea:

- benchmark state and thread setup should be explicit

That is crucial for concurrency benchmarking.

---

## What Good Concurrency Benchmarks Need

Useful benchmark design usually includes:

- realistic shared versus per-thread state
- thread counts that reflect the question
- a real contention scenario if contention is the topic
- a clear baseline for comparison

If you benchmark a synchronization primitive without actual contention, you may learn very little about its production behavior.

---

## Common Mistakes

### Benchmarking with `System.nanoTime()` in ad hoc loops

This ignores many JVM and runtime effects.

### Forgetting warmup

Cold code and hot code behave differently.

### Measuring unrealistic workloads

A lock may look fine in a no-contention benchmark and collapse under real contention.

### Focusing on one throughput number without variance or context

Benchmark interpretation matters as much as benchmark execution.

---

## Practical Guidance

When benchmarking concurrent code, decide first:

1. Am I measuring throughput, latency, or both?
2. Is contention part of the scenario?
3. What state should be shared?
4. What is the sequential or simpler baseline?

Then design the JMH benchmark to reflect those answers.

The benchmark should model the concurrency question, not just the API call.

---

## Key Takeaways

- JMH exists because naive Java benchmarking is highly misleading, especially for concurrent code.
- Good concurrency benchmarks require explicit state sharing, realistic contention, and strong baselines.
- Warmup, measurement discipline, and benchmark design all matter.
- Benchmark numbers are useful only if the benchmark matches the concurrency question you actually care about.

Next post: [Virtual Threads in Java 21 for Backend Engineers](/2025/06/04/virtual-threads-in-java-21-for-backend-engineers/)
