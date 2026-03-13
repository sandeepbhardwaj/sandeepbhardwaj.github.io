---
title: Atomic Classes in Java Overview
date: 2025-03-16
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- atomics
- atomicinteger
- atomicreference
- cas
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Atomic Classes in Java Overview
seo_description: Learn what Java atomic classes solve, where they fit, and why
  they are powerful for single-variable concurrent state transitions.
header:
  overlay_image: "/assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 7
  show_overlay_excerpt: false
---
Atomic classes are the next major step after locks and `volatile`.

They exist for a specific kind of problem:

- one piece of shared state
- concurrent updates
- a need for atomic transition without a coarse lock

That is a powerful capability.
It is also much narrower than many developers first assume.

---

## Problem Statement

Suppose many threads need to update a shared value:

- a counter
- a generation number
- a running state flag
- a reference to the current immutable snapshot

Using a plain field is unsafe.
Using a lock may work, but can be heavier than needed if the state transition is small and local.

That is the niche atomic classes fill.

---

## What Atomic Classes Provide

The main atomic types let you do thread-safe operations on one variable at a time:

- read the latest value
- set a new value
- compare the current value and swap if it still matches
- increment or decrement safely
- update through a function

Under the hood, they rely on compare-and-set style coordination rather than a normal application-level lock.

---

## Runnable Example

```java
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

public class AtomicOverviewDemo {

    public static void main(String[] args) {
        TicketGate gate = new TicketGate();

        System.out.println(gate.nextTicket());
        System.out.println(gate.nextTicket());

        gate.close();
        System.out.println("Open for new tickets? " + gate.isOpen());
    }

    static final class TicketGate {
        private final AtomicLong nextTicket = new AtomicLong(1000);
        private final AtomicBoolean open = new AtomicBoolean(true);

        long nextTicket() {
            if (!open.get()) {
                throw new IllegalStateException("Gate is closed");
            }
            return nextTicket.getAndIncrement();
        }

        void close() {
            open.set(false);
        }

        boolean isOpen() {
            return open.get();
        }
    }
}
```

This is a good fit for atomics because each operation centers on one piece of state at a time.

---

## Where Atomics Fit Well

Good uses:

- counters
- sequence numbers
- state flags
- immutable snapshot references
- simple one-variable transitions such as open to closed

They are especially attractive when:

- critical sections are tiny
- contention exists
- locking a larger object would be unnecessary

---

## Where Atomics Do Not Fit

Atomics do not magically solve:

- multi-field invariants
- complex transaction-like updates
- larger critical sections
- coordination that depends on several objects changing together

If your rule sounds like "update A, B, and C together or not at all," a single atomic variable is usually not enough.

That is when locks, ownership redesign, or immutable replacement become better tools.

---

## Trade-Offs

Atomics can reduce coarse lock contention, but they introduce their own costs:

- retry logic under contention
- harder reasoning when state transitions become complex
- less natural code for compound invariants

So the design rule is simple:

- atomics are excellent for narrow shared state
- they are poor substitutes for full critical-section design

---

## Key Takeaways

- Atomic classes give you thread-safe operations on a single variable without using a normal lock around every update.
- They are strongest for counters, flags, IDs, and immutable snapshot references.
- They do not solve compound invariants across multiple fields.
- Use them where the state boundary is truly small and clear.

Next post: [AtomicInteger AtomicLong AtomicBoolean and AtomicReference in Java](/2025/03/17/atomicinteger-atomiclong-atomicboolean-and-atomicreference-in-java/)
