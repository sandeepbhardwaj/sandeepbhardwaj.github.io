---
title: Happens-Before in Java Explained with Practical Examples
date: 2025-01-09
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- happens-before
- jmm
- visibility
- ordering
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Happens-Before in Java Explained with Practical Examples
seo_description: Learn happens-before in Java with practical examples covering visibility,
  ordering, volatile, locks, thread start, and join semantics.
header:
  overlay_image: "/assets/images/java-concurrency-module-01-foundations-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 1
  show_overlay_excerpt: false
---
If you remember only one formal concurrency concept from the Java Memory Model, remember happens-before.

It is the rule that turns “I think another thread should see this” into “the model guarantees another thread can see this.”

---

## Problem Statement

Suppose thread A:

- updates shared state
- then sets a signal

Thread B sees the signal.
Can it safely assume the state update is also visible?

Without a happens-before edge, not necessarily.

That is the whole point.

---

## Naive Mental Model

The naive model is:

- if A did it earlier in source code, B sees it later

That is not a safe concurrency rule.

Happens-before is stronger.
It says:

- if action A happens-before action B, then B is guaranteed to observe the effects of A in the required visibility and ordering sense

This is the practical bridge between synchronization and reasoning.

---

## Why Happens-Before Matters

You rarely debug concurrency at the level of CPU caches directly.
You debug it by asking:

- what synchronization exists?
- what does that synchronization guarantee?
- is there a happens-before edge between the writer and the reader?

If the answer is no, your code is relying on timing.

---

## Common Happens-Before Sources

The most important ones for application code are:

- monitor unlock -> later lock on the same monitor
- volatile write -> later volatile read of the same variable
- actions before `Thread.start()` -> actions inside the started thread
- actions in a thread before completion -> actions after another thread successfully `join()`s it

These are the edges you will use repeatedly in real Java code.

---

## Runnable Example: Volatile Signal

```java
public class HappensBeforeVolatileDemo {

    private static int data;
    private static volatile boolean ready;

    public static void main(String[] args) throws Exception {
        Thread writer = new Thread(() -> {
            data = 42;
            ready = true;
        }, "writer");

        Thread reader = new Thread(() -> {
            while (!ready) {
                // wait
            }
            System.out.println("Observed data = " + data);
        }, "reader");

        reader.start();
        writer.start();

        writer.join();
        reader.join();
    }
}
```

Why this works:

- the write to `ready` is volatile
- the later read of `ready` is volatile
- that establishes a happens-before edge
- once the reader sees `ready == true`, it can also safely observe the earlier write to `data`

This is one of the most important visibility patterns in Java.

---

## Runnable Example: join as a Visibility Boundary

```java
public class HappensBeforeJoinDemo {

    private static int result;

    public static void main(String[] args) throws Exception {
        Thread worker = new Thread(() -> result = 99, "worker");

        worker.start();
        worker.join();

        System.out.println("Result after join = " + result);
    }
}
```

Why this works:

- the worker’s actions before completion happen-before the main thread continues after `join`

That means `join` is not only waiting.
It is also a visibility boundary.

---

## Broken Shape Without a Real Edge

```java
public class BrokenSignalDemo {

    private static int data;
    private static boolean ready;

    public static void main(String[] args) throws Exception {
        Thread writer = new Thread(() -> {
            data = 42;
            ready = true;
        });

        Thread reader = new Thread(() -> {
            while (!ready) {
                // spin
            }
            System.out.println(data);
        });

        reader.start();
        writer.start();
    }
}
```

Why this is unsafe:

- there is no guaranteed happens-before edge between the writer’s plain writes and the reader’s plain reads

It may work.
That is not the same as being correct.

---

## Production-Style Example

Imagine a cache refresher thread:

1. loads latest pricing rules
2. validates them
3. publishes the new snapshot

Request threads then:

1. read the published reference
2. make pricing decisions

The key design question is:
what publication step creates the happens-before edge?

Good answers:

- volatile reference write
- atomic reference set
- publishing under a lock and reading under the same lock

Bad answer:

- “the refresher runs first most of the time”

That is timing, not correctness.

---

## Performance and Trade-Offs

Happens-before is not a separate API.
It is a property created by correct synchronization.

That means performance questions become design questions:

- do you need a lock because multiple variables must move together?
- is a volatile signal enough because only visibility matters?
- can immutable snapshots reduce the synchronization surface?

Good concurrency design is often just good happens-before design.

---

## Testing and Debugging Notes

In code reviews, try asking:

1. where is the writer?
2. where is the reader?
3. what exact happens-before edge connects them?

If nobody can answer, the code is probably relying on luck.

This question is so useful that it should become a habit.

---

## Decision Guide

- use volatile when you need a simple visibility edge
- use locks when several operations must become visible as one protected critical section
- use `join` and task completion boundaries intentionally, not accidentally

The core idea stays the same:
concurrent correctness needs an explicit edge.

---

## Key Takeaways

- happens-before is the practical visibility and ordering rule in Java concurrency
- without it, shared-state reasoning is unreliable
- volatile, locks, start, and join all matter because they create happens-before edges

---

## Next Post

[Atomicity Visibility and Ordering in Java Concurrency](/java/concurrency/atomicity-visibility-ordering-java-concurrency/)
