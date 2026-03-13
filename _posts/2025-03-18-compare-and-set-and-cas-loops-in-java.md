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

## Key Takeaways

- Compare-and-set publishes a new value only if the observed old value is still current.
- CAS loops are the normal pattern for atomic conditional updates.
- They work best for small local state transitions.
- When the invariant grows beyond one small atomic boundary, simpler locking often wins.

Next post: [ABA Problem Explained for Java Engineers](/2025/03/19/aba-problem-explained-for-java-engineers/)
