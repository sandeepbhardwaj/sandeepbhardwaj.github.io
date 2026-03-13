---
title: Lock Free vs Wait Free vs Obstruction Free Explained
date: 2025-03-24
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- lock-free
- wait-free
- obstruction-free
- progress-guarantees
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Lock Free vs Wait Free vs Obstruction Free Explained
seo_description: Learn the difference between lock-free, wait-free, and
  obstruction-free progress guarantees in Java concurrency and why the
  distinctions matter.
header:
  overlay_image: "/assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 7
  show_overlay_excerpt: false
---
These three terms describe progress guarantees.

They do not simply mean "fast" or "does not use a lock."

They answer a more precise question:

- what kind of progress can the algorithm guarantee when threads interfere with each other

That is why the distinctions matter.

---

## The Core Definitions

Obstruction-free means:

- a thread can complete if it eventually runs in isolation

Lock-free means:

- the system as a whole keeps making progress
- even if one thread starves, some thread will complete operations

Wait-free means:

- every individual thread completes in a bounded number of its own steps

This is the strongest guarantee and usually the hardest to achieve.

---

## Runnable Illustration

```java
import java.util.concurrent.atomic.AtomicInteger;

public class ProgressGuaranteeDemo {

    public static void main(String[] args) {
        RetryCounter counter = new RetryCounter();
        System.out.println(counter.increment());
        System.out.println(counter.increment());
    }

    static final class RetryCounter {
        private final AtomicInteger value = new AtomicInteger();

        int increment() {
            while (true) {
                int current = value.get();
                int updated = current + 1;
                if (value.compareAndSet(current, updated)) {
                    return updated;
                }
            }
        }
    }
}
```

This kind of retry loop is the basic shape many people associate with non-blocking algorithms.

The important conceptual point is:

- retry loops do not automatically mean wait-free
- a thread may keep losing races and retrying

So progress class is about guarantees, not about syntax.

---

## Why People Mix Them Up

The terms are easy to blur because all three often appear in discussions of:

- CAS loops
- atomics
- lock-free data structures

But their promises are different:

- obstruction-free is weakest
- lock-free is stronger at the system level
- wait-free is strongest at the per-thread level

Calling everything "lock-free" hides real trade-offs.

---

## Why Wait-Free Is Rare

Wait-free algorithms are attractive because no individual thread can starve forever.

But that guarantee is expensive.

Designing wait-free structures often means:

- more complex algorithms
- more metadata
- harder proofs
- higher implementation cost

That is why many practical concurrent libraries settle for lock-free rather than wait-free.

---

## Practical Guidance for Java Engineers

For most application code, the question is not:

- can I implement a wait-free structure here

The better question is:

- what progress guarantee does this code actually need

Usually the answer is one of these:

- built-in concurrent collections are enough
- a lock is simpler and good enough
- one atomic variable is sufficient

Formal progress classes matter most when building reusable concurrency primitives and high-performance data structures.

---

## Key Takeaways

- Obstruction-free, lock-free, and wait-free describe different progress guarantees.
- Lock-free means system progress; wait-free means bounded per-thread progress.
- Retry loops alone do not tell you which guarantee an algorithm provides.
- In application code, prefer the simplest correct primitive unless you truly need a specific progress property.

Next post: [Building a Non Blocking Stack or Queue in Java](/2025/03/25/building-a-non-blocking-stack-or-queue-in-java/)
