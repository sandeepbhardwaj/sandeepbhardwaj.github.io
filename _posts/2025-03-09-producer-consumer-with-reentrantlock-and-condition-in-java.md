---
title: Producer Consumer with ReentrantLock and Condition in Java
date: 2025-03-09
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- producer-consumer
- reentrantlock
- condition
- bounded-buffer
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Producer Consumer with ReentrantLock and Condition in Java
seo_description: Build a production-style producer consumer solution in Java
  using ReentrantLock and Condition with separate full and empty wait queues.
header:
  overlay_image: "/assets/images/java-concurrency-module-06-explicit-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 6
  show_overlay_excerpt: false
---
Producer-consumer is one of the best examples for why explicit conditions exist.

It has:

- shared mutable state
- different waiter categories
- backpressure concerns
- correctness rules around wake-up and signal timing

That makes it a good production-style teaching example.

---

## Problem Statement

Suppose a log ingestion service accepts events from request threads and hands them to a smaller set of writer threads.

Requirements:

- producers must block when the in-memory buffer is full
- consumers must block when the buffer is empty
- the queue must stay bounded so memory usage is controlled

That is producer-consumer with backpressure.

---

## Runnable Example

```java
import java.util.ArrayDeque;
import java.util.Queue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ProducerConsumerWithConditionDemo {

    public static void main(String[] args) throws Exception {
        LogBuffer buffer = new LogBuffer(3);

        Thread producer = new Thread(() -> produce(buffer), "producer");
        Thread consumer = new Thread(() -> consume(buffer), "consumer");

        consumer.start();
        producer.start();

        producer.join();
        consumer.join();
    }

    static void produce(LogBuffer buffer) {
        for (int i = 1; i <= 5; i++) {
            try {
                buffer.put("event-" + i);
                System.out.println("Produced event-" + i);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
    }

    static void consume(LogBuffer buffer) {
        for (int i = 1; i <= 5; i++) {
            try {
                String event = buffer.take();
                System.out.println("Consumed " + event);
                TimeUnit.MILLISECONDS.sleep(150);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
    }

    static final class LogBuffer {
        private final Queue<String> queue = new ArrayDeque<>();
        private final int capacity;
        private final ReentrantLock lock = new ReentrantLock();
        private final Condition notFull = lock.newCondition();
        private final Condition notEmpty = lock.newCondition();

        LogBuffer(int capacity) {
            this.capacity = capacity;
        }

        void put(String value) throws InterruptedException {
            lock.lock();
            try {
                while (queue.size() == capacity) {
                    notFull.await();
                }
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
                String value = queue.remove();
                notFull.signal();
                return value;
            } finally {
                lock.unlock();
            }
        }
    }
}
```

This is not just a classroom queue.
It models bounded producer pressure and consumer wake-up correctly.

---

## Why This Design Was Added

The point is not “because `ReentrantLock` is more advanced.”

The point is that explicit conditions let the implementation model the real predicates directly:

- producers care about `queue.size() < capacity`
- consumers care about `!queue.isEmpty()`

That creates clearer code than one monitor with one implicit wait set.

---

## Production Notes

This design pattern appears in:

- async logging
- ingestion pipelines
- event dispatchers
- handoff buffers between network and storage layers

In real systems you would usually prefer a tested JDK queue implementation such as `ArrayBlockingQueue`.

But understanding the lower-level design is still valuable because it teaches the correctness rules behind those abstractions.

---

## Common Mistakes

- using `if` instead of `while`
- signaling before mutating the shared state
- not bounding capacity
- holding the lock while doing slow external work

Keep the lock scope around queue mutation only.
Do not write to disk or call remote services while holding it.

---

## Key Takeaways

- Producer-consumer is a natural fit for `ReentrantLock` plus multiple `Condition` queues.
- `notFull` and `notEmpty` model separate waiting predicates clearly.
- Bounded buffers are about both correctness and backpressure.
- In production, prefer standard concurrent queues unless you truly need custom coordination.

Next post: [ReadWriteLock Mental Model in Java](/2025/03/10/readwritelock-mental-model-in-java/)
