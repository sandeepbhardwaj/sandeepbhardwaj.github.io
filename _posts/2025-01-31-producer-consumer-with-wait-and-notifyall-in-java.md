---
title: Producer Consumer with wait and notifyAll in Java
date: 2025-01-31
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- producer-consumer
- wait
- notifyall
- monitor
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Producer Consumer with wait and notifyAll in Java
seo_description: Learn the producer-consumer pattern in Java using wait and notifyAll
  with realistic examples, trade-offs, and common correctness pitfalls.
header:
  overlay_image: "/assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 3
  show_overlay_excerpt: false
---
Producer-consumer is one of the most useful patterns for understanding monitor-based coordination.

It forces you to handle:

- shared state
- waiting conditions
- wakeups
- bounded capacity
- interruption

That makes it a strong learning example and a good bridge to higher-level queue abstractions later.

---

## Problem Statement

Suppose one set of threads produces jobs and another set consumes them.

Requirements:

- consumers should wait when the queue is empty
- producers should wait when the queue is full
- access to the queue must remain correct under concurrency

This is the classic producer-consumer problem.

---

## Why This Pattern Matters

Producer-consumer appears everywhere in backend systems:

- request intake -> worker processing
- event ingestion -> batch persistence
- log generation -> shipping pipeline
- file upload -> virus scan or transform worker

So even though we will later prefer `BlockingQueue` in many production cases, understanding the lower-level version is still valuable.

---

## Broken Intuition

A naive design often looks like:

- producer adds items whenever it wants
- consumer removes items whenever it wants

Without coordination, you get:

- removing from an empty queue
- overfilling a bounded buffer
- race conditions around queue state

`wait` and `notifyAll` let us express the missing conditions directly.

---

## Runnable Example

```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.TimeUnit;

public class ProducerConsumerWaitNotifyDemo {

    public static void main(String[] args) throws Exception {
        BoundedBuffer<String> buffer = new BoundedBuffer<>(3);

        Thread producer = new Thread(() -> {
            for (int i = 1; i <= 6; i++) {
                buffer.put("job-" + i);
                sleep(250);
            }
        }, "producer");

        Thread consumer = new Thread(() -> {
            for (int i = 1; i <= 6; i++) {
                String job = buffer.take();
                System.out.println("Processed " + job + " on " + Thread.currentThread().getName());
                sleep(500);
            }
        }, "consumer");

        producer.start();
        consumer.start();

        producer.join();
        consumer.join();
    }

    static final class BoundedBuffer<T> {
        private final Queue<T> queue = new LinkedList<>();
        private final int capacity;

        BoundedBuffer(int capacity) {
            this.capacity = capacity;
        }

        synchronized void put(T item) {
            while (queue.size() == capacity) {
                try {
                    wait();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }

            queue.add(item);
            System.out.println("Produced " + item + ", size=" + queue.size());
            notifyAll();
        }

        synchronized T take() {
            while (queue.isEmpty()) {
                try {
                    wait();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return null;
                }
            }

            T item = queue.remove();
            System.out.println("Consumed " + item + ", size=" + queue.size());
            notifyAll();
            return item;
        }
    }

    static void sleep(long millis) {
        try {
            TimeUnit.MILLISECONDS.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }
}
```

This example is intentionally simple but already production-shaped in one important sense:
the buffer has a bounded capacity, so backpressure is part of the design.

---

## Why `notifyAll()` Here Is Safer

This example has two wait conditions on the same monitor:

- producers wait for “not full”
- consumers wait for “not empty”

If you use `notify()` carelessly, you may wake a thread that still cannot proceed.

`notifyAll()` is often safer in this kind of mixed-condition monitor because:

- all waiters wake
- each re-checks its own condition
- only the eligible threads continue

Yes, this can cause extra wakeups.
Correctness comes first.

---

## Production-Style Example

Imagine a file-ingestion service:

- upload threads produce scan jobs
- scan workers consume jobs
- memory must stay bounded

A bounded producer-consumer buffer expresses the real system pressure:

- if consumers fall behind, producers should not create unbounded in-memory backlog

That is why bounded capacity is not only a concurrency detail.
It is a system-stability decision.

---

## Failure Modes

Common mistakes:

- using `if` instead of `while`
- calling `notify()` where `notifyAll()` is safer
- forgetting interruption policy
- letting producers or consumers return silently on interruption without higher-level coordination

Another subtle issue:

- doing expensive processing while still holding the buffer monitor

The buffer lock should protect queue state transitions, not the full downstream job work.

---

## Why We Still Learn This Even Though BlockingQueue Exists

Because this pattern teaches the core ideas underneath many higher-level tools:

- condition waiting
- wakeup re-checking
- bounded capacity
- ownership of shared state

Later, when we move to `BlockingQueue`, you should see it as a safer higher-level solution to the same problem class, not as a magical unrelated API.

---

## Testing and Debugging Notes

When reviewing a monitor-based producer-consumer implementation, ask:

1. what are the wait conditions?
2. are both guarded by loops?
3. is capacity bounded?
4. is queue mutation protected by one monitor?
5. does real job processing happen outside the critical section?

These questions catch most correctness and throughput mistakes.

---

## Decision Guide

Use low-level wait/notify producer-consumer code when:

- you are learning monitor coordination
- the state and behavior are tightly local

Prefer `BlockingQueue` later when:

- you want clearer, safer, and more maintainable queue coordination

The pattern remains worth understanding either way.

---

## Key Takeaways

- producer-consumer is a foundational coordination pattern
- `wait`/`notifyAll` can implement it correctly when guarded carefully
- bounded capacity is a correctness and system-stability decision
- `notifyAll()` is often safer when multiple wait conditions share the same monitor

---

## Next Post

[Common Bugs with wait and notify in Java](/java/concurrency/common-bugs-with-wait-and-notify-in-java/)
