---
title: LongAdder and LongAccumulator Under Contention
date: 2025-03-20
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- longadder
- longaccumulator
- contention
- counters
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: LongAdder and LongAccumulator Under Contention
seo_description: Learn why LongAdder and LongAccumulator scale better than a
  single atomic counter under heavy contention and what trade-offs they bring.
header:
  overlay_image: "/assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 7
  show_overlay_excerpt: false
---
Atomic counters are simple and effective.

But under heavy write contention, a single shared atomic variable can become its own hotspot.

That is why Java provides `LongAdder` and `LongAccumulator`.

They trade a perfectly simple single-cell model for better scalability under load.

---

## Problem Statement

Imagine a service handling very high request volume.
Many threads update the same metrics:

- total requests
- total bytes sent
- highest observed latency

If all updates hit one shared atomic variable, contention can grow quickly.

This is the problem `LongAdder` and `LongAccumulator` address.

---

## Runnable Example

```java
import java.util.concurrent.atomic.LongAccumulator;
import java.util.concurrent.atomic.LongAdder;

public class LongAdderDemo {

    public static void main(String[] args) {
        Metrics metrics = new Metrics();

        metrics.recordRequest(1200, 45);
        metrics.recordRequest(900, 30);
        metrics.recordRequest(1800, 80);

        System.out.println("Requests = " + metrics.requestCount());
        System.out.println("Bytes sent = " + metrics.totalBytesSent());
        System.out.println("Max latency = " + metrics.maxLatencyMillis());
    }

    static final class Metrics {
        private final LongAdder requestCount = new LongAdder();
        private final LongAdder bytesSent = new LongAdder();
        private final LongAccumulator maxLatencyMillis =
                new LongAccumulator(Long::max, Long.MIN_VALUE);

        void recordRequest(long bytes, long latencyMillis) {
            requestCount.increment();
            bytesSent.add(bytes);
            maxLatencyMillis.accumulate(latencyMillis);
        }

        long requestCount() {
            return requestCount.sum();
        }

        long totalBytesSent() {
            return bytesSent.sum();
        }

        long maxLatencyMillis() {
            return maxLatencyMillis.get();
        }
    }
}
```

`LongAdder` is built for additive counters.
`LongAccumulator` generalizes the idea to a custom accumulation function such as max.

---

## Why They Scale Better

The core idea is to spread contention.

Instead of forcing every update through one hot atomic cell, these classes can distribute updates across internal cells and combine them when read.

That usually helps when:

- many threads write frequently
- exact per-update read visibility is less important than high update throughput

---

## Important Trade-Offs

These classes are not universal replacements for `AtomicLong`.

Limitations:

- `sum()` is not a linearizable snapshot of all concurrent updates
- they use more memory than one atomic field
- they are not suitable for sequence generation such as IDs
- they are not a fit when every read must observe one exact total at one instant

So the gain is not free.
It is a deliberate trade between update scalability and a simpler exact counter model.

---

## When to Choose Them

Choose `LongAdder` for:

- request counts
- hit totals
- event frequencies

Choose `LongAccumulator` for:

- max observed latency
- min observed free space
- custom associative accumulation rules

Do not choose either for:

- ticket IDs
- exact transactional balances
- invariants that require one single authoritative cell

---

## Mental Model

`LongAdder` and `LongAccumulator` trade exact single-location updates for better scaling under contention.
Instead of forcing every thread to fight over one hot memory location, they spread updates across internal cells and combine the result when you read it.

That is why they help in write-heavy metrics paths.
They reduce the cost of many threads incrementing the same logical counter at once.
The trade-off is that reading the total is not the same kind of single-cell snapshot you get from `AtomicLong`.
For statistics, request counts, and monitoring, that is usually fine.
For exact coordination logic, it may not be.

## Where Snapshot Expectations Go Wrong

A common mistake is to treat `LongAdder.sum()` as if it were an exact coordination primitive.
It is better to think of it as a scalable aggregation view.
During concurrent updates, the observed total is the current combined value across cells, not a transactional checkpoint around the rest of your workflow.

That makes `LongAdder` a strong fit for:

- metrics counters
- request totals
- cache hit and miss statistics
- best-effort operational dashboards

It is a poor fit for things like:

- generating unique sequence numbers
- protecting thresholds that require exact one-step decisions
- replacing proper admission control or rate-limit coordination

## Production Guidance

A practical rule is simple:

- if correctness depends on every read being exact, prefer `AtomicLong` or a lock around the larger invariant
- if you mostly care about update throughput and operational visibility, `LongAdder` is often the better tool

Reviewers should also look at how the value is consumed.
Using `LongAdder` for metrics export is healthy.
Using it to decide whether to admit the next payment, reserve the next seat, or enforce an exact concurrency limit is usually the wrong abstraction.

## Second Example: Exact Sequence Numbers Still Want AtomicLong

A second example helps because it shows the opposite case: a counter that must stay exact and ordered.
That is not a `LongAdder` problem.

```java
import java.util.concurrent.atomic.AtomicLong;

public class AtomicIdGeneratorDemo {

    public static void main(String[] args) {
        IdGenerator generator = new IdGenerator(1000);
        System.out.println(generator.nextId());
        System.out.println(generator.nextId());
    }

    static final class IdGenerator {
        private final AtomicLong next = new AtomicLong();

        IdGenerator(long start) {
            next.set(start);
        }

        long nextId() {
            return next.getAndIncrement();
        }
    }
}
```

This contrast is important:

- `LongAdder` for hot metrics
- `AtomicLong` for exact sequence generation

## Key Takeaways

- `LongAdder` and `LongAccumulator` are designed for high-contention update paths.
- They reduce hotspot pressure by spreading updates across internal cells.
- They are excellent for metrics and hot counters, but not for IDs or exact transactional totals.
- Choose them when update throughput matters more than a perfectly simple single-cell model.

Next post: [Counters Under Contention in Java](/2025/03/21/counters-under-contention-in-java/)
