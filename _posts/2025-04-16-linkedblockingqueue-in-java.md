---
title: LinkedBlockingQueue in Java
date: 2025-04-16
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- linkedblockingqueue
- blockingqueue
- queue
- producer-consumer
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: LinkedBlockingQueue in Java
seo_description: Learn how LinkedBlockingQueue works in Java, where it fits,
  and why its optional capacity and default unbounded behavior deserve care.
header:
  overlay_image: "/assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 9
  show_overlay_excerpt: false
---
`LinkedBlockingQueue` is one of the most commonly used blocking queues in Java, often because it is easy to reach for and works well in many producer-consumer designs.

Its danger is exactly the same thing:

- it is easy to reach for

Especially because the no-argument capacity behavior is effectively unbounded for most application purposes.

That means teams sometimes adopt it without really choosing their overload semantics.

---

## Problem Statement

You need a queue between producers and consumers, but unlike `ArrayBlockingQueue`, you may not want a small rigid fixed array capacity.

You may want:

- a queue that can absorb some burstiness
- blocking semantics for `put` and `take`
- a straightforward general-purpose producer-consumer structure

`LinkedBlockingQueue` is often a good answer.

The problem begins when it is used as if "more queue space" automatically means "better resilience."

---

## Mental Model

`LinkedBlockingQueue` is:

- FIFO
- blocking
- linked-node based
- optionally bounded

You can construct it with:

- an explicit capacity
- or no capacity, which defaults to a very large maximum

That default is the main operational caveat.

If producers outrun consumers, an effectively unbounded queue does not reject pressure.
It stores pressure in memory and latency.

---

## Runnable Example

```java
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

public class LinkedBlockingQueueDemo {

    public static void main(String[] args) throws Exception {
        LinkedBlockingQueue<String> queue = new LinkedBlockingQueue<>(3);

        queue.put("job-1");
        queue.put("job-2");
        queue.put("job-3");

        System.out.println("Took " + queue.take());

        boolean offered = queue.offer("job-4", 200, TimeUnit.MILLISECONDS);
        System.out.println("Offered job-4? " + offered);

        while (!queue.isEmpty()) {
            System.out.println("Drained " + queue.take());
        }
    }
}
```

This example uses an explicit capacity on purpose.

That is often the safer production habit, because it forces you to make the overload conversation explicit.

---

## Where It Fits Well

Strong fits:

- general-purpose producer-consumer pipelines
- batch handoff between stages
- systems that want some burst absorption but still benefit from optional bounding

Compared with `ArrayBlockingQueue`, it can be attractive when:

- strict fixed-array behavior is not necessary
- a linked-node queue is acceptable
- throughput characteristics fit the workload

It is a very practical default if you choose capacity deliberately.

---

## The Default-Capacity Trap

This is the most important warning in the whole post.

If you use:

```java
new LinkedBlockingQueue<>()
```

you are effectively saying:

- "we are willing to queue an enormous amount of work before the queue itself pushes back"

That may or may not be acceptable.

In many backend systems, it is not.

Because unbounded queue growth often means:

- rising latency
- rising heap use
- delayed failure

That is sometimes worse than early rejection.

---

## Trade-Offs Against `ArrayBlockingQueue`

Compared with `ArrayBlockingQueue`:

- `LinkedBlockingQueue` is often chosen for a more flexible general-purpose shape
- `ArrayBlockingQueue` is often chosen for harder boundedness and predictability

The right choice depends on what you want the failure mode to be.

If you want:

- very explicit capacity as a primary design boundary, `ArrayBlockingQueue` is often clearer

If you want:

- a classic blocking FIFO queue and are still willing to set a sensible capacity, `LinkedBlockingQueue` can be a strong choice

---

## Common Mistakes

### Using the default constructor in production code without a capacity decision

This is the biggest one.

### Assuming more queueing is always better

More queueing often means more waiting and more memory, not more throughput.

### Ignoring item size

An unbounded queue of large work items becomes dangerous much faster than teams expect.

### Treating the queue as a substitute for overload policy

It is only one boundary in the system.
You still need to decide:

- reject
- shed load
- degrade features
- scale consumers

---

## Testing and Debugging Notes

Useful load checks:

- sustained producer bursts
- consumer slowdowns
- memory growth under backlog
- queue age and depth over time

If a system with `LinkedBlockingQueue` degrades slowly rather than failing quickly, the queue may be hiding overload by absorbing it into latency and heap usage.

That can be much harder to see than immediate rejections.

---

## Decision Guide

Use `LinkedBlockingQueue` when:

- you want a straightforward blocking FIFO queue
- some buffering is useful
- capacity can be chosen deliberately

Avoid the default unbounded constructor unless you are sure the workload and memory profile justify it.

Do not use it when:

- priority ordering is required
- delay-based availability is required
- zero-capacity handoff is the real need

---

## Key Takeaways

- `LinkedBlockingQueue` is a practical blocking FIFO queue with optional capacity.
- Its biggest operational risk is the easy-to-ignore default unbounded behavior.
- In production, choosing a deliberate capacity is usually better than leaving overload to heap growth.
- Queue growth is not free resilience; it is stored latency and memory pressure.

Next post: [PriorityBlockingQueue in Java](/java/concurrency/priorityblockingqueue-in-java/)
