---
title: Race Conditions with Shared Mutable State in Java
date: 2025-02-04
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- race-condition
- shared-state
- mutable-state
- threads
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Race Conditions with Shared Mutable State in Java
seo_description: Learn what race conditions are in Java, why shared mutable state
  causes them, and how they appear in realistic backend code.
header:
  overlay_image: "/assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 4
  show_overlay_excerpt: false
---
Module 4 begins with the most common class of concurrency failure:
race conditions.

A race condition happens when program correctness depends on timing between overlapping operations and the code does not control that timing with the required guarantees.

In practice, shared mutable state is the main breeding ground.

---

## Problem Statement

Suppose multiple request threads update the same object:

- decrement inventory
- increment counters
- move an order through states

If those updates overlap without proper coordination, the final result may depend on execution timing rather than business rules.

That is a race condition.

---

## Naive Version

```java
class Inventory {
    private int available = 5;

    boolean reserve() {
        if (available > 0) {
            available--;
            return true;
        }
        return false;
    }
}
```

At first glance, the method looks fine.
Under concurrent access, two threads may both see `available > 0` before either writes back the new value.

Then the system oversells.

---

## Correct Mental Model

A race condition is not just “many threads exist.”
It is:

- shared state exists
- operations overlap
- program correctness depends on relative timing
- no sufficient coordination guarantee protects the state

That is why some multi-threaded code is fine and some is not.

Concurrency itself is not the bug.
Uncontrolled overlap on shared mutable state is.

---

## Runnable Example

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

public class RaceConditionDemo {

    public static void main(String[] args) throws Exception {
        Inventory inventory = new Inventory(10);
        ExecutorService executor = Executors.newFixedThreadPool(8);
        List<Callable<Boolean>> tasks = new ArrayList<>();

        for (int i = 0; i < 20; i++) {
            tasks.add(inventory::reserveOne);
        }

        List<Future<Boolean>> futures = executor.invokeAll(tasks);

        int successCount = 0;
        for (Future<Boolean> future : futures) {
            if (future.get()) {
                successCount++;
            }
        }

        executor.shutdown();
        System.out.println("Successful reservations = " + successCount);
        System.out.println("Remaining inventory = " + inventory.remaining());
    }

    static final class Inventory {
        private int available;

        Inventory(int available) {
            this.available = available;
        }

        boolean reserveOne() {
            if (available > 0) {
                sleep(20);
                available--;
                return true;
            }
            return false;
        }

        int remaining() {
            return available;
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

The tiny sleep widens the race window.
The bug is not the sleep.
The sleep only makes the existing lack of coordination easier to observe.

---

## Production-Style Example

Real race conditions often look like:

- two payment retries both mark an invoice paid
- two checkouts reserve the same stock
- one thread reads stale workflow state while another updates it
- counters or metrics drift under load

The system may work in staging and fail intermittently in production because the race depends on timing and pressure.

That is why concurrency bugs feel random when the root cause is actually structural.

---

## What Fixes a Race Condition

You fix race conditions by restoring a real guarantee.

Typical fixes:

- synchronize access to the shared state
- use atomics when the operation shape fits
- redesign to avoid shared mutable state
- confine state to one thread or one queue owner

The right fix depends on the state shape and invariant.

Not every race should be solved with the same primitive.

---

## Safe Version

```java
class SafeInventory {
    private int available = 5;

    synchronized boolean reserve() {
        if (available > 0) {
            available--;
            return true;
        }
        return false;
    }
}
```

This works because the check and update now live inside one protected boundary.

Later posts will show more specialized race patterns such as:

- check-then-act
- read-modify-write
- unsafe publication

This article is the broad starting point.

---

## Testing and Debugging Notes

Race conditions often hide because:

- they pass under light load
- logs change timing
- one machine never reproduces them

Useful tactics:

- repeat tests many times
- widen critical windows artificially in test code
- lower shared-state ambiguity wherever possible
- ask what exact guarantee protects every shared field

That last question is often the fastest route to the root cause.

---

## Decision Guide

If shared mutable state exists, ask:

1. who owns it?
2. what operations overlap on it?
3. what guarantee prevents timing-dependent outcomes?

If there is no clear answer, assume the design is race-prone.

---

## Key Takeaways

- race conditions happen when correctness depends on uncontrolled timing
- shared mutable state is the most common source
- the fix is always some form of stronger coordination or reduced sharing

---

## Next Post

[Check Then Act Race Condition in Java](/java/concurrency/check-then-act-race-condition-in-java/)
