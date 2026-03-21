---
title: Unsafe Publication in Java and How Objects Leak Broken State
date: 2025-02-09
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- unsafe-publication
- object-publication
- java-memory-model
- visibility
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Unsafe Publication in Java and How Objects Leak Broken State
seo_description: Learn unsafe publication in Java, why partially initialized
  objects leak across threads, and how to publish state safely.
header:
  overlay_image: "/assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 4
  show_overlay_excerpt: false
---
Not every concurrency bug looks like two threads fighting over a counter.

Sometimes the bug is that one thread exposes an object to another thread before publication is safe.

Then another thread observes stale, incomplete, or inconsistent state.

---

## Problem Statement

Suppose an application creates a configuration object and stores it in a shared field so request threads can use it.

If that reference becomes visible without proper publication guarantees, request threads may observe an object state that was not safely established for cross-thread use.

This is unsafe publication.

---

## Naive Version

```java
class ConfigHolder {
    private AppConfig config;

    void initialize() {
        config = new AppConfig("https://payments.internal", 3);
    }

    AppConfig config() {
        return config;
    }
}

class AppConfig {
    private final String endpoint;
    private final int retries;

    AppConfig(String endpoint, int retries) {
        this.endpoint = endpoint;
        this.retries = retries;
    }
}
```

This code may look fine because the object is assigned only once.

The problem is not only mutation.
The problem is whether other threads are guaranteed to see the fully constructed object through a safe publication path.

---

## Why Unsafe Publication Matters

When an object is published unsafely, another thread can observe:

- stale field values
- default values
- inconsistent combinations of fields
- a reference before all intended state has been reliably visible

These failures are hard to diagnose because the constructor itself can still look correct.

---

## Runnable Example

```java
import java.util.concurrent.TimeUnit;

public class UnsafePublicationDemo {

    public static void main(String[] args) throws Exception {
        ConfigRegistry registry = new ConfigRegistry();

        Thread publisher = new Thread(registry::initialize, "config-publisher");
        Thread reader = new Thread(() -> {
            while (registry.current() == null) {
                Thread.yield();
            }

            AppConfig config = registry.current();
            System.out.println("endpoint = " + config.endpoint);
            System.out.println("retries  = " + config.retries);
        }, "config-reader");

        reader.start();
        TimeUnit.MILLISECONDS.sleep(100);
        publisher.start();

        publisher.join();
        reader.join();
    }

    static final class ConfigRegistry {
        private AppConfig current;

        void initialize() {
            current = new AppConfig("https://payments.internal", 3);
        }

        AppConfig current() {
            return current;
        }
    }

    static final class AppConfig {
        private final String endpoint;
        private final int retries;

        AppConfig(String endpoint, int retries) {
            this.endpoint = endpoint;
            this.retries = retries;
        }
    }
}
```

This specific program may appear to work.
That does not make it safe.

Unsafe publication bugs are defined by missing guarantees, not by guaranteed visible failure on every run.

---

## Production-Style Scenarios

Unsafe publication appears in code like:

- lazily initialized singleton helpers
- config snapshots swapped into shared fields
- caches storing mutable values without publication discipline
- listeners receiving references to objects still under construction
- registries exposing services before startup finishes

A service can pass tests and still occasionally serve requests with partially visible state after deployment pressure changes timing.

---

## Safe Publication Options

Correct publication paths include:

- storing the reference into a `volatile` field
- publishing through a `final` field during proper construction
- publishing through a lock-protected handoff
- using static initialization
- publishing via thread-safe containers with the right surrounding discipline

The publication mechanism matters as much as the object itself.

---

## Fix with `volatile`

```java
class SafeConfigRegistry {
    private volatile AppConfig current;

    void initialize() {
        current = new AppConfig("https://payments.internal", 3);
    }

    AppConfig current() {
        return current;
    }
}
```

This is a strong option for immutable configuration snapshots.

The object should ideally remain immutable after publication.

---

## Fix with Synchronized Access

```java
class LockedConfigRegistry {
    private AppConfig current;

    synchronized void initialize() {
        current = new AppConfig("https://payments.internal", 3);
    }

    synchronized AppConfig current() {
        return current;
    }
}
```

This also creates a valid happens-before relationship between publication and later reads.

---

## Immutability Makes Publication Easier

Unsafe publication becomes much more dangerous when the published object is mutable.

An immutable object with properly set `final` fields is easier to reason about because:

- there is no later mutation to coordinate
- readers cannot observe mid-update state
- snapshots can be replaced wholesale

This is why immutable configuration objects are such a strong pattern for concurrent systems.

---

## Common Mistakes

- assigning to a plain shared field and assuming “write once” means safe
- publishing a mutable object and letting readers use it without coordination
- mixing safe publication of the reference with unsafe mutation of the object after publication
- leaking references during initialization

That last category is important enough to deserve its own article.

---

## Key Takeaways

- Unsafe publication means an object reference becomes visible to other threads without the required memory-visibility guarantees.
- The bug is about how the object crosses threads, not only about whether fields are mutable.
- `volatile`, synchronization, static initialization, and immutable snapshots are common safe-publication tools.
- Publishing a reference safely does not automatically make later mutation safe.

Next post: [Escaping this During Construction in Java](/java/concurrency/escaping-this-during-construction-in-java/)
