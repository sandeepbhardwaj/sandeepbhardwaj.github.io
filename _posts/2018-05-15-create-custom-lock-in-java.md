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
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Create a Custom Lock in Java (wait/notify)
seo_description: Learn lock basics by implementing a simple custom lock using wait
  and notify.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
Building a custom lock is a good learning exercise because it forces you to think about ownership, waiting, wake-up policy, and failure cases.

It is usually a bad production default.

That tension is the right way to approach this topic:
understand the mechanics deeply, then use the JDK's proven lock implementations for real systems unless you truly need something specialized.

## Quick Decision Guide

| Goal | Build a custom lock? |
| --- | --- |
| learn how wait/notify-based mutual exclusion works | yes |
| ship a normal production mutex | no, use `ReentrantLock` or synchronized |
| need reentrancy, timeout, conditions, interruption policy | no, use JDK utilities |
| debugging lock ownership and usage patterns | maybe for experiments, not as a default runtime primitive |

The main lesson is not "I can outbuild the JDK."
It is "locking is trickier than it looks."

## Start With the Actual Contract

A lock needs more than "one thread goes in at a time."

At minimum, a usable mutex contract must answer:

- who owns the lock right now
- what a waiting thread does
- how wake-up works
- what happens if a non-owner unlocks
- whether interruption is respected

Even a tiny teaching lock has concurrency semantics, not just code.

## A Small Teaching Implementation

This version is intentionally simple, but it still does two important things:

- uses a `while` loop when waiting
- tracks the owning thread

```java
public final class SimpleLock {
    private boolean locked;
    private Thread owner;

    public synchronized void lock() throws InterruptedException {
        while (locked) {
            wait();
        }
        locked = true;
        owner = Thread.currentThread();
    }

    public synchronized void unlock() {
        if (Thread.currentThread() != owner) {
            throw new IllegalMonitorStateException("Current thread does not own the lock");
        }

        locked = false;
        owner = null;
        notifyAll();
    }
}
```

Usage:

```java
lock.lock();
try {
    // critical section
} finally {
    lock.unlock();
}
```

## Why `while` Matters More Than It Looks

Waiting threads must re-check the condition after waking.

That is why this is correct:

```java
while (locked) {
    wait();
}
```

and this is fragile:

```java
if (locked) {
    wait();
}
```

A thread can wake up and still not be allowed to proceed.
The guard condition has to be checked again.

That pattern is fundamental to Java monitor-based coordination, not just custom locks.

## Why Owner Tracking Matters

Without owner tracking, any thread can call `unlock()`.
That turns a programming mistake into corrupted concurrency semantics.

Owner checks give you two important properties:

- incorrect usage fails fast
- debugging becomes much less mysterious

Concurrency bugs are already expensive.
Silent misuse makes them worse.

## `notify()` vs `notifyAll()`

For a toy lock, `notify()` sometimes appears to work.
In teaching code, `notifyAll()` is often the safer choice because it avoids depending on subtle wake-up assumptions.

Why:

- more than one waiter may exist
- future evolution of the lock may add more waiting states
- accidental missed progress is harder to debug than extra wake-ups

`notifyAll()` is not always the most efficient primitive.
It is often the clearer one for correctness-first code.

## What This Lock Still Does Not Handle

Even this improved version is not close to a full production replacement for `ReentrantLock`.

It still lacks:

- reentrancy
- timed acquisition
- non-blocking `tryLock`
- condition variables
- rich diagnostics
- carefully tuned fairness behavior

Those are not decorative features.
They are the reason production lock implementations are difficult to reproduce correctly.

## Reentrancy Sketch

If the same thread should be able to acquire the lock multiple times, you need hold-count tracking:

```java
public final class ReentrantTeachingLock {
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
        if (Thread.currentThread() != owner) {
            throw new IllegalMonitorStateException();
        }

        holdCount--;
        if (holdCount == 0) {
            owner = null;
            notifyAll();
        }
    }
}
```

This is a useful teaching extension.
It is still nowhere near the full ergonomics and reliability of JDK locks.

## Production Default: Prefer `ReentrantLock`

If the real goal is "I need a lock in production," use the JDK implementation:

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public final class AccountService {
    private final Lock lock = new ReentrantLock();
    private int balance;

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

Use `ReentrantLock` when you need features like:

- reentrancy
- `tryLock`
- interruptible lock acquisition
- optional fairness

Use `ReadWriteLock` or `StampedLock` only when the access pattern truly justifies the extra complexity.

## Common Misuse Patterns

### Holding the lock across slow I/O

Even a correct lock becomes harmful if the critical section includes network calls, file I/O, or long external work.

### Forgetting `finally`

Lock acquisition without guaranteed release is an incident waiting to happen.

### Treating custom lock code as harmless infrastructure

A broken lock corrupts everything built on top of it.
This is not a good place for casual experimentation in production.

### Rebuilding standard concurrency tools for normal use cases

Most teams do not need a novel mutex.
They need a correctly used standard one.

## Testing a Teaching Lock

If you do build one for learning, test more than the happy path:

- two threads contending for the same lock
- unlock by non-owner thread
- interruption while waiting
- reentrant acquisition if supported
- stress loop to catch missed wake-ups

Concurrency code can look fine in a tiny demo and still fail badly under repetition.

## Key Takeaways

- Building a custom lock is valuable for learning, not as a default production strategy.
- `while` loops, owner tracking, and reliable unlock discipline are essential.
- Even a "simple" lock quickly grows into a real concurrency design problem.
- For real systems, prefer the JDK's lock implementations unless you have a specialized requirement you can justify and test thoroughly.
