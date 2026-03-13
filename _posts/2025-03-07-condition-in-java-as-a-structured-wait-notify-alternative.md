---
title: Condition in Java as a Structured wait notify Alternative
date: 2025-03-07
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- condition
- reentrantlock
- wait-notify
- coordination
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Condition in Java as a Structured wait notify Alternative
seo_description: Learn how Condition works in Java and why it is a cleaner,
  more structured alternative to low-level wait and notify.
header:
  overlay_image: "/assets/images/java-concurrency-module-06-explicit-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 6
  show_overlay_excerpt: false
---
Monitor-based `wait` and `notify` are powerful, but they become hard to maintain when one shared state has several reasons to wait.

`Condition` keeps the same guarded-wait idea while making the waiting queues explicit and tied to an explicit lock.

That is why it is often easier to scale as coordination logic grows.

---

## Problem Statement

Suppose a bounded buffer has these two different conditions:

- producers must wait when the buffer is full
- consumers must wait when the buffer is empty

With one object monitor, both groups often end up using the same implicit wait set and broad `notifyAll` behavior.

That works, but it gets noisy and inefficient.

---

## Basic Example

```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

class BoundedFlag {
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition ready = lock.newCondition();
    private boolean available;

    void awaitAvailable() throws InterruptedException {
        lock.lock();
        try {
            while (!available) {
                ready.await();
            }
        } finally {
            lock.unlock();
        }
    }

    void publish() {
        lock.lock();
        try {
            available = true;
            ready.signalAll();
        } finally {
            lock.unlock();
        }
    }
}
```

This should feel familiar if you understand guarded blocks.
The difference is that the wait queue is explicit instead of hidden inside a monitor.

---

## Runnable Example

```java
import java.util.ArrayDeque;
import java.util.Queue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ConditionDemo {

    public static void main(String[] args) throws Exception {
        SimpleQueue queue = new SimpleQueue();

        Thread consumer = new Thread(() -> {
            try {
                System.out.println("Consumed " + queue.take());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "consumer");

        Thread producer = new Thread(() -> {
            try {
                TimeUnit.MILLISECONDS.sleep(200);
                queue.put("event-1");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "producer");

        consumer.start();
        producer.start();
        consumer.join();
        producer.join();
    }

    static final class SimpleQueue {
        private final ReentrantLock lock = new ReentrantLock();
        private final Condition notEmpty = lock.newCondition();
        private final Queue<String> queue = new ArrayDeque<>();

        void put(String value) {
            lock.lock();
            try {
                queue.add(value);
                notEmpty.signal();
            } finally {
                lock.unlock();
            }
        }

        String take() throws InterruptedException {
            lock.lock();
            try {
                while (queue.isEmpty()) {
                    notEmpty.await();
                }
                return queue.remove();
            } finally {
                lock.unlock();
            }
        }
    }
}
```

The structure is clearer than raw monitor code because the lock and the condition role are explicit in the type system.

---

## Why `Condition` Was Added

It addresses real pain points in monitor coordination:

- one explicit lock can have several condition queues
- the wake-up intent is clearer
- code is easier to extend when waiting reasons multiply
- explicit locks already support timed and interruptible behavior naturally

This is not new functionality in principle.
It is better structure for more complex coordination.

---

## Key Rules

- call `await()` only while holding the associated lock
- recheck the condition in a loop
- call `signal()` or `signalAll()` while holding the same lock
- keep the condition predicate in terms of the shared state protected by that lock

Those are the same deep rules you already learned for `wait/notify`.

---

## Production-Style Guidance

`Condition` is a strong fit for:

- bounded queues
- resource pools with “available” and “drained” states
- state machines with several waiter categories
- reusable library code where monitor coordination would become opaque

If there is only one simple monitor boundary, `synchronized` plus guarded blocks may still be enough.

---

## Key Takeaways

- `Condition` is a structured waiting mechanism built on explicit locks.
- It is most valuable when one lock protects more than one logical waiting reason.
- The underlying guarded-wait rules still apply: hold the lock, wait in a loop, and signal after changing state.
- Use it when monitor-based wait/notify starts becoming hard to scale or reason about.

Next post: [Multiple Condition Queues with Condition in Java](/2025/03/08/multiple-condition-queues-with-condition-in-java/)
