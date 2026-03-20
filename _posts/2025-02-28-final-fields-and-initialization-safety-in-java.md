---
title: Final Fields and Initialization Safety in Java
date: 2025-02-28
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- final-fields
- initialization-safety
- java-memory-model
- immutability
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Final Fields and Initialization Safety in Java
seo_description: Learn how final fields support initialization safety in Java
  and why they matter for immutable objects and concurrent sharing.
header:
  overlay_image: "/assets/images/java-concurrency-module-05-volatile-immutability-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 5
  show_overlay_excerpt: false
---
`final` fields matter for more than preventing reassignment.

They are also part of Java's concurrency story because they help establish initialization safety for properly constructed objects.

That is one reason immutable objects are so attractive in concurrent systems.

---

## Problem Statement

Suppose a configuration object is created on one thread and then shared with many request threads.

If that object is:

- properly constructed
- uses `final` fields for its stable state
- safely published

then readers can reason about it much more confidently than they can about a mutable object with setter-based initialization.

The details matter because partially established object state is a real concurrency hazard.

---

## What Initialization Safety Means

Initialization safety is the idea that correctly constructed objects with `final` fields have stronger guarantees around the visibility of that initialized state.

In practical terms, `final` fields help by making the object model simpler:

- the constructor establishes the state once
- the state is not supposed to change later
- readers do not race with setter-based mutation

This does not mean `final` solves every concurrency problem.
It means the model is much easier to publish and share safely.

---

## Example

```java
final class PaymentEndpointConfig {
    private final String baseUrl;
    private final int connectTimeoutMillis;
    private final int readTimeoutMillis;

    PaymentEndpointConfig(String baseUrl,
                          int connectTimeoutMillis,
                          int readTimeoutMillis) {
        this.baseUrl = baseUrl;
        this.connectTimeoutMillis = connectTimeoutMillis;
        this.readTimeoutMillis = readTimeoutMillis;
    }

    String baseUrl() {
        return baseUrl;
    }

    int connectTimeoutMillis() {
        return connectTimeoutMillis;
    }

    int readTimeoutMillis() {
        return readTimeoutMillis;
    }
}
```

This class is easier to reason about concurrently because its core state is established in one place and does not later change.

---

## Runnable Example

```java
public class FinalFieldsDemo {

    public static void main(String[] args) {
        PaymentEndpointConfig config =
                new PaymentEndpointConfig("https://payments.internal", 500, 1000);

        System.out.println(config.baseUrl());
        System.out.println(config.connectTimeoutMillis());
        System.out.println(config.readTimeoutMillis());
    }

    static final class PaymentEndpointConfig {
        private final String baseUrl;
        private final int connectTimeoutMillis;
        private final int readTimeoutMillis;

        PaymentEndpointConfig(String baseUrl,
                              int connectTimeoutMillis,
                              int readTimeoutMillis) {
            this.baseUrl = baseUrl;
            this.connectTimeoutMillis = connectTimeoutMillis;
            this.readTimeoutMillis = readTimeoutMillis;
        }

        String baseUrl() {
            return baseUrl;
        }

        int connectTimeoutMillis() {
            return connectTimeoutMillis;
        }

        int readTimeoutMillis() {
            return readTimeoutMillis;
        }
    }
}
```

The example is intentionally simple because the important lesson is conceptual:

- constructor establishes state
- fields are final
- object is naturally suited to immutable snapshot sharing

---

## Why This Change Was Added

Without `final`, developers often end up with objects that are built in pieces:

- constructor sets some fields
- setters fill the rest
- another thread may see the object too early

That shape is fragile.

`final` pushes object design toward:

- complete construction
- one-time assignment
- clearer invariants

This is not just cleaner code.
It directly improves concurrent reasoning.

---

## Important Caveats

`final` does not magically fix everything.

It does not fix:

- leaking `this` during construction
- unsafe publication of the reference
- mutable internals reachable through final references

For example:

```java
final class BrokenOrderSnapshot {
    private final java.util.List<String> itemIds;

    BrokenOrderSnapshot(java.util.List<String> itemIds) {
        this.itemIds = itemIds;
    }
}
```

The reference is final, but the list may still be mutated elsewhere.

So the real design rule is:

- final fields help
- immutable internals help
- safe publication still matters

---

## Production-Style Guidance

Use `final` aggressively for:

- value objects
- configuration snapshots
- constructor-injected dependencies
- request-scoped models
- state that should never change after creation

This improves:

- correctness
- readability
- testability
- concurrent safety reasoning

In most backend code, if a field should not vary after construction, make that explicit with `final`.

---

## Common Mistakes

- assuming `final` on a reference makes the whole reachable object graph immutable
- exposing mutable internals directly
- mixing `final` fields with constructor escape bugs
- using setter-based initialization for objects that should really be complete at creation time

The main win from `final` comes when the object design itself respects snapshot-style construction.

---

## Key Takeaways

- `final` fields help establish stable object state during construction.
- They are a major foundation for effective immutability in Java.
- They do not eliminate the need for safe publication or protection from mutable internals.
- In concurrent systems, complete construction plus `final` fields is usually a much stronger design than piecemeal initialization.

Next post: [Singleton Publication Done Correctly in Java](/java/concurrency/singleton-publication-done-correctly-in-java/)
