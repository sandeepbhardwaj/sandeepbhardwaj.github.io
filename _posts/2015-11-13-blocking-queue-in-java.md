---
title: BlockingQueue in Java
date: '2015-11-13'
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- multithreading
- blockingqueue
author_profile: true
seo_title: BlockingQueue in Java with Producer Consumer Example
seo_description: Learn how Java BlockingQueue works and how to build producer-consumer
  workflows safely.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
toc: true
toc_label: In This Article
toc_icon: cog
---
`BlockingQueue` is a thread-safe queue from `java.util.concurrent` used heavily in producer-consumer systems.

## Real-World Use Cases

- background job ingestion
- logging/event pipelines
- async task buffering between services
- email/notification dispatch workers

## Why It Matters

`BlockingQueue` automatically handles:

- waiting when queue is empty (`take()`)
- waiting when queue is full (`put()`)

This removes manual `wait/notify` complexity.

## Java 8 Producer-Consumer Example

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class BlockingQueueDemo {
    public static void main(String[] args) {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(3);

        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 5; i++) {
                    queue.put("job-" + i);
                    System.out.println("Produced job-" + i);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        Thread consumer = new Thread(() -> {
            try {
                for (int i = 1; i <= 5; i++) {
                    String job = queue.take();
                    System.out.println("Consumed " + job);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        producer.start();
        consumer.start();
    }
}
```

## Choosing the Right Queue Type

- `ArrayBlockingQueue`: fixed capacity, predictable memory usage.
- `LinkedBlockingQueue`: optional bound, higher throughput for some workloads.
- `PriorityBlockingQueue`: ordered by priority (not FIFO).
- `SynchronousQueue`: direct handoff, no internal capacity.

For most backend pipelines, start with bounded `ArrayBlockingQueue` or bounded `LinkedBlockingQueue`.

## API Behavior You Should Know

- `put(e)`: blocks until space available.
- `take()`: blocks until item available.
- `offer(e, timeout, unit)`: waits up to timeout, returns `false` if full.
- `poll(timeout, unit)`: waits up to timeout, returns `null` if empty.

Timeout-based operations are useful when you need responsive shutdown and better failure control.

## Graceful Shutdown Pattern (Poison Pill)

When consumers run in loops, use a sentinel message to stop cleanly.

```java
static final String POISON = "__STOP__";

// producer side
queue.put(POISON);

// consumer loop
while (true) {
    String job = queue.take();
    if (POISON.equals(job)) break;
    process(job);
}
```

Use one poison pill per consumer thread.

## Failure Handling Pattern

If `process(job)` can fail:

1. track attempt count in job payload
2. retry with cap and delay policy
3. route permanent failures to dead-letter queue/storage
4. avoid infinite requeue loops

This keeps worker pools healthy under bad input bursts.

## Monitoring Checklist

- queue depth over time
- producer block time and consumer idle time
- task processing latency
- drop/retry/dead-letter rates

## JDK 11 and Java 17 Notes

`BlockingQueue` usage in producer-consumer patterns remains the same in JDK 11 and Java 17.

## Java 21+ Note

With virtual threads, queue-based coordination still works well. You can run many consumers and keep bounded queue sizes for backpressure.

## Java 25 Note

Design patterns remain the same; prioritize metrics (queue size, wait time, drop/retry policy) in production.

## Key Takeaways

- Prefer `BlockingQueue` over custom synchronization for producer-consumer.
- Keep queues bounded to avoid memory spikes.
- Define rejection/backpressure behavior explicitly.
- Design explicit shutdown and failure-routing paths.
