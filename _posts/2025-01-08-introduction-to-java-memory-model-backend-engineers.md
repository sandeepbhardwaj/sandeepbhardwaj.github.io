---
title: Introduction to the Java Memory Model for Backend Engineers
date: 2025-01-08
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- jmm
- memory-model
- backend
- multithreading
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Introduction to the Java Memory Model for Backend Engineers
seo_description: Learn the Java Memory Model in practical terms, including visibility,
  ordering, atomicity, and why concurrent Java code needs explicit guarantees.
header:
  overlay_image: "/assets/images/java-concurrency-module-01-foundations-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 1
  show_overlay_excerpt: false
---
The Java Memory Model, or JMM, defines what one thread is allowed to observe about actions performed by another thread.

Without it, concurrent Java code would depend on accidental timing, hardware details, and optimizer behavior.

That is why the JMM is not theory for language designers.
It is a correctness contract for anyone writing multithreaded Java.

---

## Problem Statement

Two threads share state.

One writes:

- a stop flag
- a cached result
- a newly constructed object

The other reads it.

What exactly is guaranteed?

Without a formal model, there is no stable answer.
The JMM gives that answer.

---

## Naive Mental Model

The naive model is:

- if thread A writes first, thread B will read that write later

That is too weak and too informal.

Concurrent Java needs more precise questions:

1. is the write visible?
2. in what order can reads and writes be observed?
3. is a compound action atomic?
4. can another thread see partially constructed state?

The JMM exists to define those boundaries.

---

## The Three Core Ideas

### 1. Atomicity

Can an operation be observed as one indivisible action?

Examples:

- reading a reference is atomic
- incrementing a counter is not automatically atomic

### 2. Visibility

If one thread writes data, when and how can another thread see it?

Without a visibility guarantee, another thread may observe stale values.

### 3. Ordering

Can actions appear in a different order from the source code?

Yes, unless constrained by synchronization semantics.

That means “I assigned it first” is not enough as a concurrency argument.

---

## Why the JMM Matters in Backend Work

In production systems, JMM issues show up as:

- stop signals not observed
- configuration changes appearing inconsistently
- broken lazy initialization
- unsafe publication of mutable caches
- flaky behavior that vanishes under debugging

These are not exotic problems.
They are ordinary engineering failures caused by weak reasoning about visibility and ordering.

---

## Runnable Example

This example shows a common unsafe publication shape.

```java
public class UnsafePublicationDemo {

    private static Holder holder;

    public static void main(String[] args) throws Exception {
        Thread writer = new Thread(() -> holder = new Holder(42, 84), "writer");

        Thread reader = new Thread(() -> {
            while (holder == null) {
                // spin
            }
            System.out.println(holder.a + ", " + holder.b);
        }, "reader");

        reader.start();
        writer.start();

        writer.join();
        reader.join();
    }

    static final class Holder {
        int a;
        int b;

        Holder(int a, int b) {
            this.a = a;
            this.b = b;
        }
    }
}
```

This shape is unsafe because the publication boundary is undefined.
The reader thread may eventually see the reference, but the model does not guarantee clean visibility of the object state without proper synchronization.

---

## Safer Publication Shape

One safer style is immutable construction with an explicit publication edge.

```java
public class SafePublicationDemo {

    private static volatile Holder holder;

    public static void main(String[] args) throws Exception {
        Thread writer = new Thread(() -> holder = new Holder(42, 84), "writer");

        Thread reader = new Thread(() -> {
            while (holder == null) {
                // spin
            }
            System.out.println(holder.a + ", " + holder.b);
        }, "reader");

        reader.start();
        writer.start();

        writer.join();
        reader.join();
    }

    static final class Holder {
        final int a;
        final int b;

        Holder(int a, int b) {
            this.a = a;
            this.b = b;
        }
    }
}
```

This is still a toy shape, but the underlying lesson is real:
state sharing needs a visibility boundary and a safe construction story.

---

## Practical JMM Guarantees You Will Use Often

In normal Java application code, these are the most important happens-before style guarantees:

- unlock happens-before later lock of the same monitor
- volatile write happens-before later volatile read of the same variable
- thread start establishes visibility from starter to started thread
- thread completion and `join` establish visibility back to the joining thread
- properly constructed final fields have stronger initialization safety properties

If you understand those, you can reason about most application-level concurrency code.

---

## Production-Style Example

Consider a configuration reloader:

- reloader thread parses new config
- request threads read current config

Broken design:

- mutate a shared config object field by field

Safer design:

- construct a new immutable config snapshot
- validate it
- publish it through a volatile or atomic reference

That approach is more than stylistic preference.
It is JMM-aware design.

---

## Failure Modes

Common JMM mistakes:

- assuming one write is enough without a visibility edge
- confusing atomic variable access with atomic business operations
- publishing mutable state without synchronization
- relying on test pass rate instead of guarantees

The JMM does not punish code immediately.
It punishes code under the wrong interleaving.

---

## Performance and Trade-Offs

JMM-safe code is not about adding the strongest primitive everywhere.
It is about choosing the right one:

- `volatile` for visibility-only cases
- locking for compound invariants
- immutable snapshots to reduce sharing complexity
- atomics for specific lock-free patterns

The best concurrency design often reduces the need to reason about the JMM directly by reducing shared mutable state.

---

## Testing and Debugging Notes

When reviewing concurrent code, ask:

1. where is shared mutable state?
2. what exact happens-before edge protects it?
3. can another thread observe partially published state?
4. is the code relying on timing instead of guarantees?

Those four questions catch a surprising number of severe concurrency defects.

---

## Decision Guide

You do not need to think about the JMM formally for every line of code.
But you do need to think about it whenever:

- threads share mutable data
- object publication crosses thread boundaries
- you rely on ordering or visibility between threads

If that sounds abstract, good.
The next post makes the most important part concrete: happens-before.

---

## Key Takeaways

- the JMM defines visibility, ordering, and atomicity boundaries in Java concurrency
- correct multithreaded code depends on those guarantees, not on intuition
- safe publication and synchronization are JMM questions, not only style questions

---

## Next Post

[Happens-Before in Java Explained with Practical Examples](/java/concurrency/happens-before-in-java-explained-with-practical-examples/)
