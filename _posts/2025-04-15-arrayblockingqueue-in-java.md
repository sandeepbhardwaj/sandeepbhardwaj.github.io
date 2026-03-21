---
title: ArrayBlockingQueue in Java
date: 2025-04-15
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- arrayblockingqueue
- blockingqueue
- queue
- backpressure
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: ArrayBlockingQueue in Java
seo_description: Learn how ArrayBlockingQueue works in Java, including fixed
  capacity, fairness, predictable memory usage, and bounded producer-consumer
  workflows.
header:
  overlay_image: "/assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 9
  show_overlay_excerpt: false
---
`ArrayBlockingQueue` is the most explicit bounded queue in the core JDK.

Its design communicates something important immediately:

- capacity is fixed up front

That alone makes it one of the most operationally honest queue choices in backend systems.

If the system can only safely absorb so much queued work, `ArrayBlockingQueue` lets you encode that limit directly instead of pretending memory is infinite.

---

## Problem Statement

Suppose producers can create work faster than consumers finish it.

Without a bound, several bad things can happen:

- memory usage keeps growing
- queued latency keeps rising
- the service appears responsive until backlog turns into an outage

Sometimes the right answer is not:

- "buffer more"

It is:

- "admit less and surface pressure sooner"

That is exactly where a bounded queue like `ArrayBlockingQueue` fits.

---

## Mental Model

`ArrayBlockingQueue` is:

- bounded
- FIFO
- array-backed
- blocking

This gives it several practical properties:

- predictable memory usage relative to capacity
- clear backpressure behavior when full
- good fit for fixed-capacity pipelines

You choose the maximum queue size at construction time.
After that, the queue will not silently expand to absorb overload.

That is usually a feature, not a limitation.

---

## Core Characteristics

Important traits:

- fixed capacity
- optional fairness mode
- blocking `put` and `take`
- timed `offer` and `poll`

The fairness option affects how waiting threads are serviced.

Fair mode can reduce starvation risk, but may lower throughput.
As with fair locks and semaphores, fairness should be chosen deliberately, not because it sounds universally better.

---

## Runnable Example

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;

public class ArrayBlockingQueueDemo {

    public static void main(String[] args) throws Exception {
        ArrayBlockingQueue<String> queue = new ArrayBlockingQueue<>(2);

        Thread producer = new Thread(() -> {
            try {
                enqueue(queue, "task-1");
                enqueue(queue, "task-2");
                enqueue(queue, "task-3");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "producer");

        Thread consumer = new Thread(() -> {
            try {
                TimeUnit.MILLISECONDS.sleep(300);
                System.out.println("Consumed " + queue.take());
                TimeUnit.MILLISECONDS.sleep(300);
                System.out.println("Consumed " + queue.take());
                TimeUnit.MILLISECONDS.sleep(300);
                System.out.println("Consumed " + queue.take());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "consumer");

        producer.start();
        consumer.start();

        producer.join();
        consumer.join();
    }

    static void enqueue(ArrayBlockingQueue<String> queue, String item) throws InterruptedException {
        System.out.println("Producing " + item);
        queue.put(item);
        System.out.println("Queued " + item + ", size=" + queue.size());
    }
}
```

The important operational behavior is visible:

- the producer cannot outrun the queue indefinitely
- capacity becomes an explicit control boundary

---

## Where It Fits Well

Strong fits:

- bounded producer-consumer pipelines
- work queues with known capacity budgets
- systems where memory predictability matters
- handoff points where overload should be felt early

Examples:

- file-processing pipeline with limited worker throughput
- request offload queue for expensive report generation
- audit batcher that should reject or delay beyond a safe queue size

In each case, the system benefits from saying:

- this queue may hold at most N items

---

## Trade-Offs Against Other Queue Types

Compared with `LinkedBlockingQueue`:

- `ArrayBlockingQueue` has fixed capacity and more predictable memory shape
- but it cannot grow beyond that capacity even if a temporary burst might have been acceptable

Compared with `ConcurrentLinkedQueue`:

- it supports blocking and backpressure
- but it is not the right choice if you want non-blocking unbounded buffering

Compared with `SynchronousQueue`:

- it allows queued buffering
- whereas `SynchronousQueue` is direct handoff only

This is why queue choice is really workload and failure-mode choice.

---

## Common Mistakes

### Picking a random capacity

Capacity should reflect:

- memory budget
- worker throughput
- acceptable queueing latency

An arbitrary number usually means the overload policy has not really been thought through.

### Blocking forever without a policy

`put()` is simple, but in service code you often want:

- timed `offer`
- rejection
- degradation

not indefinite waiting.

### Treating queue size as harmless

Even a bounded queue introduces latency as it fills.

Being bounded prevents unbounded memory growth, but it does not make large backlog healthy.

---

## Testing and Debugging Notes

Useful validations:

- producers block or time out as expected when capacity is full
- consumers drain in FIFO order
- shutdown and interruption behavior are clean

Important metrics:

- queue depth
- enqueue wait time
- dequeue latency
- rejection count if timed `offer` is used

These metrics make queue pressure visible before it becomes an outage.

---

## Decision Guide

Use `ArrayBlockingQueue` when:

- fixed capacity is a feature
- predictable memory shape matters
- the system should apply backpressure explicitly

Do not use it when:

- the workload needs ordered priority rather than FIFO
- delayed availability is part of the semantics
- zero-capacity direct handoff is the better model

---

## Key Takeaways

- `ArrayBlockingQueue` is the standard fixed-capacity blocking FIFO queue in the JDK.
- Its biggest advantage is explicit boundedness and predictable memory behavior.
- Fairness is optional and should be chosen only when the workload needs it.
- Capacity is part of your overload design, not just a constructor argument.

Next post: [LinkedBlockingQueue in Java](/java/concurrency/linkedblockingqueue-in-java/)
