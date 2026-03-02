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

## Java 25 Note

Core synchronization concepts stay the same. Keep solutions simple and interruption-safe.

## Key Takeaways

- Use shared state + condition loops for deterministic ordering.
- Guard `wait()` with `while`.
- Handle interruption and shutdown paths explicitly.
