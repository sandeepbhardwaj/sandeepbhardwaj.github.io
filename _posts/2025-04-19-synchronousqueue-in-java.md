---
title: SynchronousQueue in Java
date: 2025-04-19
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- synchronousqueue
- blockingqueue
- handoff
- thread-pools
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: SynchronousQueue in Java
seo_description: Learn how SynchronousQueue works in Java for direct handoff,
  zero-capacity coordination, and executor-style transfer semantics.
header:
  overlay_image: "/assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 9
  show_overlay_excerpt: false
---
`SynchronousQueue` is one of the most unintuitive queues in the JDK until the right mental model clicks.

It is called a queue, but it has:

- no real storage capacity

That means every insert must rendezvous with a remove.

This makes it the direct-handoff queue.
Nothing waits inside it as buffered backlog.

---

## Problem Statement

Sometimes a system does not want queueing at all.

It wants:

- a producer to hand work directly to a consumer
- and if no consumer is ready, the producer should wait or fail

This is a very different design from:

- buffer up to 100 items
- let consumers catch up later

If your design goal is immediate transfer rather than storage, `SynchronousQueue` becomes interesting.

---

## Mental Model

`SynchronousQueue` is:

- zero-capacity
- blocking
- direct handoff

So:

- `put` waits until another thread is ready to take
- `take` waits until another thread is ready to put

There is no backlog inside the queue itself.

This is why it is so useful in some executor designs:

- do not queue
- either hand off directly to a worker or force another response such as creating a new worker or rejecting

---

## Runnable Example

```java
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.TimeUnit;

public class SynchronousQueueDemo {

    public static void main(String[] args) throws Exception {
        SynchronousQueue<String> queue = new SynchronousQueue<>();

        Thread producer = new Thread(() -> {
            try {
                System.out.println("Producer waiting to hand off");
                queue.put("task-1");
                System.out.println("Producer completed handoff");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "producer");

        Thread consumer = new Thread(() -> {
            try {
                TimeUnit.MILLISECONDS.sleep(300);
                System.out.println("Consumer received " + queue.take());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "consumer");

        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
    }
}
```

The queue never stores `task-1` in a backlog.
It only transfers it when both sides meet.

---

## Where It Fits Well

Strong fits:

- direct handoff between producer and worker
- executor designs that should not queue work internally
- systems where buffering is undesirable or misleading

One famous place this matters is cached-thread-pool style behavior:

- if an idle worker is available, hand off work
- otherwise create or reject according to executor policy

That is much closer to direct transfer than to ordinary queue buffering.

---

## Where It Does Not Fit

Poor fits:

- systems that need backlog absorption
- producer-consumer pipelines where buffering is useful
- workloads that need queue introspection or sizing

If you want:

- "accept work now and process it later"

then `SynchronousQueue` is the wrong primitive.

Its point is:

- "do not accept unless someone can take it now"

---

## Common Mistakes

### Thinking it is just a very small queue

It is not a size-1 queue.
It is a size-0 handoff point.

### Expecting queue depth metrics

There is no meaningful backlog to inspect inside the queue.

### Using it without understanding the system's fallback behavior

If a producer cannot hand off immediately, what should happen:

- wait
- time out
- spawn more workers
- reject

That policy is the real operational design.

---

## Testing and Debugging Notes

Validate:

- producer blocks until consumer is ready
- consumer blocks until producer is ready
- timeout behavior if using timed operations

Operationally, if a system using `SynchronousQueue` struggles, inspect:

- worker availability
- thread pool saturation
- rejection behavior

The failure mode is not queue growth.
It is inability to match producers to consumers quickly enough.

---

## Decision Guide

Use `SynchronousQueue` when:

- direct handoff is the design goal
- buffering should be avoided
- the producer should feel immediate lack of consumer capacity

Do not use it when:

- you need backlog
- you need bounded buffering
- consumers should drain queued work later

---

## Key Takeaways

- `SynchronousQueue` is a zero-capacity direct-handoff queue.
- Producers and consumers rendezvous; no backlog is stored inside the queue.
- It is useful when queueing is undesirable and immediate transfer is the real design.
- If you need buffering, choose another queue type.

Next post: [Producer Consumer with BlockingQueue in Java](/java/concurrency/producer-consumer-with-blockingqueue-in-java/)
