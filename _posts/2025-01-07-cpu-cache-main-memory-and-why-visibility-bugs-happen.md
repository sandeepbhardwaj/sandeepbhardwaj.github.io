---
title: CPU Cache Main Memory and Why Visibility Bugs Happen
date: 2025-01-07
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- cpu-cache
- memory
- visibility
- jmm
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: CPU Cache Main Memory and Why Visibility Bugs Happen in Java
seo_description: Learn how CPU caches, main memory, and reordering create visibility
  bugs in Java concurrent code, with practical examples and production guidance.
header:
  overlay_image: "/assets/images/java-concurrency-module-01-foundations-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 1
  show_overlay_excerpt: false
---
Many Java concurrency bugs begin with one wrong assumption:
if one thread updates a variable, another thread will immediately see the new value.

That assumption is unsafe.
Modern hardware and runtimes are optimized around caches, reordering, and delayed visibility.

This post explains why.

---

## Problem Statement

Suppose a background worker loops until a stop flag becomes `false`.
One thread writes the flag.
Another thread reads it.

The code looks harmless:

```java
class Worker {
    boolean running = true;

    void loop() {
        while (running) {
            // do work
        }
    }
}
```

The intuitive expectation is simple:

- thread A writes `running = false`
- thread B sees it and exits

That expectation is not guaranteed without a proper visibility boundary.

---

## Naive Mental Model

The naive model is:

- all threads read and write the same main memory directly

That is not how real execution works.

In reality:

- CPUs use caches
- compilers optimize
- the JIT reorders when allowed
- hardware may delay when writes become visible to other cores

Java code runs on top of that stack.

---

## The Practical Memory Picture

You do not need hardware-engineering depth to write safe Java concurrency code.
But you do need the right high-level model:

- each core may operate on cached data
- writes may not become visible to other threads immediately
- operations may be observed in a different order unless synchronization constrains them

This is why concurrent correctness cannot rely on “it probably updated already.”

It needs a guarantee.

---

## Why Visibility Bugs Happen

Visibility bugs appear when:

- one thread writes shared state
- another thread reads it
- there is no happens-before edge between the two actions

Symptoms:

- stop flags not seen
- stale configuration reads
- partially visible updates
- one thread observing old values far longer than expected

These failures can be rare and timing-sensitive, which makes them expensive to debug.

---

## Runnable Example

This example shows the classic visibility problem shape.

```java
import java.util.concurrent.TimeUnit;

public class VisibilityBugDemo {

    public static void main(String[] args) throws Exception {
        Worker worker = new Worker();

        Thread thread = new Thread(worker::loop, "worker-thread");
        thread.start();

        TimeUnit.SECONDS.sleep(1);
        worker.stop();

        thread.join(2000);
        System.out.println("Worker thread state: " + thread.getState());
    }

    static final class Worker {
        private boolean running = true;

        void loop() {
            long counter = 0;
            while (running) {
                counter++;
            }
            System.out.println("Loop exited after " + counter + " iterations");
        }

        void stop() {
            running = false;
        }
    }
}
```

Important note:
this bug is nondeterministic.
It may reproduce clearly, or it may seem to work depending on machine, JIT behavior, and timing.

That is exactly why visibility bugs are dangerous.

---

## Safe Version

The simplest corrected version uses `volatile`.

```java
import java.util.concurrent.TimeUnit;

public class VisibilitySafeDemo {

    public static void main(String[] args) throws Exception {
        Worker worker = new Worker();

        Thread thread = new Thread(worker::loop, "worker-thread");
        thread.start();

        TimeUnit.SECONDS.sleep(1);
        worker.stop();

        thread.join();
        System.out.println("Worker stopped cleanly");
    }

    static final class Worker {
        private volatile boolean running = true;

        void loop() {
            while (running) {
                // work
            }
        }

        void stop() {
            running = false;
        }
    }
}
```

Here the important improvement is not syntax.
It is the visibility guarantee.

---

## Production-Style Example

A common real version of this bug is dynamic config reload.

Suppose request threads read:

- feature flags
- timeout settings
- rate limits

If a config object is mutated in place without clear publication rules, some threads may see a mixed or stale state.

A safer pattern is:

- build a new immutable config snapshot
- validate it fully
- publish it atomically
- let readers use the published snapshot

That avoids in-place mutation races and visibility ambiguity.

---

## Broken vs Better Config Shape

Broken shape:

```java
class MutableConfig {
    int timeoutMs;
    boolean featureEnabled;
}
```

If multiple fields are changed over time, readers may observe an intermediate state.

Better shape:

```java
import java.util.concurrent.atomic.AtomicReference;

final class ConfigSnapshot {
    final int timeoutMs;
    final boolean featureEnabled;

    ConfigSnapshot(int timeoutMs, boolean featureEnabled) {
        this.timeoutMs = timeoutMs;
        this.featureEnabled = featureEnabled;
    }
}

final class ConfigHolder {
    private final AtomicReference<ConfigSnapshot> current =
            new AtomicReference<>(new ConfigSnapshot(500, false));

    ConfigSnapshot get() {
        return current.get();
    }

    void reload(ConfigSnapshot next) {
        current.set(next);
    }
}
```

This does not solve every concurrency problem, but it eliminates a whole category of partial-visibility bugs.

---

## Failure Modes and Edge Cases

Common mistakes:

- using ordinary booleans for stop flags
- mutating shared objects in place without publication boundaries
- assuming a sleep or log statement makes visibility safe
- mistaking occasional success for correctness

A program that “usually works” can still be memory-visibility broken.

---

## Performance and Trade-Offs

Visibility guarantees are not free, but the alternative is incorrect behavior.

The right design is usually:

- use the weakest primitive that still gives correct guarantees
- avoid unnecessary shared mutable state
- prefer immutable snapshots for read-heavy systems

The goal is not to eliminate every cost.
The goal is to pay the cost where correctness actually requires it.

---

## Testing and Debugging Notes

Visibility bugs are hard to reproduce because timing changes behavior.

Useful tactics:

- run stress loops repeatedly
- avoid trusting a single successful run
- test on different machines when possible
- inspect whether shared flags are volatile or lock-protected
- review whether mutable objects are safely published

If adding logging “fixes” the issue, that usually means timing changed, not the design.

---

## Decision Guide

Ask:

1. can this state be confined to one thread?
2. if not, can it be immutable?
3. if not, what exact visibility guarantee protects it?

Those three questions prevent a large class of early concurrency bugs.

---

## Key Takeaways

- threads do not observe shared state instantly by default
- CPU caches and reordering are part of why visibility bugs exist
- concurrent correctness requires explicit visibility guarantees
- `volatile`, locks, and safe publication exist because “plain field access” is not enough

---

## Next Post

[Introduction to the Java Memory Model for Backend Engineers](/java/concurrency/introduction-to-java-memory-model-backend-engineers/)
