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
This post explains how a latch works internally using a simplified custom implementation.

## Real-World Use Cases

- wait until all startup checks complete
- block request processing until warm-up jobs finish
- coordinate integration test phases

## Simplified Implementation

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

## Missing Features in Simplified Version

The custom latch above demonstrates core mechanics, but it omits production needs:

- timed wait (`await(timeout, unit)`)
- state visibility/introspection (`getCount()`)
- interruption policy and cancellation orchestration
- robust diagnostics for stalled countdowns

That is why `java.util.concurrent.CountDownLatch` should be the default in real code.

## Java 8/11/17/21/25 Guidance

- Java 8+: Prefer built-in `java.util.concurrent.CountDownLatch` in production.
- JDK 11 / Java 17: Same API and usage model; no migration changes for latch semantics.
- Java 21+: Same API remains best choice even with virtual threads.
- Java 25: No migration pressure expected for latch semantics.

## Production API Equivalent (`CountDownLatch`)

```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class StartupChecks {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(3);
        ExecutorService pool = Executors.newFixedThreadPool(3);

        pool.submit(() -> runCheck("db", latch));
        pool.submit(() -> runCheck("cache", latch));
        pool.submit(() -> runCheck("queue", latch));

        latch.await(); // wait for all checks
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

## Timeout + Fail-Fast Startup Pattern

In services, waiting forever is risky. Prefer bounded await and explicit failure action.

```java
boolean ok = latch.await(10, TimeUnit.SECONDS);
if (!ok) {
    throw new IllegalStateException("startup checks did not finish in time");
}
```

If one check fails hard, record failure cause and still `countDown()` in `finally` to avoid deadlock.

## Happens-Before Guarantee (Why It Matters)

`CountDownLatch` provides a visibility guarantee:

- actions before `countDown()` in worker thread
- become visible after successful `await()` return in waiting thread

This makes it safe to publish warm-up results before releasing startup flow.

## Common Pitfalls

1. Forgetting `countDown()` on exception path.
2. Using latch for cyclic phases (it is one-shot).
3. Blocking on `await()` with no timeout in critical startup path.
4. Sharing one latch across unrelated workflows.

## Testing Strategy

- unit test normal completion path
- test exception path still decrements latch
- test timeout behavior deterministically
- test concurrent runs to catch missed `countDown()` branches

## Key Takeaways

- Always use `while` around `wait()`.
- Custom implementation is educational; built-in class is production-ready.
- Latch is one-time use; use `CyclicBarrier`/`Phaser` for repeated phases.
- Prefer timeout-based awaits for production safety.

---

            ## Problem 1: Use Create a Custom CountDownLatch in Java Without Hiding Concurrency Risk

            Problem description:
            Concurrency primitives become dangerous when ownership, visibility, and cancellation rules live only in the author's head. That is why bugs in this area often feel random even though the underlying rule was always missing.

            What we are solving actually:
            We are making the shared-state rule explicit so a reviewer can answer who owns the state, how threads coordinate, and what signal proves contention or visibility is under control.

            What we are doing actually:

            1. define the shared state or work queue involved
            2. name the exact synchronization or visibility rule protecting it
            3. observe contention, blocking, or lifecycle behavior under stress
            4. simplify the design if a snapshot or immutable handoff removes the race entirely

            ```mermaid
flowchart LR
    A[Shared state] --> B[Concurrency boundary]
    B --> C[Visibility or lock rule]
    C --> D[Observed contention / correctness]
```

            ## Debug Steps

            Debug steps:

            - take thread dumps while the system is slow, not after it recovers
            - verify every wait, lock, or signal path has a clear owner
            - test cancellation and shutdown behavior, not only happy-path throughput
            - reduce shared mutable state first before adding more synchronization
