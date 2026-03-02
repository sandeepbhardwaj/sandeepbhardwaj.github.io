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
author_profile: true
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
---

# Create a Custom CountDownLatch in Java

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

## Key Takeaways

- Always use `while` around `wait()`.
- Custom implementation is educational; built-in class is production-ready.
- Latch is one-time use; use `CyclicBarrier`/`Phaser` for repeated phases.
