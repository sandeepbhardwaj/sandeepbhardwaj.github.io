---
title: Synchronized Wrappers vs Concurrent Collections in Java
date: 2025-04-08
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- synchronized-collections
- concurrent-collections
- collections
- thread-safety
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Synchronized Wrappers vs Concurrent Collections in Java
seo_description: Learn how synchronized wrappers differ from concurrent
  collections in Java and how to choose based on iteration, contention, and
  workload shape.
header:
  overlay_image: "/assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 9
  show_overlay_excerpt: false
---
Once a collection becomes shared across threads, the next question is usually:

- should I wrap it with synchronization, or
- should I replace it with a concurrent collection

Those are not equivalent moves.

Both can be correct in the right setting, but they optimize for different things:

- synchronized wrappers give simple coarse-grained safety
- concurrent collections give more scalable, specialized concurrency behavior

---

## The Two Families

### Synchronized wrappers

Examples:

- `Collections.synchronizedList(...)`
- `Collections.synchronizedMap(...)`
- `Collections.synchronizedSet(...)`

These wrap an ordinary collection and serialize access through one monitor.

### Concurrent collections

Examples:

- `ConcurrentHashMap`
- `CopyOnWriteArrayList`
- `ConcurrentLinkedQueue`
- `ConcurrentSkipListMap`
- `BlockingQueue` implementations

These are designed with concurrency semantics as part of their core behavior.

---

## Problem Statement

Suppose a service shares one in-memory collection across many threads.

You need to decide:

- is one lock around every operation acceptable
- or do reads and writes need to overlap more efficiently
- or does the collection need specialized iteration or queue semantics

If you answer only "I need thread safety," you are not answering enough.
You also need to answer:

- what kind of workload is this collection under

That determines whether the wrapper or the specialized concurrent structure is the better fit.

---

## Mental Model

A synchronized wrapper says:

- take one ordinary collection
- guard each method with one shared monitor

This is conceptually simple and often correct.

A concurrent collection says:

- the data structure itself implements a concurrency strategy appropriate for its shape

That can mean:

- more concurrent reads
- weaker but useful iteration guarantees
- atomic map helpers
- non-blocking queue operations
- blocking producer-consumer semantics

So concurrent collections are not just "faster synchronized wrappers."
They usually have different semantics.

---

## Runnable Comparison Example

```java
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class WrapperVsConcurrentCollectionDemo {

    public static void main(String[] args) {
        Map<String, Integer> synchronizedMap =
                Collections.synchronizedMap(new HashMap<>());
        synchronizedMap.put("P100", 10);
        synchronizedMap.put("P200", 20);

        synchronized (synchronizedMap) {
            for (Map.Entry<String, Integer> entry : synchronizedMap.entrySet()) {
                System.out.println("Wrapped map entry: " + entry.getKey() + "=" + entry.getValue());
            }
        }

        ConcurrentHashMap<String, Integer> concurrentMap = new ConcurrentHashMap<>();
        concurrentMap.put("P100", 10);
        concurrentMap.merge("P100", 5, Integer::sum);
        concurrentMap.computeIfAbsent("P300", ignored -> 30);

        concurrentMap.forEach((key, value) ->
                System.out.println("Concurrent map entry: " + key + "=" + value));
    }
}
```

The contrast is important:

- the synchronized wrapper still needs external synchronization for iteration
- the concurrent map provides concurrency-aware operations and weakly consistent traversal

These are different programming models.

---

## Where Synchronized Wrappers Fit Well

Strong fits:

- low-contention shared collections
- simple legacy code where one monitor is enough
- cases where full iteration can safely hold one external lock
- small data structures whose throughput demands are modest

Advantages:

- easy mental model
- behavior close to the underlying collection
- minimal API learning cost

If contention is low and the code is simple, wrappers are often perfectly reasonable.

---

## Where Concurrent Collections Fit Well

Strong fits:

- read-heavy shared maps
- lock-free queues
- sorted concurrent access
- listener lists with rare mutation
- producer-consumer handoff

Advantages:

- better scaling under contention
- collection-specific atomic methods
- iteration behavior designed for concurrent use
- specialized queue semantics such as blocking or non-blocking progress

The key is that each concurrent collection earns its place by matching a workload shape.

---

## The Iteration Trap

This is the most common source of confusion.

With synchronized wrappers, this is not enough:

```java
for (String key : synchronizedMap.keySet()) {
    ...
}
```

You usually need:

```java
synchronized (synchronizedMap) {
    for (String key : synchronizedMap.keySet()) {
        ...
    }
}
```

Why?

Because the wrapper synchronizes individual methods, but iteration spans many method calls and must still be protected as one traversal boundary.

Concurrent collections often avoid this exact pattern by offering iterators that are safe to use concurrently, but those iterators usually come with weaker consistency guarantees than a fully locked traversal.

---

## Common Mistakes

### Assuming a wrapper and a concurrent collection are interchangeable

They may both be thread-safe, but they behave differently under iteration, compound actions, and contention.

### Choosing a concurrent collection without needing its semantics

If one synchronized boundary would be simpler and fast enough, extra complexity may be unnecessary.

### Forgetting compound actions

Even with thread-safe collections, logic like:

- check then put
- get then update

still needs an atomic boundary, either external or built into the collection API.

### Treating iteration guarantees as stronger than they are

Weakly consistent iteration is safe for concurrent use, but it is not the same thing as a fully locked snapshot.

---

## Decision Guide

Choose a synchronized wrapper when:

- contention is low
- one global lock is acceptable
- you want a simple safety story

Choose a concurrent collection when:

- contention is meaningful
- the collection type offers specialized concurrency behavior you actually need
- iteration or compound operations should work in a collection-aware way

If you need:

- blocking semantics, use a blocking queue
- lock-free FIFO buffering, use `ConcurrentLinkedQueue`
- read-heavy concurrent mapping, use `ConcurrentHashMap`
- read-mostly snapshot iteration, use `CopyOnWriteArrayList`

---

## Key Takeaways

- Synchronized wrappers add one coarse-grained monitor around an ordinary collection.
- Concurrent collections are purpose-built data structures with workload-specific concurrency semantics.
- Wrapper iteration still typically requires external synchronization.
- Choose based on workload shape and semantics, not just on the generic label "thread-safe."

Next post: [ConcurrentHashMap in Java Deep Dive](/java/concurrency/concurrenthashmap-in-java-deep-dive/)
