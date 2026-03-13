---
title: Stress Testing and Repeated Run Strategy for Concurrency Bugs
date: 2025-05-29
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- testing
- stress-testing
- race-conditions
- reliability
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Stress Testing and Repeated Run Strategy for Concurrency Bugs
seo_description: Learn how repeated-run stress testing helps expose rare Java
  concurrency bugs that deterministic tests may not cover.
header:
  overlay_image: "/assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 12
  show_overlay_excerpt: false
---
Some concurrency bugs refuse to appear on command.

That does not mean they are not real.

It means they depend on:

- rare schedules
- unlucky timing
- unusual contention levels
- occasional visibility races

This is where repeated-run stress testing becomes valuable.

You are no longer forcing one exact interleaving.
You are exploring many possible ones and looking for failures that surface only occasionally.

---

## Problem Statement

A deterministic test can prove or disprove behavior around one chosen schedule.

But many production bugs arise from:

- many possible interleavings
- long tails of scheduling behavior
- load-sensitive timing windows

To explore those, you need tests that run:

- repeatedly
- under contention
- with useful failure checks

That is the role of stress testing.

---

## Mental Model

A stress test is valuable only if it has:

- meaningful concurrency
- strong assertions
- many iterations
- failure diagnostics

Simply running code in many threads is not enough.
You need a way to detect whether the run exposed:

- lost updates
- inconsistent state
- deadlock
- starvation
- unexpected latency or timeout behavior

---

## Runnable Example

```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;

public class StressLoopDemo {

    public static void main(String[] args) throws InterruptedException {
        for (int iteration = 1; iteration <= 10_000; iteration++) {
            AtomicInteger counter = new AtomicInteger();
            CountDownLatch start = new CountDownLatch(1);
            CountDownLatch done = new CountDownLatch(2);

            Runnable task = () -> {
                try {
                    start.await();
                    for (int i = 0; i < 1_000; i++) {
                        counter.incrementAndGet();
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    done.countDown();
                }
            };

            new Thread(task).start();
            new Thread(task).start();

            start.countDown();
            done.await();

            if (counter.get() != 2_000) {
                throw new IllegalStateException("Failure on iteration " + iteration);
            }
        }

        System.out.println("Stress loop completed");
    }
}
```

This example is simple, but it shows the pattern:

- repeat many times
- assert a real invariant
- fail immediately with iteration context

---

## What to Vary in Stress Tests

Useful variations include:

- thread count
- iteration count
- start alignment
- workload size
- machine load

If the bug appears only under higher contention or longer runs, a test fixed at one tiny configuration may never see it.

---

## Common Mistakes

### Repeating a weak test many times

If assertions are weak, repetition just repeats low-value evidence.

### Running stress tests without timeouts

A deadlock should produce a crisp failure, not a stuck CI job.

### Ignoring reproducibility data

Capture iteration numbers, seeds, thread names, and any useful context when failures occur.

### Treating stress tests as proof of correctness

They increase confidence.
They do not mathematically prove absence of bugs.

---

## Practical Suite Design

A good concurrency test suite often contains:

- deterministic schedule-forcing tests
- stress loops for rare failures
- focused micro-tests for invariants

Run the deterministic tests on every change.
Run the heavier stress suite:

- in CI with controlled limits
- locally during investigation
- periodically with larger iteration counts

This layered approach is usually more useful than one giant flaky test.

---

## Key Takeaways

- Stress testing is for rare schedules and timing-sensitive failures that deterministic tests may not cover.
- Repetition only helps if the test has meaningful concurrency and strong invariants.
- Iteration counts, timeouts, and failure diagnostics matter as much as raw thread count.
- Stress testing increases confidence; it does not replace reasoning or deterministic tests.

Next post: [Detecting Deadlocks with Thread Dumps in Java](/2025/05/30/detecting-deadlocks-with-thread-dumps-in-java/)
