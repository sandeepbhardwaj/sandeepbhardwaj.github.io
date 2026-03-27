---
title: Create a Custom CountDownLatch in Java
date: '2017-03-26'
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- countdownlatch
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Create a Custom CountDownLatch in Java
seo_description: Understand CountDownLatch internals by implementing a simplified
  custom version.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
Building a custom `CountDownLatch` is a good learning exercise because it forces you to reason about waiting, signaling, ownership of shared state, and why "simple" coordination code fails so easily.

It is usually a bad production default.

That tension is the point of the article:
learn the mechanics deeply, then prefer the JDK primitive unless you truly need a specialized variation.

## Quick Decision Guide

| Goal | Build your own latch? |
| --- | --- |
| understand how one-shot coordination works | yes, for learning |
| ship production startup or worker coordination | no, use `CountDownLatch` |
| support timeouts, diagnostics, or interruption policy reliably | no, use JDK utilities |
| experiment with custom semantics in a controlled sandbox | maybe |

The main lesson is not "I can outbuild `java.util.concurrent`."
It is "coordination primitives are easy to get almost right and surprisingly hard to get fully right."

## What a Latch Actually Solves

A latch solves one-shot coordination:

- one or more threads wait
- some other threads finish work
- once the count reaches zero, the waiting side proceeds

That is different from:

- a lock, which protects a critical section
- a semaphore, which limits concurrency
- a barrier, which coordinates repeated phases

If the problem repeats in cycles, latch is usually the wrong primitive.

## Minimal Educational Implementation

```java
public class CustomCountDownLatch {
    private int counter;

    public CustomCountDownLatch(int counter) {
        this.counter = counter;
    }

    public synchronized void await() throws InterruptedException {
        while (counter > 0) {
            wait();
        }
    }

    public synchronized void countDown() {
        if (counter > 0) {
            counter--;
            if (counter == 0) {
                notifyAll();
            }
        }
    }
}
```

This is a good teaching example because it shows the essential rule:
waiters sleep until a shared count reaches zero, and releasers publish progress by decrementing that count.

## Why `while` Around `wait()` Matters

This line is one of the most important in the whole article:

```java
while (counter > 0) {
    wait();
}
```

Use `while`, not `if`, because waiting threads must re-check the condition after waking.
That protects against:

- spurious wakeups
- missed assumptions about who changed the state
- future modifications that wake multiple threads

If you teach only one thing from custom concurrency primitives, teach that rule.

## What This Simplified Version Leaves Out

The example is useful, but it is intentionally incomplete.

Missing production-grade concerns include:

- timeout support
- interruption policy choices
- count inspection
- stronger diagnostics for stuck waits
- safe composition with cancellation and shutdown

That is exactly why the built-in primitive exists.

## The Production Equivalent

```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class StartupChecks {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(3);
        ExecutorService pool = Executors.newFixedThreadPool(3);

        pool.submit(() -> runCheck("db", latch));
        pool.submit(() -> runCheck("cache", latch));
        pool.submit(() -> runCheck("queue", latch));

        boolean ok = latch.await(10, TimeUnit.SECONDS);
        if (!ok) {
            throw new IllegalStateException("startup checks did not finish in time");
        }

        System.out.println("All checks complete. Start application.");
        pool.shutdown();
    }

    static void runCheck(String name, CountDownLatch latch) {
        try {
            // perform check
        } finally {
            latch.countDown();
        }
    }
}
```

This shows two production habits that matter:

- `countDown()` in `finally`
- bounded `await()` instead of waiting forever

## Where Custom Latches Usually Go Wrong

### Missing timeout support

Waiting forever is acceptable in toy code and dangerous in startup or request paths.

### No clear interruption policy

Real systems need to decide whether interruption:

- aborts the wait
- propagates outward
- triggers cleanup

The custom example leaves that policy mostly untouched.

### Reuse confusion

A latch is one-shot.
If the design needs repeated phases, use `CyclicBarrier` or `Phaser`.

### Hidden missed `countDown()`

This is the classic production bug.
One exception path forgets to decrement, and the waiting thread appears "randomly stuck."

## Memory Visibility Matters Too

`CountDownLatch` is useful not only because it blocks.
It also provides a happens-before relationship:

- work performed before `countDown()`
- becomes visible after another thread successfully returns from `await()`

That visibility guarantee is part of the value.
It means the primitive is coordinating both timing and memory effects.

## Testing Strategy

If you build a simplified latch for learning, test:

1. normal release after the count reaches zero
2. no early release while count is still positive
3. multiple waiting threads
4. exception paths that still decrement correctly

If those tests are painful to write, that pain is useful feedback:
you are looking at exactly why hand-rolled concurrency primitives are risky.

## Practical Rule

Use a custom latch only as an educational tool or for a deliberately specialized experiment.

For normal production coordination, prefer `java.util.concurrent.CountDownLatch` and spend your design energy on timeout policy, cancellation, and observability instead of reimplementing the primitive.

## Key Takeaways

- A latch is for one-shot coordination, not repeated phases.
- `while (condition) wait()` is a non-negotiable rule in wait/notify code.
- The built-in `CountDownLatch` is the right production default because it solves more than just blocking.
- The educational value of a custom latch is real, but so is the risk of getting concurrency semantics subtly wrong.
