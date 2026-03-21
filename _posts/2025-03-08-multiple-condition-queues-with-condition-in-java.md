---
title: Multiple Condition Queues with Condition in Java
date: 2025-03-08
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- condition
- reentrantlock
- coordination
- producer-consumer
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Multiple Condition Queues with Condition in Java
seo_description: Learn how multiple condition queues work in Java and why they
  make complex shared-state coordination cleaner than one monitor wait set.
header:
  overlay_image: "/assets/images/java-concurrency-module-06-explicit-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 6
  show_overlay_excerpt: false
---
One of the biggest practical advantages of `Condition` over monitor-based `wait/notify` is that one lock can have more than one wait queue.

That matters because real shared-state systems often have more than one reason to block.

---

## Problem Statement

A bounded buffer has at least two different waiting groups:

- producers wait for space
- consumers wait for items

If both groups share one monitor wait set, you often end up waking more threads than needed.

Multiple `Condition` objects let you separate those wait reasons cleanly.

---

## Runnable Example

```java
import java.util.ArrayDeque;
import java.util.Queue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class MultipleConditionQueuesDemo {

    public static void main(String[] args) throws Exception {
        BoundedQueue queue = new BoundedQueue(2);

        Thread consumer = new Thread(() -> consume(queue), "consumer");
        Thread producer = new Thread(() -> produce(queue), "producer");

        consumer.start();
        TimeUnit.MILLISECONDS.sleep(100);
        producer.start();

        consumer.join();
        producer.join();
    }

    static void produce(BoundedQueue queue) {
        try {
            queue.put("A");
            queue.put("B");
            queue.put("C");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    static void consume(BoundedQueue queue) {
        try {
            TimeUnit.MILLISECONDS.sleep(300);
            System.out.println("Consumed " + queue.take());
            System.out.println("Consumed " + queue.take());
            System.out.println("Consumed " + queue.take());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    static final class BoundedQueue {
        private final Queue<String> queue = new ArrayDeque<>();
        private final int capacity;
        private final ReentrantLock lock = new ReentrantLock();
        private final Condition notFull = lock.newCondition();
        private final Condition notEmpty = lock.newCondition();

        BoundedQueue(int capacity) {
            this.capacity = capacity;
        }

        void put(String item) throws InterruptedException {
            lock.lock();
            try {
                while (queue.size() == capacity) {
                    notFull.await();
                }
                queue.add(item);
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
                String item = queue.remove();
                notFull.signal();
                return item;
            } finally {
                lock.unlock();
            }
        }
    }
}
```

This is the core payoff:

- producers wait on `notFull`
- consumers wait on `notEmpty`

You no longer have one large mixed group of unrelated waiters.

---

## Why This Change Was Added

The low-level monitor model has one implicit wait set per monitor.

That makes simple coordination possible, but it becomes clumsy when:

- several waiter categories exist
- you want targeted signaling
- `notifyAll()` starts waking many irrelevant threads

Multiple condition queues improve both clarity and efficiency.

---

## Production-Style Scenarios

Useful fits:

- bounded pools with “resource available” and “shutdown complete”
- workflow engines with “new work” and “capacity restored”
- caches with “refresh done” and “space freed”

These systems naturally have distinct waiting predicates.

---

## Common Mistakes

- signaling the wrong condition
- using `if` instead of `while`
- updating state outside the lock
- assuming multiple condition queues eliminate the need to reason about predicates carefully

The condition object is not the predicate.
It is the waiting queue associated with a predicate on protected state.

---

## Why Targeted Signaling Matters

Targeted signaling is not just a micro-optimization.
It is a readability and correctness improvement.
When producers and consumers wait for different predicates, separate condition queues make the code tell the truth about the workflow.
A wakeup on `notEmpty` means something different from a wakeup on `notFull`, and the code becomes easier to reason about because those meanings are explicit.

This is one reason `Condition` scales better than one implicit monitor wait set as coordination gets richer.
The more distinct waiting reasons a design has, the more valuable clear queue separation becomes.

## Testing and Review Notes

Review each `Condition` against its predicate in plain language.
If the team cannot say, "threads wait here for space" or "threads wait here for data," the abstraction boundary is still muddy.
Tests should exercise both sides under contention so that wrong-condition signaling fails quickly rather than silently.

## Key Takeaways

- Multiple `Condition` queues let one lock support several different waiting reasons cleanly.
- This avoids the one-monitor, one-wait-set limitation of low-level wait/notify coordination.
- It improves both code clarity and wake-up precision.
- The correctness still depends on the protected state and the loop-based predicate check.

Next post: [Producer Consumer with ReentrantLock and Condition in Java](/java/concurrency/producer-consumer-with-reentrantlock-and-condition-in-java/)
