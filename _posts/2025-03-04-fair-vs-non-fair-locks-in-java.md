---
title: Fair vs Non Fair Locks in Java
date: 2025-03-04
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- locks
- fairness
- reentrantlock
- starvation
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Fair vs Non Fair Locks in Java
seo_description: Learn the difference between fair and non-fair locks in Java
  and how the choice affects throughput, latency, and starvation risk.
header:
  overlay_image: "/assets/images/java-concurrency-module-06-explicit-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 6
  show_overlay_excerpt: false
---
Fairness sounds like an obvious good, but in locking it comes with real cost.

Java lets you choose whether a `ReentrantLock` should prefer first-waiting threads or allow opportunistic acquisition by newly arriving threads.

That choice can change:

- throughput
- tail latency
- starvation risk
- scheduling predictability

So fairness is not a moral preference.
It is a workload trade-off.

---

## Problem Statement

Suppose many threads compete for one lock protecting a hot resource.

If the lock is non-fair, a newly arriving thread may “barge” ahead of older waiters.

That can improve throughput.
But if a few unlucky threads keep losing the race, long waits and starvation become more likely.

A fair lock tries to reduce that.

---

## Non-Fair Lock

The default `ReentrantLock` is non-fair.

That means:

- a thread that arrives at the right moment may acquire the lock immediately
- an older waiting thread may not always be the next winner

This often improves throughput because the handoff is less strict and the scheduler can make opportunistic progress.

That is why non-fair is the default.

---

## Fair Lock

```java
import java.util.concurrent.locks.ReentrantLock;

ReentrantLock fairLock = new ReentrantLock(true);
```

A fair lock tries to grant access in arrival order.

That can reduce starvation risk and improve predictability for waiting threads.

But strict ordering usually costs throughput under contention.

---

## Why the Trade-Off Exists

Fairness often means:

- more orderly handoff
- less barging by late-arriving threads
- better predictability under contention

But it also often means:

- more scheduling overhead
- less opportunistic progress
- lower aggregate throughput

So the correct choice depends on workload goals, not ideology.

---

## Runnable Example

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class FairLockDemo {

    public static void main(String[] args) throws Exception {
        ReentrantLock lock = new ReentrantLock(true);

        for (int i = 1; i <= 4; i++) {
            String workerName = "worker-" + i;
            Thread thread = new Thread(() -> runTask(lock, workerName), workerName);
            thread.start();
            TimeUnit.MILLISECONDS.sleep(30);
        }
    }

    static void runTask(ReentrantLock lock, String workerName) {
        lock.lock();
        try {
            System.out.println(workerName + " acquired lock");
            sleep(100);
        } finally {
            lock.unlock();
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

This demo only illustrates the policy shape.
Real fairness decisions should come from profiling and latency behavior, not from a toy program.

---

## Production-Style Scenarios

Fair locks can help when:

- starvation has actually been observed
- long waits for specific task classes are unacceptable
- you care more about predictable access than raw throughput

Non-fair locks usually remain better when:

- throughput dominates
- contention is moderate
- starvation is not a real observed problem

The real question is:

- do you need fairness enough to pay for it?

---

## Common Mistakes

- enabling fairness because it sounds more correct
- ignoring latency distribution and looking only at average throughput
- trying to solve application-level prioritization problems only with fair locking
- expecting fair locks to fix poor executor design or oversized critical sections

Fairness is one scheduling lever.
It is not a complete workload-management strategy.

---

## Decision Guide

Prefer non-fair locking when:

- throughput is the main goal
- starvation is not observed
- you want the default and usually best general-purpose behavior

Consider fair locking when:

- some threads are waiting too long in practice
- predictability matters more than peak throughput
- you have measured that the fairness cost is acceptable

Use data, not instinct.

---

## Key Takeaways

- Fair locks reduce starvation risk by preferring older waiters.
- Non-fair locks usually deliver better throughput.
- The right choice depends on observed workload behavior, especially contention and tail latency.
- Enable fairness when starvation or unacceptable waiting is a real problem, not by default.

Next post: [tryLock and Timed Lock Acquisition in Java](/java/concurrency/trylock-and-timed-lock-acquisition-in-java/)
