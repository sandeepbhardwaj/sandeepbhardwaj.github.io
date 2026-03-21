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

## A Concrete Mental Model

These guarantees become easier to remember if you phrase them as promises under contention.

- obstruction-free: one thread can finish if others stop interfering
- lock-free: the system keeps making overall progress even if some thread keeps losing
- wait-free: every thread has a bounded path to completion

That wording matters because it moves the discussion away from marketing language like "no locks" and toward the actual user-visible property.
A queue can be lock-free and still let a particular unlucky thread starve for a long time.
A wait-free algorithm rules that out, but usually at much higher complexity cost.

## Why Progress Class Is Not the Whole Design

Engineers sometimes hear "lock-free" and assume it is automatically the most advanced or most scalable answer.
That is incomplete.
Progress guarantees describe one dimension of behavior.
They do not automatically answer:

- how much CPU the retries burn
- how readable the algorithm is
- how easy it is to prove correctness
- whether memory usage, fairness, or observability are acceptable

A lock-based design with short critical sections can beat a theoretically stronger non-blocking design in real services because the whole system is simpler to reason about.
That is why application engineering should start from end-to-end cost, not from the prestige of the progress label.

## Testing and Review Notes

When reviewing a custom concurrent structure, insist on precise language.
Ask the author to state which progress guarantee is actually provided and under what assumptions.
Then ask the more practical follow-up questions:

- what happens under heavy contention
- can some thread starve for a long time
- how will this be benchmarked against a simpler lock-based version
- who will maintain this code six months later

Most teams discover that the correct answer is not "implement wait-free from scratch," but "use the simplest primitive whose behavior we can explain and test clearly."

## Key Takeaways

- Obstruction-free, lock-free, and wait-free describe different progress guarantees.
- Lock-free means system progress; wait-free means bounded per-thread progress.
- Retry loops alone do not tell you which guarantee an algorithm provides.
- In application code, prefer the simplest correct primitive unless you truly need a specific progress property.

Next post: [Building a Non Blocking Stack or Queue in Java](/java/concurrency/building-a-non-blocking-stack-or-queue-in-java/)
