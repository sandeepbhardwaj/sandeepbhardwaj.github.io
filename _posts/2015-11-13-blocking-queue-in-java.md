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
toc: true
toc_label: In This Article
toc_icon: cog
---

# Blocking Queue in Java

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
