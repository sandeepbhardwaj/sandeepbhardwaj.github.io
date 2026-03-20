---
title: CopyOnWriteArrayList in Java and When It Fits
date: 2025-04-11
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- copyonwritearraylist
- collections
- listeners
- iteration
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: CopyOnWriteArrayList in Java and When It Fits
seo_description: Learn how CopyOnWriteArrayList works in Java, why snapshot
  iteration is useful, and when its write cost is or is not acceptable.
header:
  overlay_image: "/assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 9
  show_overlay_excerpt: false
---
`CopyOnWriteArrayList` is one of the most specialized collections in the concurrent collections family.

Its core trade-off is simple and dramatic:

- reads and iteration are easy and safe
- every structural write copies the underlying array

That sounds expensive because it is.
But in the right workload, it is exactly the right trade.

This is the collection for cases where iteration dominates and mutation is rare enough that copying the array on each write is acceptable.

---

## Problem Statement

Some shared collections are not general-purpose mutable lists.
They are effectively registries or snapshots:

- listeners
- observers
- hook pipelines
- configuration subscribers
- small routing chains that rarely change

In these workloads, the system often wants:

- very cheap safe iteration
- no lock held while notifying readers
- no `ConcurrentModificationException`

`CopyOnWriteArrayList` exists for this specific shape of problem.

---

## Mental Model

The collection behaves like this:

1. readers iterate over an immutable snapshot array
2. writers create a new array copy with the change applied
3. the collection publishes the new array
4. existing iterators keep seeing their old snapshot safely

This means iteration is stable and simple.

It also means writes are expensive because each structural update copies the whole backing array.

So the central question is not:

- is copying bad

It is:

- is the read-heavy snapshot iteration benefit worth the copy cost

---

## Runnable Example

The classic use case is a listener registry.

```java
import java.util.concurrent.CopyOnWriteArrayList;

public class CopyOnWriteArrayListDemo {

    public static void main(String[] args) {
        PricePublisher publisher = new PricePublisher();

        publisher.register(price -> System.out.println("Listener A saw " + price));
        publisher.register(price -> System.out.println("Listener B saw " + price));

        publisher.publish(1999);
        publisher.publish(2499);
    }

    static final class PricePublisher {
        private final CopyOnWriteArrayList<PriceListener> listeners =
                new CopyOnWriteArrayList<>();

        void register(PriceListener listener) {
            listeners.addIfAbsent(listener);
        }

        void publish(int cents) {
            for (PriceListener listener : listeners) {
                listener.onPrice(cents);
            }
        }
    }

    interface PriceListener {
        void onPrice(int cents);
    }
}
```

This is a strong fit because:

- listener iteration is frequent
- registration is rare
- snapshot iteration is desirable during callbacks

You do not want to hold a big external lock while invoking listener code.

---

## Why Snapshot Iteration Is Valuable

Snapshot iteration means:

- the traversal sees a stable array
- concurrent adds or removes do not break the current iteration
- no `ConcurrentModificationException` occurs

This is especially useful when iteration is doing callback invocation, because callback code may:

- be slow
- re-enter the system
- register or deregister other listeners

That kind of workload becomes much easier to reason about when the current traversal is insulated from concurrent structural changes.

---

## Strong Fit Workloads

Good fits:

- event listener registries
- observer lists
- plugin hooks
- rarely changing handler chains
- small read-mostly reference lists

The strongest signal is:

- iteration is common
- structural mutation is rare
- list size is moderate enough that copy cost is acceptable

---

## Poor Fit Workloads

Bad fits:

- large lists with frequent writes
- shared queues
- hot append-heavy buffers
- data structures where every request mutates the collection

In those cases, the copy-on-write cost becomes the dominant penalty and you are paying for snapshot semantics you do not really need.

---

## Common Mistakes

### Using it as a general-purpose concurrent list

This is the biggest mistake.

`CopyOnWriteArrayList` is not a universal concurrent replacement for `ArrayList`.
It is a workload-specific tool.

### Storing large objects and mutating frequently

Even if the objects themselves are fine, copying the reference array repeatedly can become expensive as the list grows.

### Assuming it gives real-time visibility inside one iterator

An iterator sees its snapshot.
New writes after iteration begins will appear in future traversals, not retroactively in the current one.

---

## Testing and Debugging Notes

Look for these signals when validating fit:

- how often writes happen relative to reads
- how large the list gets
- whether iteration under concurrent registration is a real requirement

If performance degrades, investigate:

- write frequency
- array-copy cost
- unexpectedly large list size

This collection often fails not because it is incorrect, but because the workload silently changed from read-mostly to write-heavy.

---

## Decision Guide

Use `CopyOnWriteArrayList` when:

- the list is read or iterated far more often than it is changed
- snapshot traversal semantics are desirable
- list size is not explosively large

Do not use it when:

- writes are common
- the list is acting like a queue or buffer
- you need a mutable list optimized for constant churn

---

## Key Takeaways

- `CopyOnWriteArrayList` buys simple safe snapshot iteration by copying the backing array on each structural write.
- It is excellent for listener and observer registries with rare mutation.
- It is a poor fit for write-heavy or large constantly changing lists.
- The right question is not whether copying is expensive in theory, but whether the workload is read-mostly enough to justify the trade.

Next post: [ConcurrentLinkedQueue in Java](/java/concurrency/concurrentlinkedqueue-in-java/)
