---
title: Create a Custom Lock in Java
date: '2018-05-15'
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- locks
author_profile: true
seo_title: Create a Custom Lock in Java (wait/notify)
seo_description: Learn lock basics by implementing a simple custom lock using wait
  and notify.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
toc: true
toc_label: In This Article
toc_icon: cog
---
This deep dive explains the problem model, concurrency contract, Java implementation, and real-world caveats you should know before using this pattern in production.

## Problem description:

We want to understand how a simple mutual-exclusion lock can be built using `wait()` and `notify`.

What we are solving actually:

We are solving thread ownership of a critical section.
The purpose is educational: to understand the mechanics behind locking before relying on the JDK implementations.

What we are doing actually:

1. Block a thread while the lock is owned.
2. Wake waiting threads when the owner releases the lock.
3. Add owner tracking to prevent invalid unlocks.

```mermaid
flowchart LR
    A[Thread calls lock] --> B{Lock free?}
    B -->|Yes| C[Acquire lock]
    B -->|No| D[wait()]
    C --> E[Critical section]
    E --> F[unlock()]
    F --> G[notify / notifyAll]
    G --> A
```

## Lock implementation

```java
public class Lock {

    private boolean isLocked = false;

    public synchronized void lock() throws InterruptedException {
        while (isLocked) {
            wait();
        }
        isLocked = true;
    }

    public synchronized void unlock() {
        isLocked = false;
        notify();
    }
}
```

## Usage

```java
lock.lock();
try {
    // critical section
} finally {
    lock.unlock();
}
```

## Improvement for production

The simple version does not track ownership. A safer version checks owner thread:

```java
private Thread owner;

public synchronized void lock() throws InterruptedException {
    while (isLocked) {
        wait();
    }
    isLocked = true;
    owner = Thread.currentThread();
}

public synchronized void unlock() {
    if (Thread.currentThread() != owner) {
        throw new IllegalMonitorStateException("Current thread does not own lock");
    }
    isLocked = false;
    owner = null;
    notify();
}
```

In real code, prefer `ReentrantLock` unless this is for learning.

## Why This Lock Is Still Incomplete

Even with owner tracking, this custom lock is still missing features expected in production:

- reentrancy (same thread acquiring lock multiple times)
- timed acquisition (`tryLock(timeout)`)
- interruptible acquisition policy
- condition queues (`Condition`) for coordinated waiting

Implementing these correctly is non-trivial, which is why JDK locks are preferred.

## Reentrant Behavior Sketch (Learning Only)

```java
private Thread owner;
private int holdCount;

public synchronized void lock() throws InterruptedException {
    Thread current = Thread.currentThread();
    while (owner != null && owner != current) {
        wait();
    }
    owner = current;
    holdCount++;
}

public synchronized void unlock() {
    if (Thread.currentThread() != owner) throw new IllegalMonitorStateException();
    holdCount--;
    if (holdCount == 0) {
        owner = null;
        notifyAll();
    }
}
```

This demonstrates reentrancy mechanics, but still lacks timeout/condition support.

## Production API Equivalent (`ReentrantLock`)

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class AccountService {
    private final Lock lock = new ReentrantLock(true); // fair lock
    private int balance = 0;

    public void deposit(int amount) {
        lock.lock();
        try {
            balance += amount;
        } finally {
            lock.unlock();
        }
    }
}
```

If you need separate read/write access, use `ReadWriteLock`. For optimistic reads on highly contended state, evaluate `StampedLock`.

## Common Pitfalls

1. Calling `unlock()` from non-owner thread.
2. Using `notify()` where multiple waiters need wake-up progression.
3. Holding lock during slow I/O.
4. Forgetting `finally` around unlock paths.

A lock implementation should optimize for correctness and debuggability first.

## Testing Strategy

- concurrent stress test for race conditions
- interruption tests while waiting on lock
- reentrancy tests if supported
- ownership violation tests (`unlock` by wrong thread)

## Debug steps:

- test unlock by a non-owner thread and confirm it fails
- inspect whether `notify()` should really be `notifyAll()` for the chosen design
- keep lock usage wrapped in `try/finally` so failures do not strand waiters
- prefer `ReentrantLock` in real code once the learning goal is satisfied

## Key Takeaways

- Correctness comes before throughput in concurrent code.
- Prefer proven JDK concurrency utilities in production over custom implementations.
- Always account for interruption, waiting conditions, and race windows.
- Build custom locks only for learning or highly specialized runtime behavior.
