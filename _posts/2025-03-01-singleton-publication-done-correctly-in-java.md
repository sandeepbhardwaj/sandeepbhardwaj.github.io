---
title: Singleton Publication Done Correctly in Java
date: 2025-03-01
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- singleton
- safe-publication
- initialization
- design
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Singleton Publication Done Correctly in Java
seo_description: Learn how to publish singleton instances correctly in Java and
  avoid broken lazy initialization under concurrency.
header:
  overlay_image: "/assets/images/java-concurrency-module-05-volatile-immutability-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 5
  show_overlay_excerpt: false
---
Singletons are often discussed as a design-pattern topic.

In concurrency, the more important question is simpler:

- if one shared instance must exist, how is that instance initialized and published safely?

That is the real problem.

Broken singleton code is usually broken because publication and initialization were treated casually.

---

## Problem Statement

Suppose many request threads call `MetricsRegistry.instance()` during startup pressure.

If lazy initialization is not coordinated correctly:

- multiple instances may be created
- partially initialized state may leak
- different callers may believe they are sharing one object when they are not

This is not a “pattern preference” bug.
It is a correctness bug.

---

## Broken Version

```java
class BrokenSingleton {
    private static BrokenSingleton instance;

    static BrokenSingleton instance() {
        if (instance == null) {
            instance = new BrokenSingleton();
        }
        return instance;
    }
}
```

This is not thread-safe.

Two threads can both observe `instance == null` and both create an instance.

The code often appears to work in light testing, which is why it survives longer than it should.

---

## Runnable Demonstration

```java
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;

public class BrokenSingletonDemo {

    public static void main(String[] args) throws Exception {
        Set<Integer> identities = ConcurrentHashMap.newKeySet();
        CountDownLatch start = new CountDownLatch(1);
        Thread[] threads = new Thread[20];

        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                try {
                    start.await();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }

                BrokenSingleton singleton = BrokenSingleton.instance();
                identities.add(System.identityHashCode(singleton));
            });
            threads[i].start();
        }

        start.countDown();

        for (Thread thread : threads) {
            thread.join();
        }

        System.out.println("Distinct instances observed = " + identities.size());
    }

    static final class BrokenSingleton {
        private static BrokenSingleton instance;

        static BrokenSingleton instance() {
            if (instance == null) {
                instance = new BrokenSingleton();
            }
            return instance;
        }
    }
}
```

This may not fail every run, but it has no correctness guarantee.

That is enough reason to reject it.

---

## Simple Correct Version

```java
class SynchronizedSingleton {
    private static SynchronizedSingleton instance;

    static synchronized SynchronizedSingleton instance() {
        if (instance == null) {
            instance = new SynchronizedSingleton();
        }
        return instance;
    }
}
```

This is correct because one synchronized boundary protects the check and construction.

The common complaint is performance.
In many applications that concern is overstated because singleton access is not the real bottleneck.

---

## Static Holder Pattern

A cleaner lazy option is the initialization-on-demand holder idiom:

```java
class HolderSingleton {
    private HolderSingleton() {
    }

    static HolderSingleton instance() {
        return Holder.INSTANCE;
    }

    private static class Holder {
        private static final HolderSingleton INSTANCE = new HolderSingleton();
    }
}
```

Why this pattern is strong:

- initialization is lazy
- publication is safe
- the code is simple
- there is no handwritten synchronization in the accessor

For many Java applications, this is the most practical singleton pattern.

---

## Enum Singleton

```java
enum MetricsRegistry {
    INSTANCE
}
```

This is also safe and simple when it fits the design.

It is especially appealing when:

- one process-wide instance is truly intended
- you do not need lazy construction beyond class initialization behavior
- the singleton does not need a more elaborate lifecycle story

---

## Production-Style Guidance

Before reaching for a singleton, ask:

- should this really be process-wide
- does this hide mutable global state
- how will this be tested
- would dependency injection make ownership clearer

Many singleton problems are actually global-state problems, not publication problems alone.

Still, when one shared process-wide component is legitimate, publication must be correct.

---

## Common Mistakes

- writing naive lazy initialization because it “works locally”
- overcomplicating singleton access with clever double-checked code when a simpler safe option exists
- using a singleton for mutable state that should instead have scoped ownership
- treating safe construction as optional because the object is “just one instance”

One shared instance can still be one shared bug.

---

## Decision Guide

Use synchronized lazy initialization when:

- you want simple correctness and do not care about accessor synchronization cost

Use the holder idiom when:

- you want lazy creation with a clean and standard Java approach

Use enum singleton when:

- the type is naturally one-instance-per-process and the design is simple enough

Avoid hand-rolled broken laziness in all cases.

---

## Key Takeaways

- Singleton correctness under concurrency is mainly about safe initialization and publication.
- Plain lazy initialization without coordination is broken.
- `synchronized`, the holder idiom, and enum singletons are common correct patterns.
- The simplest correct singleton design is usually better than clever broken laziness.

Next post: [Lock Interface in Java and Why It Exists](/2025/03/02/lock-interface-in-java-and-why-it-exists/)
