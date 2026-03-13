---
title: Designing Immutable Value Objects in Java
date: 2025-02-24
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- immutability
- value-object
- design
- domain-model
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Designing Immutable Value Objects in Java
seo_description: Learn how to design immutable value objects in Java that remain
  safe, expressive, and easy to share across concurrent systems.
header:
  overlay_image: "/assets/images/java-concurrency-module-05-volatile-immutability-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 5
  show_overlay_excerpt: false
---
It is easy to say “make it immutable.”

The harder and more useful question is:

- how do you design immutable value objects so they stay correct under real production usage?

That means thinking about construction, boundaries, collections, nested objects, and how the object will be used across layers and threads.

---

## Problem Statement

Suppose an order summary object is:

- created in the domain layer
- passed to a cache
- shared with request threads
- logged asynchronously

If that object is meant to represent one stable business value, immutability is a strong design choice.

But if the class exposes mutable internals or accepts shared mutable inputs without copying them, it may only look immutable from the outside.

That is a common source of design bugs.

---

## What Makes a Value Object Truly Immutable

An immutable value object should usually:

- be `final` or effectively non-extendable
- keep fields `private final`
- avoid setters
- fully initialize state in the constructor
- avoid leaking mutable internals
- defend itself against mutable input objects

If any of those rules are broken carelessly, the class can appear immutable while still leaking mutation.

---

## Good Example

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

final class PurchaseOrderSnapshot {
    private final String orderId;
    private final List<String> itemIds;
    private final long totalCents;

    PurchaseOrderSnapshot(String orderId, List<String> itemIds, long totalCents) {
        this.orderId = orderId;
        this.itemIds = Collections.unmodifiableList(new ArrayList<>(itemIds));
        this.totalCents = totalCents;
    }

    String orderId() {
        return orderId;
    }

    List<String> itemIds() {
        return itemIds;
    }

    long totalCents() {
        return totalCents;
    }
}
```

Why this works:

- all fields are final
- construction establishes the full state once
- the incoming list is copied defensively
- callers do not get access to a mutable backing list

That last point matters more than many developers realize.

---

## Broken Example

```java
import java.util.List;

final class BrokenSnapshot {
    private final List<String> itemIds;

    BrokenSnapshot(List<String> itemIds) {
        this.itemIds = itemIds;
    }

    List<String> itemIds() {
        return itemIds;
    }
}
```

This is not safely immutable if callers still hold and mutate the original list.

The class did not defend its own state boundary.

Even worse, if another thread mutates that shared list later, the object's visible state changes without the class itself doing anything.

---

## Runnable Example

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ImmutableValueObjectDemo {

    public static void main(String[] args) {
        List<String> sourceItems = new ArrayList<>();
        sourceItems.add("book");
        sourceItems.add("pen");

        SafeOrderSnapshot safe = new SafeOrderSnapshot("ORD-1", sourceItems);
        BrokenOrderSnapshot broken = new BrokenOrderSnapshot("ORD-1", sourceItems);

        sourceItems.add("laptop");

        System.out.println("Safe items   = " + safe.itemIds());
        System.out.println("Broken items = " + broken.itemIds());
    }

    static final class SafeOrderSnapshot {
        private final String orderId;
        private final List<String> itemIds;

        SafeOrderSnapshot(String orderId, List<String> itemIds) {
            this.orderId = orderId;
            this.itemIds = Collections.unmodifiableList(new ArrayList<>(itemIds));
        }

        List<String> itemIds() {
            return itemIds;
        }
    }

    static final class BrokenOrderSnapshot {
        private final String orderId;
        private final List<String> itemIds;

        BrokenOrderSnapshot(String orderId, List<String> itemIds) {
            this.orderId = orderId;
            this.itemIds = itemIds;
        }

        List<String> itemIds() {
            return itemIds;
        }
    }
}
```

The safe object holds its own snapshot.
The broken object reflects external mutation after construction.

That is exactly the kind of hidden mutability you want to eliminate.

---

## Why This Matters in Concurrent Systems

Immutable value objects are especially useful when objects:

- cross thread boundaries
- move through caches
- appear in async pipelines
- are reused across requests
- represent stable business facts

Good examples:

- order summaries
- config snapshots
- permission sets
- monetary values
- API payload models

These are ideal candidates because they are naturally values, not stateful coordinators.

---

## Common Failure Modes

- storing mutable collections directly
- exposing mutable arrays
- keeping references to mutable nested objects without copying or wrapping
- using setters for data that should be fixed at creation time
- allowing subclassing that can reintroduce mutability or broken invariants

Immutability is not one keyword.
It is a set of design boundaries.

---

## Design Guidance

When designing immutable value objects:

- validate invariants in the constructor
- copy mutable inputs
- return immutable views or copies as needed
- prefer whole-object replacement to partial update
- keep the object small and meaningfully value-oriented

If the class starts behaving like a workflow coordinator or resource manager, it may not be a value object anymore.

---

## Key Takeaways

- Real immutability requires defensive boundaries, not just `final` fields.
- Constructors should establish the full state once and validate the invariant early.
- Mutable collections and nested objects need special care.
- Good immutable value-object design pays off directly in concurrent systems because safe sharing becomes much easier.

Next post: [Mutable vs Immutable Classes in Concurrent Systems](/2025/02/25/mutable-vs-immutable-classes-in-concurrent-systems/)
