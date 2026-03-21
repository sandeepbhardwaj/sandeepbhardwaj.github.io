---
title: Livelock in Java and How It Differs from Deadlock
date: 2025-02-12
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- livelock
- deadlock
- retry
- threads
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Livelock in Java and How It Differs from Deadlock
seo_description: Learn what livelock is in Java, how it differs from deadlock,
  and how over-polite retry logic can stop useful progress.
header:
  overlay_image: "/assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 4
  show_overlay_excerpt: false
---
Deadlock means threads are stuck and not moving.

Livelock is trickier: threads are moving, reacting, and retrying, but useful work still does not complete.

The system looks active while progress remains near zero.

---

## Problem Statement

Suppose two workers try to avoid contention politely.

Each worker checks whether the other is active, backs off, and retries.
If both keep doing that in sync, they can spend all their time yielding to each other.

That is livelock.

---

## Runnable Example

```java
import java.util.concurrent.TimeUnit;

public class LivelockDemo {

    public static void main(String[] args) throws Exception {
        SharedPath path = new SharedPath();

        Thread t1 = new Thread(() -> path.pass("worker-1"), "worker-1");
        Thread t2 = new Thread(() -> path.pass("worker-2"), "worker-2");

        t1.start();
        t2.start();

        TimeUnit.SECONDS.sleep(2);
        System.out.println("t1 state = " + t1.getState());
        System.out.println("t2 state = " + t2.getState());
    }

    static final class SharedPath {
        private volatile String preferred = "worker-1";

        void pass(String worker) {
            int attempts = 0;
            while (attempts < 20) {
                if (preferred.equals(worker)) {
                    preferred = other(worker);
                    attempts++;
                    sleep(50);
                    continue;
                }

                System.out.println(worker + " passed after attempts = " + attempts);
                return;
            }

            System.out.println(worker + " gave up after livelock-like retries");
        }

        String other(String worker) {
            return "worker-1".equals(worker) ? "worker-2" : "worker-1";
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

This is a teaching example, but the pattern is realistic: repeated conflict detection plus symmetric retry logic can destroy progress.

---

## Deadlock vs Livelock

Deadlock:

- threads block waiting
- state is frozen
- no one releases what others need

Livelock:

- threads keep changing state
- they keep reacting to each other
- useful work still does not complete

In operations terms:

- deadlock looks stuck
- livelock looks busy but ineffective

---

## Production-Style Scenarios

Livelock appears in systems like:

- aggressive retry loops with immediate conflict detection
- two services repeatedly cancelling and recreating the same work
- lock acquisition code that releases and retries too eagerly
- contention-avoidance logic that causes synchronized backoff patterns

A classic symptom is high activity with poor throughput:

- many retries
- many log lines
- little business progress

---

## Why It Happens

Livelock often comes from well-intentioned code:

- detect contention
- back off
- retry immediately

If all actors follow the same policy at roughly the same time, they can keep colliding forever.

This is common when systems lack jitter, fairness, or ownership.

---

## Better Design

Useful mitigation techniques include:

- random backoff instead of synchronized retry
- bounded retries with fallback
- one owner per resource or queue partition
- fairer coordination primitives when appropriate
- conflict resolution rules that break symmetry

The general goal is to stop all participants from making the same decision at the same time.

---

## Realistic Example

Two schedulers try to claim the same job row:

- scheduler A checks lock, sees contention, releases and retries
- scheduler B does the same
- both continue contending on every retry cycle

Without jitter or lease ownership rules, the system can burn compute while job completion stays poor.

---

## Testing and Review Notes

Livelock deserves tests that look for lack of useful progress, not only for blocked states.
That is a subtle but important distinction.
A livelocked system may show active threads, increasing retry counters, and lots of log noise while still completing almost no real work.

In review, ask whether the conflict-resolution strategy breaks symmetry.
If all contenders react the same way at the same time, livelock risk rises sharply.
Add jitter, bounded retries, or an ownership rule so that "be polite and retry" does not become a permanent traffic dance.

## Key Takeaways

- Livelock means the system is active but not making useful progress.
- It often comes from symmetric retry or conflict-avoidance logic.
- Deadlock blocks; livelock spins and reacts.
- Jitter, bounded retries, and clearer ownership rules are common fixes.

Next post: [Starvation in Java Concurrency](/java/concurrency/starvation-in-java-concurrency/)
