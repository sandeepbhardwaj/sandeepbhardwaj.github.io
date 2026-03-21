---
title: Semaphore in Java Deep Dive
date: 2025-04-01
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- semaphore
- coordination
- throttling
- permits
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Semaphore in Java Deep Dive
seo_description: Learn how Semaphore works in Java for permit-based
  coordination, concurrency limiting, fairness, and bounded resource access.
header:
  overlay_image: "/assets/images/java-concurrency-module-08-coordination-utilities-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 8
  show_overlay_excerpt: false
---
`Semaphore` is the coordination primitive for permit-based access.

It is not primarily about protecting one critical section with ownership rules.
It is about allowing up to N concurrent acquisitions of some shared capacity.

That makes it valuable for:

- resource pools
- bounded concurrency
- admission control
- controlled access to scarce downstream capacity

---

## Problem Statement

Suppose a service can call an external API safely only a limited number of times in parallel.

If 200 request threads all hit that API at once, you may trigger:

- timeouts
- connection pool exhaustion
- downstream throttling
- cascading latency spikes

The system needs a coordination boundary that says:

- at most N callers may enter this region at the same time

That is the natural domain of `Semaphore`.

---

## Mental Model

A semaphore manages a number of permits.

Basic flow:

1. the semaphore starts with N permits
2. a thread calls `acquire()` to take one permit
3. if a permit is available, the thread proceeds
4. if not, it waits
5. when work finishes, the thread calls `release()`
6. another waiter may now proceed

This is not the same as a lock:

- a lock typically protects exclusive ownership
- a semaphore models bounded capacity

That difference matters because it shapes both the API and the use cases.

---

## Core API

Important methods:

- `new Semaphore(permits)`: non-fair semaphore
- `new Semaphore(permits, true)`: fair semaphore
- `acquire()`: wait indefinitely for a permit
- `tryAcquire()`: attempt without waiting
- `tryAcquire(timeout, unit)`: bounded wait
- `release()`: return a permit
- `availablePermits()`: inspect remaining permits

There are also bulk forms such as:

- `acquire(n)`
- `release(n)`

Those are useful when one task consumes more than one unit of shared capacity.

---

## Runnable Example

This example limits concurrent downstream calls to three at a time even if many client requests arrive together.

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

public class SemaphoreDemo {

    public static void main(String[] args) throws Exception {
        DownstreamClient client = new DownstreamClient(3);
        ExecutorService executor = Executors.newFixedThreadPool(8);
        List<Future<String>> futures = new ArrayList<>();

        for (int i = 1; i <= 8; i++) {
            final int requestId = i;
            futures.add(executor.submit(() -> client.fetch("request-" + requestId)));
        }

        for (Future<String> future : futures) {
            System.out.println(future.get());
        }

        executor.shutdown();
    }

    static final class DownstreamClient {
        private final Semaphore permits;

        DownstreamClient(int maxConcurrentCalls) {
            this.permits = new Semaphore(maxConcurrentCalls);
        }

        String fetch(String requestId) throws InterruptedException {
            permits.acquire();
            try {
                System.out.println("Calling downstream for " + requestId
                        + ", permits left=" + permits.availablePermits());
                TimeUnit.MILLISECONDS.sleep(300);
                return "response-for-" + requestId;
            } finally {
                permits.release();
            }
        }
    }
}
```

The invariant here is simple:

- at most three calls are in flight at once

This is not a shared-state mutation problem.
It is a bounded-access problem.

---

## Fair vs Non-Fair Semaphores

Like locks, semaphores can be fair or non-fair.

Non-fair semaphores:

- usually provide better throughput
- may allow barging by newly arriving threads

Fair semaphores:

- serve waiters in a more ordered way
- may reduce starvation risk
- often cost more in throughput

The same practical rule applies here as with fair locks:

- choose fairness only when the workload and latency behavior justify it

Do not enable it automatically because it sounds morally cleaner.

---

## Production-Style Use Cases

Strong fits include:

- limiting concurrent HTTP calls to one dependency
- protecting a finite number of device or socket slots
- allowing only a small number of expensive report jobs at once
- capping image transcoding or PDF rendering concurrency

Examples:

- only 20 concurrent invoice exports per node
- only 5 concurrent full-cache rebuilds
- only 50 active uploads through a memory-heavy path

These all represent capacity management rather than mutual exclusion.

---

## Common Mistakes

### Forgetting `release()` in `finally`

This is the semaphore version of forgetting to unlock.

If a permit is leaked, capacity shrinks over time until callers block forever or time out.

### Treating it like a lock

A semaphore does not communicate exclusive ownership the way a mutex does.

If your requirement is "only one thread may mutate this invariant at a time," a lock is usually the clearer tool.

### Using indefinite waits everywhere

In service code, `tryAcquire(timeout, unit)` is often safer than `acquire()` because it lets overload fail fast instead of silently piling up waiters.

### Confusing concurrency limiting with rate limiting

A semaphore naturally limits how many operations run at once.
It does not by itself guarantee "only X requests per second."

That distinction is important enough that the next semaphore post expands it separately.

---

## Testing and Debugging Notes

Good semaphore diagnostics include:

- current queueing behavior
- permit leaks
- time spent waiting to acquire
- paths that time out frequently

In tests, semaphores are useful for deliberately controlling concurrency:

- allow only one or two operations in
- block the next caller
- assert that overload handling behaves correctly

If a system appears stuck around a semaphore, investigate:

- missing `release()`
- too few initial permits
- permit acquisition on code paths that should not block
- timeouts being swallowed and retried badly

---

## Performance and Trade-Offs

Semaphores are powerful because they give you a direct way to bound concurrency.

But bounding concurrency is not automatically enough.

You still need to ask:

- what should happen when permits are exhausted
- wait, fail fast, queue elsewhere, or degrade gracefully

That policy question is often more important than the semaphore itself.

Semaphores control admission.
They do not decide overload strategy for you.

---

## Decision Guide

Use `Semaphore` when:

- the core concept is permits or slots
- several callers may proceed, but only up to a bounded number
- you need concurrency limiting rather than one-thread ownership

Do not use it when:

- the real problem is a shared invariant that needs exclusive mutation
- you need repeated round synchronization among peers
- you actually want task completion or future composition

Choose:

- a lock for exclusive critical sections
- `CountDownLatch` or barriers for group coordination
- `CompletableFuture` for async result flows

---

## Key Takeaways

- `Semaphore` is the permit-based tool for bounding concurrent access to scarce capacity.
- It is excellent for resource slots, downstream call throttling, and admission control.
- Always pair `acquire()` with `release()` in `finally`.
- It limits concurrency naturally, but by itself it does not implement precise time-based rate limiting.

Next post: [Binary Semaphore vs Counting Semaphore in Java](/java/concurrency/binary-semaphore-vs-counting-semaphore-in-java/)
