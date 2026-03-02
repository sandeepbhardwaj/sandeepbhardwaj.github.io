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

# Create a Custom Lock in Java

This deep dive explains the problem model, concurrency contract, Java implementation, and real-world caveats you should know before using this pattern in production.

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

## Key Takeaways

- Correctness comes before throughput in concurrent code.
- Prefer proven JDK concurrency utilities in production over custom implementations.
- Always account for interruption, waiting conditions, and race windows.
