---
title: ConcurrentLinkedQueue in Java
date: 2025-04-12
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- concurrentlinkedqueue
- queue
- lock-free
- collections
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: ConcurrentLinkedQueue in Java
seo_description: Learn how ConcurrentLinkedQueue works in Java, where it fits,
  and why non-blocking FIFO queues differ from BlockingQueue designs.
header:
  overlay_image: "/assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 9
  show_overlay_excerpt: false
---
`ConcurrentLinkedQueue` is the standard non-blocking unbounded FIFO queue in the JDK.

Its strength is straightforward:

- many threads can enqueue and dequeue concurrently
- without a coarse application-level lock

Its limitations are just as important:

- it does not block on empty
- it does not provide backpressure
- it is unbounded

So this queue is excellent for some high-concurrency buffering patterns and completely wrong for others.

---

## Problem Statement

Suppose several threads need to publish work items or events to a shared queue, and other threads may consume them opportunistically.

You want:

- FIFO behavior
- good concurrency
- no single global `synchronized` queue bottleneck

But you do not necessarily want:

- producers to block
- consumers to wait inside `take()`
- fixed queue capacity

That is the niche of `ConcurrentLinkedQueue`.

---

## Mental Model

`ConcurrentLinkedQueue` is:

- non-blocking
- unbounded
- FIFO

That means:

- `offer` adds immediately
- `poll` returns an item or `null`
- `peek` observes the head or `null`

The queue coordinates concurrent access safely, but it does not impose a waiting policy.

That is the key distinction from `BlockingQueue`.

With `ConcurrentLinkedQueue`, the application decides what to do when:

- the queue is empty
- producers outrun consumers

The queue itself does not provide blocking handoff or backpressure.

---

## Runnable Example

```java
import java.util.concurrent.ConcurrentLinkedQueue;

public class ConcurrentLinkedQueueDemo {

    public static void main(String[] args) {
        ConcurrentLinkedQueue<String> events = new ConcurrentLinkedQueue<>();

        events.offer("order-created");
        events.offer("payment-authorized");
        events.offer("inventory-reserved");

        String event;
        while ((event = events.poll()) != null) {
            System.out.println("Handled " + event);
        }

        System.out.println("Queue empty? " + (events.peek() == null));
    }
}
```

The surface API looks small because it is.

The important design question is whether a non-blocking unbounded queue matches the workflow.

---

## Where It Fits Well

Strong fits:

- lightweight shared event buffers
- best-effort task staging
- high-concurrency handoff where consumers can poll opportunistically
- internal queues where external backpressure exists elsewhere

Examples:

- request threads publishing metrics events to a side processor
- threads appending lightweight notifications
- producer threads handing off low-priority background work that can be drained later

These workflows can tolerate the fact that the queue itself does not block or bound.

---

## Where It Does Not Fit

Poor fits:

- classic producer-consumer systems that need blocking on empty
- systems that need bounded capacity
- workflows where producer speed must be constrained by consumer throughput
- queues whose size may grow without limit under load

If the system needs:

- blocking
- capacity limits
- explicit backpressure

then a `BlockingQueue` is usually the better primitive family.

---

## Important Operational Notes

### `size()` is not a control primitive

On `ConcurrentLinkedQueue`, `size()` is not the kind of cheap exact measurement developers often expect in ordinary collections.

It should not be the basis of concurrency control or overload policy.

### Empty means poll returns `null`

There is no built-in wait.

If your consumer loops aggressively on `poll()` while the queue is empty, you have built a spin-polling system and should reconsider the design.

### Unbounded growth is real

Because the queue is unbounded, overload often shows up as memory growth instead of immediate blocking or rejection.

That can make the system look healthy right up until it is not.

---

## Common Mistakes

### Using it where a blocking queue is needed

If consumers should sleep until work arrives, `ConcurrentLinkedQueue` is the wrong primitive.

### Using it without any external overload strategy

An unbounded queue can absorb pressure only by growing.

That is not free.

### Polling in tight loops

If consumers continuously poll an empty queue, CPU gets burned for no useful work.

### Using queue length as a precise SLA metric

This queue is strong for concurrent progress, not for exact accounting semantics.

---

## Testing and Debugging Notes

When validating fit, test:

- producer bursts
- consumer lag
- empty-queue behavior
- memory growth under sustained load

Useful operational metrics:

- enqueue rate
- dequeue rate
- lag or age of queued items
- memory pressure during backlog growth

The most dangerous failure pattern is slow consumer plus unbounded queue plus no admission control.

---

## Decision Guide

Use `ConcurrentLinkedQueue` when:

- you need a non-blocking shared FIFO queue
- unbounded buffering is acceptable or controlled elsewhere
- consumers can poll without requiring built-in waiting semantics

Do not use it when:

- blocking or backpressure is required
- queue growth must be bounded
- a producer-consumer design depends on `put` and `take`

---

## Key Takeaways

- `ConcurrentLinkedQueue` is the JDK's non-blocking unbounded concurrent FIFO queue.
- It is good for shared buffering and opportunistic draining, not for backpressure-oriented producer-consumer pipelines.
- It does not block on empty and does not limit growth.
- If the workflow needs waiting or bounded capacity, move to the `BlockingQueue` family instead.

Next post: [ConcurrentSkipListMap and Sorted Concurrent Structures](/java/concurrency/concurrentskiplistmap-and-sorted-concurrent-structures/)
