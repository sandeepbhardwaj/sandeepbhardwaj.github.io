---
title: Why Ordinary Collections Are Unsafe Under Concurrent Mutation
date: 2025-04-07
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- collections
- hashmap
- arraylist
- thread-safety
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Why Ordinary Collections Are Unsafe Under Concurrent Mutation
seo_description: Learn why ordinary Java collections like HashMap and ArrayList
  are unsafe under concurrent mutation and what kinds of failures they cause.
header:
  overlay_image: "/assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 9
  show_overlay_excerpt: false
---
Ordinary Java collections are designed for single-threaded use unless you add an explicit concurrency strategy around them.

That includes the most familiar types:

- `ArrayList`
- `HashMap`
- `HashSet`
- `LinkedList`
- `TreeMap`

This does not mean they are "bad."
It means they make no promise that concurrent mutation is safe.

That distinction matters because collections often become shared state long before teams realize they have a concurrency boundary.

---

## Problem Statement

Suppose a backend service keeps in-memory shared data such as:

- active sessions
- product metadata
- recent event buffers
- request correlation maps

A developer may start with an ordinary collection because the single-threaded version is straightforward.

Then the service becomes concurrent:

- request threads access it in parallel
- refresh jobs mutate it
- background workers iterate over it

At that point, the collection is no longer just a data structure.
It is a concurrency boundary.

If you do not make that boundary explicit, the system becomes timing-sensitive in ways that are hard to debug.

---

## What "Unsafe" Actually Means

Unsafe under concurrent mutation does not mean only one dramatic failure mode.

It can mean:

- lost updates
- stale reads
- inconsistent iteration
- broken internal structure assumptions
- `ConcurrentModificationException` in fail-fast iterators
- behavior that "usually works" until load increases

This is why these bugs are expensive.
The code often looks normal in review and may pass low-contention tests.

---

## Naive Example

Consider a shared in-memory order index:

```java
class OrderIndex {
    private final java.util.Map<String, String> orders = new java.util.HashMap<>();

    void put(String orderId, String status) {
        orders.put(orderId, status);
    }

    String get(String orderId) {
        return orders.get(orderId);
    }
}
```

This is fine if exactly one thread owns it.
It is not fine if several request threads and background jobs mutate it concurrently.

The problem is not that `HashMap` is missing one magical method.
The problem is that the object provides no synchronization, no visibility guarantee, and no atomicity boundary for concurrent mutation.

---

## Runnable Demonstration

The following example shows one of the easiest real failures to reproduce: iterating an ordinary collection while another thread mutates it.

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class OrdinaryCollectionUnsafeDemo {

    public static void main(String[] args) throws Exception {
        List<String> events = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            events.add("event-" + i);
        }

        Thread reader = new Thread(() -> {
            try {
                for (String event : events) {
                    System.out.println("Reading " + event);
                    sleep(50);
                }
            } catch (Exception e) {
                System.out.println("Reader failed: " + e);
            }
        }, "reader");

        Thread writer = new Thread(() -> {
            sleep(80);
            events.add("event-new");
            System.out.println("Writer added new event");
        }, "writer");

        reader.start();
        writer.start();

        reader.join();
        writer.join();
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

A typical outcome is `ConcurrentModificationException`.

That exception is useful as a warning, but it is only one symptom.
Many other failures are subtler:

- wrong final counts
- duplicate work
- missing elements
- stale cached data

So fail-fast exceptions are not the whole story.

---

## Why Ordinary Collections Behave This Way

Ordinary collections make internal assumptions that are safe in sequential code:

- structural updates happen one at a time
- iteration sees a stable structural picture unless the same thread changes it intentionally
- memory visibility is not coordinated for you

Once multiple threads mutate the same structure, those assumptions break.

Important point:

- even if individual reference reads and writes are low-level atomic
- the collection operations are still not automatically safe as a whole

`put`, `add`, `remove`, iteration, resize, and traversal all participate in a higher-level invariant.

That invariant is not protected by default.

---

## Common Real-World Failure Shapes

### 1. Check-then-act on a shared map

```java
if (!sessions.containsKey(userId)) {
    sessions.put(userId, createSession());
}
```

Two threads can both pass the check and create duplicate state.

### 2. Iteration during mutation

One thread scans a list for reporting while another appends or removes entries.

This may throw, skip data, or observe unstable ordering.

### 3. Accidental shared caches

A plain `HashMap` used as a request cache often survives development traffic and fails later under real concurrency.

### 4. Shared lists as queues

Using `ArrayList` or `LinkedList` as a cross-thread work queue without coordination usually becomes a mix of races and inefficient polling.

---

## Why `ConcurrentModificationException` Is Not a Safety Mechanism

This needs emphasis.

Developers sometimes think:

- "If iteration is unsafe, I will get `ConcurrentModificationException`, so I am protected."

That is the wrong model.

Fail-fast iterators are best-effort diagnostics.
They are not a concurrency guarantee.

They do not mean:

- all bad interleavings are detected
- all unsafe use will throw
- no broken read will occur before failure

So you should treat the exception as a helpful alarm, not as a correctness boundary.

---

## What To Do Instead

When a collection becomes shared across threads, choose an explicit strategy:

- external synchronization
- synchronized wrappers
- a concurrent collection
- immutable snapshot replacement
- thread confinement or single-owner design

The right choice depends on the workload:

- read-heavy
- write-heavy
- ordered
- sorted
- blocking or non-blocking

This module covers those trade-offs piece by piece.

---

## Testing and Debugging Notes

Ordinary collection concurrency bugs are often timing-sensitive.

Useful detection strategies:

- stress tests with many threads
- repeated runs rather than one happy-path run
- assertions on counts and invariants after concurrent operations
- logs around iteration and mutation boundaries

Symptoms that often point back to unsafe shared collections:

- intermittent `ConcurrentModificationException`
- missing cache entries under load
- queue sizes that do not add up
- duplicate or dropped work items

The hard part is that the collection code usually looks innocent.
The real bug is often hidden in the ownership model around it.

---

## Decision Guide

Ordinary collections are fine when:

- one thread owns them
- they are immutable after publication
- they are confined to one request or method call

Do not share them for concurrent mutation unless you also choose a coordination strategy deliberately.

If you need:

- a single mutex around everything, consider a synchronized wrapper
- higher concurrent throughput, consider a concurrent collection
- stable snapshots, consider immutable replacement

---

## Key Takeaways

- Ordinary Java collections are not safe for concurrent mutation by default.
- Failures range from exceptions to silent races and inconsistent state.
- `ConcurrentModificationException` is only a diagnostic symptom, not a safety guarantee.
- Once a collection is shared across threads, choose an explicit concurrency strategy rather than hoping the structure will tolerate interleavings.

Next post: [Synchronized Wrappers vs Concurrent Collections in Java](/java/concurrency/synchronized-wrappers-vs-concurrent-collections-in-java/)
