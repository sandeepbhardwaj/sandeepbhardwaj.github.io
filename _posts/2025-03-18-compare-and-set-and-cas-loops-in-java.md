---
title: Compare And Set and CAS Loops in Java
date: 2025-03-18
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- compare-and-set
- cas
- atomics
- lock-free
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Compare And Set and CAS Loops in Java
seo_description: Learn compare-and-set in Java, how CAS loops work, and why
  they are the foundation of many atomic updates and non-blocking algorithms.
header:
  overlay_image: "/assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 7
  show_overlay_excerpt: false
---
Compare-and-set is the core move behind most atomic programming in Java.

It means:

- observe the current value
- compute the next value you want
- publish it only if the value is still what you observed

If another thread changed it first, you retry.

---

## Problem Statement

Suppose many threads are reserving stock from the same shared counter.

You need to guarantee:

- no reservation drives inventory below zero
- concurrent updates do not overwrite each other

A plain read followed by a plain write is broken.
A lock will work.
A CAS loop can also work when the state is small enough.

---

## Runnable Example

```java
import java.util.concurrent.atomic.AtomicInteger;

public class CasLoopDemo {

    public static void main(String[] args) {
        InventoryBucket bucket = new InventoryBucket(5);

        System.out.println(bucket.reserve(3));
        System.out.println(bucket.reserve(3));
        System.out.println(bucket.available());
    }

    static final class InventoryBucket {
        private final AtomicInteger available;

        InventoryBucket(int initialStock) {
            this.available = new AtomicInteger(initialStock);
        }

        boolean reserve(int quantity) {
            while (true) {
                int current = available.get();
                if (current < quantity) {
                    return false;
                }

                int updated = current - quantity;
                if (available.compareAndSet(current, updated)) {
                    return true;
                }
            }
        }

        int available() {
            return available.get();
        }
    }
}
```

That loop is the important pattern:

1. read current
2. compute new value
3. try CAS
4. retry if another thread won the race

---

## Why Loops Are Needed

One failed CAS does not mean the operation is impossible.
It usually means only that another thread changed the value first.

So the retry loop is normal.

The deeper idea is:

- conflicts are resolved by retrying the local operation
- no thread has to block on a normal application lock just to attempt the update

That is why CAS is so central to non-blocking algorithms.

---

## When CAS Is a Strong Fit

CAS loops are strong when:

- the state is small
- the update rule is local
- retry cost is acceptable
- contention is not so high that spinning becomes wasteful

Typical fits:

- counters
- bounded resource claims
- single-reference swaps
- one-variable state transitions

---

## When CAS Starts to Hurt

CAS loops become awkward when:

- several fields must change together
- the retry logic becomes long or expensive
- heavy contention causes many retries
- fairness matters more than raw concurrency

At that point, a lock or a different ownership design may produce simpler and more predictable code.

---

## Common Mistakes

- forgetting that the update function may run several times
- doing expensive work inside the retry loop
- assuming CAS removes all contention cost
- forcing multi-step business invariants into one atomic variable

CAS is powerful, but it is not a free pass around concurrency design.

---

## Mental Model for CAS Retries

Compare-and-set is optimistic coordination.
A thread says, in effect:

- I observed state X
- I computed the next state Y
- apply Y only if the state is still X

If another thread already changed the state, the update is rejected and the thread must try again.
That is why CAS code so often appears inside a loop.
The loop is not boilerplate.
It is the control flow that says, "re-read the latest truth and try again from fresh state."

This is important for readers because a CAS loop is not a lock-free magic wand.
Under heavy contention, many threads may spin, fail, re-read, and try again.
Correctness comes from retrying with fresh observations.
Performance depends on how often that retry path happens.

## Failure Modes Under Contention

CAS loops are attractive when conflicts are rare and updates are tiny.
They become less attractive when the protected logic grows or the contested variable becomes hot.
Typical failure shapes include:

- retry storms where many threads repeatedly lose the race
- expensive recomputation inside the loop body
- subtle starvation where one thread keeps missing while others succeed
- code that looks lock-free but burns a lot of CPU during overload

A strong review rule is to keep the loop body small and side-effect free.
Anything that allocates heavily, logs noisily, performs I/O, or triggers larger work should not sit inside the retry path.
If it does, contention amplifies the cost quickly.

## Testing and Review Notes

CAS code deserves tests that simulate losing the race, not just winning it.
Useful approaches include:

- repeated runs with many threads targeting the same variable
- assertions that the final state matches the expected total after heavy contention
- instrumentation or counters that show how many retries occurred
- tests that confirm interruption, timeout, or cancellation policies around the surrounding workflow

If the number of retries becomes operationally meaningful, measure it.
A design that is correct but spends most of its time redoing failed CAS attempts is often a sign that a different primitive would be simpler and faster.

## Second Example: CAS with Immutable Snapshot Update

CAS loops are not only for counters.
They are also useful when many threads try to replace a compact immutable value.

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

public class CasSnapshotDemo {

    public static void main(String[] args) {
        AuditBuffer buffer = new AuditBuffer();
        buffer.append("created");
        buffer.append("approved");
        System.out.println(buffer.snapshot());
    }

    static final class AuditBuffer {
        private final AtomicReference<List<String>> events =
                new AtomicReference<>(List.of());

        void append(String event) {
            while (true) {
                List<String> current = events.get();
                List<String> updated = new ArrayList<>(current);
                updated.add(event);

                if (events.compareAndSet(current, List.copyOf(updated))) {
                    return;
                }
            }
        }

        List<String> snapshot() {
            return events.get();
        }
    }
}
```

This shows the same CAS pattern in a very different scenario:

- read current immutable snapshot
- create a new snapshot
- publish only if nobody changed it first

## Key Takeaways

- Compare-and-set publishes a new value only if the observed old value is still current.
- CAS loops are the normal pattern for atomic conditional updates.
- They work best for small local state transitions.
- When the invariant grows beyond one small atomic boundary, simpler locking often wins.

Next post: [ABA Problem Explained for Java Engineers](/2025/03/19/aba-problem-explained-for-java-engineers/)
