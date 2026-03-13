---
title: Counters Under Contention in Java
date: 2025-03-21
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- counters
- atomiclong
- longadder
- contention
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Counters Under Contention in Java
seo_description: Learn how to choose the right counter strategy in Java under
  contention, including AtomicLong, LongAdder, and lock-based designs.
header:
  overlay_image: "/assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 7
  show_overlay_excerpt: false
---
Counting looks trivial until many threads hit the same number.

Then the real questions appear:

- do you need exact read semantics or just high update throughput
- is this a sequence generator or a metric
- does one value stand alone or belong to a larger invariant

Those questions decide the correct counter design.

---

## Problem Statement

A production system often tracks several different kinds of counts:

- total requests served
- current in-flight requests
- next order number
- failed retry attempts

They are all "counters," but they do not all want the same concurrency primitive.

---

## Runnable Example

```java
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.LongAdder;

public class CounterChoicesDemo {

    public static void main(String[] args) {
        RequestMetrics metrics = new RequestMetrics();

        metrics.requestStarted();
        metrics.requestStarted();
        metrics.requestFinished();

        System.out.println("Total requests = " + metrics.totalRequests());
        System.out.println("In-flight = " + metrics.inFlightRequests());
        System.out.println("Next order id = " + metrics.nextOrderId());
    }

    static final class RequestMetrics {
        private final LongAdder totalRequests = new LongAdder();
        private final AtomicLong inFlightRequests = new AtomicLong();
        private final AtomicLong nextOrderId = new AtomicLong(1000);

        void requestStarted() {
            totalRequests.increment();
            inFlightRequests.incrementAndGet();
        }

        void requestFinished() {
            inFlightRequests.decrementAndGet();
        }

        long totalRequests() {
            return totalRequests.sum();
        }

        long inFlightRequests() {
            return inFlightRequests.get();
        }

        long nextOrderId() {
            return nextOrderId.getAndIncrement();
        }
    }
}
```

This one class uses two different counter strategies because the counters mean different things.

---

## How to Choose

Use `AtomicLong` when:

- you need one exact authoritative value
- reads must observe a precise current state
- you are generating sequence numbers or IDs

Use `LongAdder` when:

- many threads update the counter frequently
- the counter is for metrics or totals
- `sum()` semantics are good enough

Use a lock or a broader state owner when:

- the count is only one part of a multi-field invariant
- several values must move together
- the critical section contains more than a simple increment

---

## Common Wrong Assumptions

Three mistakes show up repeatedly:

- treating every counter as a metric counter
- using `LongAdder` for IDs
- trying to protect several related fields with separate independent counters

The moment a counter becomes part of a larger invariant, it stops being just a counter problem.

---

## Practical Production Guidance

Most application systems need a mix:

- `LongAdder` for hot telemetry
- `AtomicLong` for exact single-value state
- locks or ownership-based designs for compound bookkeeping

That mixture is normal.

Trying to use one universal counter primitive for every case usually produces either avoidable contention or broken semantics.

---

## Key Takeaways

- Counter design depends on semantics, not just on update frequency.
- `AtomicLong` is strong for exact current values and IDs.
- `LongAdder` is strong for hot metrics under contention.
- If the counter participates in a larger invariant, step back and solve the whole state problem instead.

Next post: [Atomic Field Updaters in Java](/2025/03/22/atomic-field-updaters-in-java/)
