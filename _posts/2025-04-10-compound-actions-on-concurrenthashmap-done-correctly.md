---
title: Compound Actions on ConcurrentHashMap Done Correctly
date: 2025-04-10
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- concurrenthashmap
- compound-actions
- computeifabsent
- merge
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Compound Actions on ConcurrentHashMap Done Correctly
seo_description: Learn how to perform compound actions on ConcurrentHashMap
  correctly with atomic methods such as computeIfAbsent, compute, merge, and
  conditional replace.
header:
  overlay_image: "/assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 9
  show_overlay_excerpt: false
---
Using `ConcurrentHashMap` does not automatically make every map-related workflow correct.

That is the main mistake this post exists to prevent.

The map gives you thread-safe structural access and several atomic helpers.
But if you ignore those helpers and write multi-step workflows as separate operations, you can still recreate familiar races.

In practice, the most important skill with `ConcurrentHashMap` is not just knowing it exists.
It is knowing how to express compound map actions as one atomic map-level decision when the API provides the right hook.

---

## Problem Statement

Consider common workflows like:

- initialize a value only once
- increment a per-key counter
- update a value based on its previous value
- remove an entry only if it still has an expected state

These are compound actions.

If you code them as:

- `get`
- branch
- `put`

you may still have a race even though the map itself is concurrent.

The concurrency bug moved from the map structure to your workflow logic.

---

## Naive Examples

This is a classic broken initialization pattern:

```java
if (!cache.containsKey(key)) {
    cache.put(key, loadValue(key));
}
```

Two threads can both load the value and both call `put`.

This is a classic broken counter update:

```java
Integer current = counts.get(key);
counts.put(key, current == null ? 1 : current + 1);
```

Two threads can both read the same old value and overwrite each other.

The map is still concurrent.
The workflow is still broken.

---

## Mental Model

The right question is:

- can this map operation be expressed as one key-level atomic transformation

If yes, prefer the dedicated method.

Common atomic helpers:

- `putIfAbsent`
- `computeIfAbsent`
- `computeIfPresent`
- `compute`
- `merge`
- `remove(key, value)`
- `replace(key, oldValue, newValue)`

These methods exist precisely because concurrent map workflows often need more than isolated `get` and `put` calls.

---

## Runnable Example

```java
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentHashMapCompoundActionsDemo {

    public static void main(String[] args) {
        UserSessions sessions = new UserSessions();

        sessions.startSession("u1");
        sessions.startSession("u1");
        sessions.recordEvent("u1");
        sessions.recordEvent("u1");
        sessions.finishSession("u1");

        System.out.println("Sessions map = " + sessions.snapshot());
    }

    static final class UserSessions {
        private final ConcurrentHashMap<String, SessionState> sessions =
                new ConcurrentHashMap<>();

        void startSession(String userId) {
            sessions.computeIfAbsent(userId, ignored -> new SessionState(0, true));
        }

        void recordEvent(String userId) {
            sessions.computeIfPresent(userId, (ignored, current) ->
                    new SessionState(current.eventCount() + 1, current.active()));
        }

        void finishSession(String userId) {
            sessions.computeIfPresent(userId, (ignored, current) ->
                    new SessionState(current.eventCount(), false));
        }

        ConcurrentHashMap<String, SessionState> snapshot() {
            return new ConcurrentHashMap<>(sessions);
        }
    }

    record SessionState(int eventCount, boolean active) {
    }
}
```

The design is intentional:

- each update is expressed through an atomic map method
- immutable values make replacement safer and easier to reason about

This is often much cleaner than storing mutable values and mutating them in place.

---

## Choosing the Right Atomic Map Method

### `putIfAbsent`

Use when:

- you already have the value
- you only want to install it if the key is missing

### `computeIfAbsent`

Use when:

- the value should be created lazily
- creation depends on the key

### `merge`

Use when:

- a key should combine with a new incoming value
- counters or totals are being aggregated

### `compute`

Use when:

- you need full control over old-value to new-value transformation
- the key may or may not already exist

### Conditional `remove` or `replace`

Use when:

- the update should happen only if the entry still matches an expected state

These methods are not just convenience APIs.
They are the concurrency-safe expression of intent.

---

## Important Caveat About Mapping Functions

The mapping or remapping function should be:

- side-effect aware
- reasonably fast
- free of unrelated blocking work

Why?

Because the map may invoke it as part of coordinating updates for that key.

Poor patterns include:

- long database calls inside `compute`
- network I/O inside `merge`
- expensive global coordination inside `computeIfAbsent`

Keep the function focused on value transformation.
Do slow work outside the critical path where possible.

---

## Mutable Values vs Immutable Replacement

This deserves explicit attention.

If your map stores mutable objects, you may still need extra coordination inside each value.

Example risk:

- the map safely publishes `OrderBucket`
- several threads then mutate the same `OrderBucket` unsafely

That is why many strong designs use:

- immutable values
- map-level replacement on update

This is not the only correct approach, but it often simplifies reasoning substantially.

---

## Common Mistakes

### Separate `get` and `put` for one logical update

This is the most common error.

### Performing heavyweight side effects in `compute*` methods

Map-level atomicity does not mean "put your whole workflow here."

### Assuming one concurrent map solves cross-map invariants

If a business rule spans:

- several maps
- a map plus a queue
- a map plus external state

then one atomic map method is not enough to make the whole workflow atomic.

### Storing non-thread-safe mutable values and forgetting about value-level safety

The map boundary and value boundary are different things.

---

## Testing and Debugging Notes

Good tests for compound map logic include:

- many threads hitting the same hot key
- initialization races
- remove-if-still-expected scenarios
- aggregate update correctness under contention

Look for symptoms such as:

- duplicate initialization
- lost increments
- impossible state transitions

These are exactly the kinds of bugs atomic helper methods are meant to eliminate.

---

## Decision Guide

Use atomic map methods when:

- the workflow can be expressed as one key-level transformation or conditional update

Do not assume they solve:

- cross-key transactions
- cross-structure invariants
- mutable value-object races

When the invariant is larger than one key-level map action, step back and redesign the boundary.

---

## Key Takeaways

- `ConcurrentHashMap` is safe structurally, but your workflow can still be racy if you split compound actions into separate calls.
- Prefer `putIfAbsent`, `computeIfAbsent`, `compute`, `merge`, and conditional replace or remove helpers for atomic key-level logic.
- Keep mapping functions focused and avoid heavyweight blocking work inside them.
- Map safety and value-object safety are different boundaries.

Next post: [CopyOnWriteArrayList in Java and When It Fits](/2025/04/11/copyonwritearraylist-in-java-and-when-it-fits/)
