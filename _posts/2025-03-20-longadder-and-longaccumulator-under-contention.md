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

## Key Takeaways

- `LongAdder` and `LongAccumulator` are designed for high-contention update paths.
- They reduce hotspot pressure by spreading updates across internal cells.
- They are excellent for metrics and hot counters, but not for IDs or exact transactional totals.
- Choose them when update throughput matters more than a perfectly simple single-cell model.

Next post: [Counters Under Contention in Java](/2025/03/21/counters-under-contention-in-java/)
