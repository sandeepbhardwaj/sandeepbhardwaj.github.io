---
title: Safe Publication Patterns in Java
date: 2025-02-27
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- safe-publication
- java-memory-model
- visibility
- initialization
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Safe Publication Patterns in Java
seo_description: Learn the main safe publication patterns in Java so objects and
  snapshots become visible to other threads correctly.
header:
  overlay_image: "/assets/images/java-concurrency-module-05-volatile-immutability-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 5
  show_overlay_excerpt: false
---
Creating an object correctly is only part of concurrent correctness.

You also have to publish that object correctly to other threads.

If publication is unsafe, another thread can observe stale or incomplete state even if the constructor itself looked perfectly fine.

That is why safe publication is a separate topic from ordinary object construction.

---

## Problem Statement

Suppose a background thread loads a new routing configuration and stores it in a shared field for request threads to read.

If that reference is exposed without a valid publication guarantee, request threads may observe:

- stale state
- partially established state
- an object that appears ready but is not safely visible across threads

This is a subtle bug because the constructor may still be perfectly correct.

---

## What Safe Publication Means

Safe publication means there is a valid Java Memory Model guarantee that other threads will see the object in a properly established state after it is handed off.

This matters for:

- configuration snapshots
- shared services
- caches
- singleton instances
- immutable values handed across threads

Without safe publication, even “read-only” objects can be observed incorrectly.

---

## Why This Change Was Added

Developers often assume:

- “the object is immutable, so I can share it however I want”

That is incomplete.

Immutability helps a lot, but the reference still needs a safe handoff path.

That is why Java has several publication mechanisms:

- `volatile`
- synchronization
- static initialization
- correctly designed final-field-based construction patterns

The problem is not only mutation.
The problem is cross-thread visibility of established state.

---

## Common Safe Publication Patterns

### 1. Publish through a `volatile` field

```java
class ConfigHolder {
    private volatile AppConfig current;

    void publish(AppConfig config) {
        current = config;
    }

    AppConfig current() {
        return current;
    }
}
```

### 2. Publish through synchronized access

```java
class Holder {
    private AppConfig current;

    synchronized void publish(AppConfig config) {
        current = config;
    }

    synchronized AppConfig current() {
        return current;
    }
}
```

### 3. Publish through static initialization

```java
class ClientRegistry {
    static final PaymentClient CLIENT = new PaymentClient();
}
```

### 4. Publish a properly constructed immutable object as part of another safely published object

These patterns differ mechanically, but they all provide a real visibility guarantee.

---

## Runnable Example

```java
public class SafePublicationDemo {

    public static void main(String[] args) {
        RoutingConfigManager manager = new RoutingConfigManager();

        System.out.println(manager.current().primaryHost());
        manager.reload(new RoutingConfig("payments-b.internal", "payments-c.internal"));
        System.out.println(manager.current().primaryHost());
    }

    static final class RoutingConfig {
        private final String primaryHost;
        private final String fallbackHost;

        RoutingConfig(String primaryHost, String fallbackHost) {
            this.primaryHost = primaryHost;
            this.fallbackHost = fallbackHost;
        }

        String primaryHost() {
            return primaryHost;
        }

        String fallbackHost() {
            return fallbackHost;
        }
    }

    static final class RoutingConfigManager {
        private volatile RoutingConfig current =
                new RoutingConfig("payments-a.internal", "payments-b.internal");

        RoutingConfig current() {
            return current;
        }

        void reload(RoutingConfig newConfig) {
            current = newConfig;
        }
    }
}
```

This is a strong pattern because:

- the reference is safely published
- the object itself is immutable
- readers always see whole snapshots, not partial mutation

---

## Unsafe Patterns to Avoid

- assigning to a plain shared field with no further discipline
- leaking `this` during construction
- publishing a mutable object and then mutating it without coordination
- hiding publication inside race-prone lazy initialization

Safe publication is about both:

- the handoff mechanism
- the design of the object being handed off

---

## Production-Style Guidance

A strong practical pattern is:

1. build an immutable snapshot completely
2. validate it
3. publish it through a `volatile` field or another safe mechanism
4. let readers consume it without further locking

This works extremely well for:

- routing tables
- feature-flag snapshots
- permission snapshots
- pricing configuration

It is one of the most practical concurrency simplifications in backend systems.

---

## Common Mistakes

- assuming constructor correctness alone is enough
- safely publishing a reference but exposing mutable internals behind it
- mixing safe publication with later unsafe mutation
- using lazy initialization patterns with no actual memory-visibility guarantee

Safe publication is not a label you attach after the fact.
It is part of the object's lifecycle design.

---

## Key Takeaways

- Shared objects need a safe handoff path, not just a correct constructor.
- `volatile`, synchronization, static initialization, and final-field-oriented design are common publication tools.
- Immutable snapshots are especially easy to publish safely.
- Unsafe publication can break code that otherwise looks completely reasonable.

Next post: [Final Fields and Initialization Safety in Java](/java/concurrency/final-fields-and-initialization-safety-in-java/)
