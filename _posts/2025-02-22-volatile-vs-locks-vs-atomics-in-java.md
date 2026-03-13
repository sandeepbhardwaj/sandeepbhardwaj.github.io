---
title: volatile vs Locks vs Atomics in Java
date: 2025-02-22
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- volatile
- locks
- atomics
- synchronization
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: volatile vs Locks vs Atomics in Java
seo_description: Learn when to use volatile, locks, or atomics in Java based on
  visibility, atomic state transitions, and multi-step invariants.
header:
  overlay_image: "/assets/images/java-concurrency-module-05-volatile-immutability-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 5
  show_overlay_excerpt: false
---
Most Java concurrency design choices in everyday backend code come down to three tool families:

- `volatile`
- atomics
- locks

The mistake is not failing to know these tools exist.
The mistake is treating them as interchangeable.

They solve different shapes of shared-state problems.

---

## Problem Statement

Suppose a service has all three of these needs:

- publish the current lifecycle status
- count requests accurately under concurrency
- reserve inventory without overselling

Those three tasks look related because they all involve “shared state.”

But they need different guarantees:

- the status field needs visibility
- the counter needs atomic state transitions
- the inventory reservation needs a protected multi-step invariant

That is why Java has more than one concurrency primitive.

---

## Why These Tools Exist Separately

Java did not add multiple primitives to make the API surface larger.

The primitives differ because real concurrency problems differ:

- some are simple publication problems
- some are one-variable atomic update problems
- some are compound correctness problems

If you choose a tool only because it looks lightweight or familiar, you usually get subtle bugs.

The right starting question is:

- what exact guarantee does this state need?

---

## `volatile`

Best for:

- simple visibility
- status flags
- immutable snapshot references

What it gives:

- visibility of the latest write
- ordering guarantees around that field

What it does not give:

- atomic compound updates
- mutual exclusion
- multi-field invariant protection

### Example

```java
class ServiceStateHolder {
    private volatile ServiceState state = ServiceState.STARTING;

    void markRunning() {
        state = ServiceState.RUNNING;
    }

    ServiceState currentState() {
        return state;
    }
}
```

This is a good fit because the field stands alone as the truth being published.

---

## Atomics

Best for:

- single-variable atomic updates
- compare-and-set transitions
- counters and simple state machines

Examples:

- `AtomicInteger`
- `AtomicLong`
- `AtomicBoolean`
- `AtomicReference`

What they are good at:

- one state cell changes atomically

What they are not ideal for:

- several fields that must stay consistent together
- large critical sections
- coordination logic spanning many dependent updates

### Example

```java
import java.util.concurrent.atomic.AtomicLong;

class RequestMetrics {
    private final AtomicLong requestCount = new AtomicLong();

    void recordRequest() {
        requestCount.incrementAndGet();
    }

    long requestCount() {
        return requestCount.get();
    }
}
```

This is a natural atomic use case because the whole invariant is one numeric update.

---

## Locks

Best for:

- compound critical sections
- check-then-act correctness
- multiple related fields
- guarded state transitions
- complex coordination

Examples:

- `synchronized`
- `ReentrantLock`

Locks are the right tool when the invariant is larger than one atomic value.

### Example

```java
class InventoryService {
    private int available = 10;

    synchronized boolean reserveOne() {
        if (available > 0) {
            available--;
            return true;
        }
        return false;
    }
}
```

Here the correctness depends on the check and update staying together.

---

## Runnable Comparison Example

```java
import java.util.concurrent.atomic.AtomicInteger;

public class ConcurrencyPrimitiveSelectionDemo {

    public static void main(String[] args) {
        ServiceModeHolder serviceModeHolder = new ServiceModeHolder();
        RequestCounter requestCounter = new RequestCounter();
        Inventory inventory = new Inventory(2);

        serviceModeHolder.markRunning();
        requestCounter.record();

        System.out.println("Service mode = " + serviceModeHolder.current());
        System.out.println("Request count = " + requestCounter.current());
        System.out.println("Reserve #1 = " + inventory.reserve());
        System.out.println("Reserve #2 = " + inventory.reserve());
        System.out.println("Reserve #3 = " + inventory.reserve());
    }

    enum ServiceMode {
        STARTING, RUNNING
    }

    static final class ServiceModeHolder {
        private volatile ServiceMode current = ServiceMode.STARTING;

        void markRunning() {
            current = ServiceMode.RUNNING;
        }

        ServiceMode current() {
            return current;
        }
    }

    static final class RequestCounter {
        private final AtomicInteger count = new AtomicInteger();

        void record() {
            count.incrementAndGet();
        }

        int current() {
            return count.get();
        }
    }

    static final class Inventory {
        private int available;

        Inventory(int available) {
            this.available = available;
        }

        synchronized boolean reserve() {
            if (available > 0) {
                available--;
                return true;
            }
            return false;
        }
    }
}
```

The code is intentionally simple, but it captures the real selection logic:

- `volatile` for simple published state
- atomics for one-cell atomic transitions
- locks for compound invariants

---

## Production-Style Examples

`volatile`:

- current service mode
- current config snapshot reference
- stop flag for one background worker

Atomics:

- per-endpoint request counters
- retry attempt count
- one-time feature toggle transition

Locks:

- inventory reservation
- account transfer
- shared queue plus associated bookkeeping
- mutable cache structure with several dependent fields

These are not interchangeable examples.
They reflect different invariant sizes.

---

## Common Mistakes

- using `volatile` because it looks simpler even when the invariant is compound
- using `AtomicInteger` for one field while several related fields remain unsafely updated beside it
- replacing a clear lock with many atomics and making reasoning harder
- choosing based on benchmark folklore instead of correctness needs

Simple code is not the same as short code.

---

## Decision Guide

Use `volatile` when the question is:

- “Can all threads see the latest published value?”

Use atomics when the question is:

- “Can one variable change atomically under contention?”

Use locks when the question is:

- “Can this whole sequence and all related fields stay correct together?”

That decision process is much more reliable than memorizing slogans.

---

## Key Takeaways

- `volatile` solves visibility.
- atomics solve single-variable atomic transitions.
- locks solve compound invariants and critical sections.
- Pick the primitive based on the real boundary of the state you must protect.

Next post: [Immutable Classes in Java and Why They Simplify Concurrency](/2025/02/23/immutable-classes-in-java-and-why-they-simplify-concurrency/)
