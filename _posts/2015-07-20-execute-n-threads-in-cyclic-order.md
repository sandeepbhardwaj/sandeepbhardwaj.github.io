---
title: Execute N Threads One After Another in Cyclic Order
date: '2015-07-20'
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- threads
- wait-notify
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Execute N Threads in Cyclic Order in Java
seo_description: Solve the classic concurrency problem where N threads print in strict
  round-robin order.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Execute N Threads in Cyclic Order

Interview-style concurrency problem: ensure threads print in strict round-robin sequence.

## Real-World Analogy

- sequential pipeline stages
- ordered log emission from worker group
- turn-based simulation/event processing

## Problem

Expected order:

`T1 -> T2 -> ... -> Tn -> T1 -> T2 -> ...`

## Java Example (wait/notify)

```java
class RoundRobinPrinter {
    private final int n;
    private int turn = 1;

    RoundRobinPrinter(int n) {
        this.n = n;
    }

    synchronized void print(int id) throws InterruptedException {
        while (turn != id) {
            wait();
        }

        System.out.println("Thread-" + id + " printing");
        turn = (turn % n) + 1;
        notifyAll();
    }
}
```

## Complete Runnable Example

The core class is useful, but most readers need a full runnable shape with bounded iterations.

```java
import java.util.concurrent.CountDownLatch;

public class CyclicOrderMain {
    public static void main(String[] args) throws InterruptedException {
        int n = 3;
        int rounds = 5;
        RoundRobinPrinter printer = new RoundRobinPrinter(n);
        CountDownLatch done = new CountDownLatch(n);

        for (int id = 1; id <= n; id++) {
            final int threadId = id;
            Thread t = new Thread(() -> {
                try {
                    for (int i = 0; i < rounds; i++) {
                        printer.print(threadId);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    done.countDown();
                }
            }, "T" + threadId);
            t.start();
        }

        done.await();
        System.out.println("All threads completed");
    }
}
```

This guarantees deterministic cyclic order for the configured number of rounds.

## Java 21+ Alternative

If strict thread order is not required, prefer task sequencing with structured/async orchestration instead of manual low-level signaling.

## JDK 11 and Java 17 Notes

The low-level `wait/notify` and `Condition` patterns shown here are unchanged in JDK 11 and Java 17. The main improvement in modern codebases is preferring higher-level concurrency primitives where possible.

## Production API Equivalent (`ReentrantLock` + `Condition`)

```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

class RoundRobinWithLock {
    private final int n;
    private int turn = 1;
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition condition = lock.newCondition();

    RoundRobinWithLock(int n) {
        this.n = n;
    }

    void print(int id) throws InterruptedException {
        lock.lock();
        try {
            while (turn != id) {
                condition.await();
            }
            System.out.println("Thread-" + id + " printing");
            turn = (turn % n) + 1;
            condition.signalAll();
        } finally {
            lock.unlock();
        }
    }
}
```

## Alternative: Semaphore Ring Pattern

For this specific problem, semaphores can be easier to reason about than `wait/notify`.

```java
import java.util.concurrent.Semaphore;

class RoundRobinWithSemaphore {
    private final Semaphore[] turns;

    RoundRobinWithSemaphore(int n) {
        this.turns = new Semaphore[n];
        for (int i = 0; i < n; i++) {
            turns[i] = new Semaphore(i == 0 ? 1 : 0); // thread-1 starts
        }
    }

    void print(int id) throws InterruptedException {
        int idx = id - 1;
        int next = (idx + 1) % turns.length;
        turns[idx].acquire();
        try {
            System.out.println("Thread-" + id + " printing");
        } finally {
            turns[next].release();
        }
    }
}
```

This model naturally encodes turn ownership and avoids broad `notifyAll`.

## Failure and Shutdown Considerations

1. Always restore interrupt status when catching `InterruptedException`.
2. Use bounded loops/termination flags; avoid infinite print loops in demos.
3. Prefer explicit shutdown signals in production pipelines.
4. Avoid heavy work inside the synchronized/locked section.

## Testing Strategy

- verify strict order with captured output sequence
- test with `n=1`, `n=2`, and higher values
- test interruption path for one worker
- run repeated iterations to catch rare ordering bugs

## Java 25 Note

Core synchronization concepts stay the same. Keep solutions simple and interruption-safe.

## Key Takeaways

- Use shared state + condition loops for deterministic ordering.
- Guard `wait()` with `while`.
- Handle interruption and shutdown paths explicitly.
- Choose semaphore ring when you want simpler turn handoff semantics.
