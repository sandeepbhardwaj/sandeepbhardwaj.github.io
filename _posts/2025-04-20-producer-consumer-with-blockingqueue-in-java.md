---
title: Producer Consumer with BlockingQueue in Java
date: 2025-04-20
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- producer-consumer
- blockingqueue
- queue
- workers
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Producer Consumer with BlockingQueue in Java
seo_description: Learn how to build a producer-consumer design in Java with
  BlockingQueue and why it is usually better than hand-rolled wait-notify
  coordination.
header:
  overlay_image: "/assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 9
  show_overlay_excerpt: false
---
The producer-consumer pattern is one of the oldest concurrency patterns in software, and one of the easiest to overcomplicate when implemented manually.

If you already have a `BlockingQueue`, most of the hard low-level coordination is solved:

- producers can wait when full
- consumers can wait when empty
- handoff happens through a standard concurrent abstraction

That is why `BlockingQueue` is usually better than recreating the pattern with custom `wait()` and `notify()` code.

---

## Problem Statement

Suppose one set of threads creates work and another set processes it.

You want:

- safe handoff
- predictable waiting behavior
- decoupling between production and consumption
- the option of bounded buffering

This is exactly the shape of producer-consumer.

Examples:

- request threads enqueue email jobs
- readers parse lines into processing tasks
- collectors emit metrics events that workers batch and flush

The hardest part is not creating the threads.
It is creating the handoff boundary correctly.

---

## Naive Version

Teams often start with:

- one shared list
- one lock
- one condition flag

That quickly turns into low-level coordination complexity:

- wait loops
- missed notifications
- spurious wakeups
- shutdown edge cases

With a `BlockingQueue`, the pattern becomes much simpler because the queue already models the handoff contract.

---

## Runnable Example

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ProducerConsumerBlockingQueueDemo {

    public static void main(String[] args) throws Exception {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(4);
        ExecutorService executor = Executors.newFixedThreadPool(3);

        executor.submit(() -> producer(queue, "producer-a", 5));
        executor.submit(() -> consumer(queue, "consumer-a"));
        executor.submit(() -> consumer(queue, "consumer-b"));

        TimeUnit.SECONDS.sleep(2);
        executor.shutdownNow();
        executor.awaitTermination(5, TimeUnit.SECONDS);
    }

    static void producer(BlockingQueue<String> queue, String name, int count) {
        try {
            for (int i = 1; i <= count; i++) {
                String item = name + "-job-" + i;
                queue.put(item);
                System.out.println(name + " produced " + item);
                TimeUnit.MILLISECONDS.sleep(100);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    static void consumer(BlockingQueue<String> queue, String name) {
        try {
            while (!Thread.currentThread().isInterrupted()) {
                String item = queue.take();
                System.out.println(name + " consumed " + item);
                TimeUnit.MILLISECONDS.sleep(250);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

This pattern is much easier to reason about than manual condition coordination because the queue provides:

- thread-safe storage
- blocking semantics
- boundedness if you choose it

---

## Why This Pattern Works Well

A queue gives you a clean ownership handoff:

- producer owns item before enqueue
- queue owns it while waiting
- consumer owns it after dequeue

That clean transfer is one of the most important design benefits.

It reduces shared mutable overlap and makes the system easier to test and scale.

It also naturally decouples rate differences:

- producers need not process work
- consumers need not create it

---

## Design Choices That Matter

### Queue type

Choose based on workload:

- `ArrayBlockingQueue` for hard boundedness
- `LinkedBlockingQueue` for a more general blocking FIFO shape
- `PriorityBlockingQueue` when priority matters
- `DelayQueue` when release time matters

### Capacity

Capacity changes the failure mode:

- bounded: pressure becomes visible
- unbounded: pressure becomes backlog

### Shutdown strategy

How should consumers stop:

- interruption
- poison pill
- explicit lifecycle flag

This deserves separate design, not an afterthought.

---

## Common Mistakes

### Ignoring overload policy

The queue is not the whole design.
You still need to decide what happens when producers are faster than consumers for long periods.

### Putting huge objects into the queue

Large payloads amplify backlog cost quickly.

### Mixing unrelated work types in one queue

If fast and slow jobs share one queue, head-of-line blocking can dominate behavior.

### Treating `take()` loops as immortal

Consumers need shutdown logic.
Otherwise the application may hang during stop or redeploy.

---

## Testing and Debugging Notes

Useful tests:

- producer burst with slow consumers
- consumer slowdown under full queue
- interruption and shutdown behavior
- FIFO ordering if the queue type promises it

Useful metrics:

- queue depth
- enqueue wait time
- dequeue throughput
- item age in queue

These metrics often reveal whether the queue is a healthy decoupling boundary or a hidden latency amplifier.

---

## Decision Guide

Use producer-consumer with `BlockingQueue` when:

- work handoff should be decoupled
- the system benefits from queue-mediated waiting
- the queue type matches the workload semantics

Do not overuse it when:

- direct synchronous execution is simpler
- queueing only hides a throughput mismatch you should address more directly

---

## Key Takeaways

- `BlockingQueue` is the standard and usually best foundation for producer-consumer designs in Java.
- It replaces fragile low-level wait-notify coordination with a tested abstraction.
- Queue type, capacity, and shutdown policy are part of the design, not incidental details.
- A producer-consumer pipeline is only as healthy as its overload and lifecycle strategy.

Next post: [Bounded Queues and Backpressure in Java Systems](/java/concurrency/bounded-queues-and-backpressure-in-java-systems/)
