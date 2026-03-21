---
title: AtomicInteger AtomicLong AtomicBoolean and AtomicReference in Java
date: 2025-03-17
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- atomicinteger
- atomiclong
- atomicboolean
- atomicreference
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: AtomicInteger AtomicLong AtomicBoolean and AtomicReference in Java
seo_description: Learn when to use AtomicInteger, AtomicLong, AtomicBoolean,
  and AtomicReference in Java for counters, flags, and snapshot references.
header:
  overlay_image: "/assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 7
  show_overlay_excerpt: false
---
These four atomic types cover a large percentage of practical application-level atomic use cases.

They map cleanly to common needs:

- integer counters
- long-running sequence values
- boolean state flags
- references to immutable objects

The trick is knowing where each one belongs and where it does not.

---

## Problem Statement

Consider a backend service that needs to track:

- how many workers are active
- the next job ID
- whether the instance is draining
- the latest immutable routing config

These are all shared values, but they are not the same kind of shared value.
Choosing the right atomic type keeps the code direct.

---

## Runnable Example

```java
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

public class CoreAtomicsDemo {

    public static void main(String[] args) {
        WorkerPoolControl control = new WorkerPoolControl();

        System.out.println("Job " + control.nextJobId());
        control.workerStarted();
        control.workerStarted();
        System.out.println("Active workers = " + control.activeWorkers());

        control.updateConfig(new ConfigSnapshot("payments-v2"));
        System.out.println("Config = " + control.currentConfig().name());

        control.startDraining();
        System.out.println("Draining = " + control.isDraining());
    }

    static final class WorkerPoolControl {
        private final AtomicInteger activeWorkers = new AtomicInteger();
        private final AtomicLong nextJobId = new AtomicLong(1);
        private final AtomicBoolean draining = new AtomicBoolean(false);
        private final AtomicReference<ConfigSnapshot> config =
                new AtomicReference<>(new ConfigSnapshot("payments-v1"));

        void workerStarted() {
            activeWorkers.incrementAndGet();
        }

        int activeWorkers() {
            return activeWorkers.get();
        }

        long nextJobId() {
            return nextJobId.getAndIncrement();
        }

        void startDraining() {
            draining.set(true);
        }

        boolean isDraining() {
            return draining.get();
        }

        void updateConfig(ConfigSnapshot snapshot) {
            config.set(snapshot);
        }

        ConfigSnapshot currentConfig() {
            return config.get();
        }
    }

    record ConfigSnapshot(String name) {
    }
}
```

Each field has one clear meaning and one clear atomic boundary.

That is why this works well.

---

## When to Use Each Type

Use `AtomicInteger` for:

- small counters
- in-flight request tracking
- retry counts

Use `AtomicLong` for:

- IDs
- totals that may grow large
- version numbers

Use `AtomicBoolean` for:

- started or stopped flags
- one-time transitions
- lifecycle gates

Use `AtomicReference` for:

- immutable configuration snapshots
- pointers to current strategy objects
- reference swaps guarded by compare-and-set

---

## Common Mistakes

These types are simple, but misuses are common:

- using atomics for several fields that really form one invariant
- storing mutable objects in `AtomicReference` and then mutating them in place
- assuming `AtomicBoolean` alone can model a full workflow
- choosing `AtomicInteger` for a hot counter when `LongAdder` would scale better

The hardest bug is usually not syntax.
It is drawing the wrong boundary around the state.

---

## Practical Design Rule

If the shared truth can be described as one independently meaningful variable, an atomic type is often a strong fit.

If the real rule is:

- many fields must change together
- several checks and writes belong in one decision

then an atomic field is often too small a tool for the job.

---

## Choosing the Type by State Shape

A useful selection rule is to choose the atomic type based on what the shared state actually represents.

Use `AtomicInteger` or `AtomicLong` when the value is fundamentally numeric:

- counters
- sequence numbers
- retry budgets
- rolling timestamps or versions

Use `AtomicBoolean` when the whole question is a binary gate:

- has startup completed
- has shutdown begun
- should workers keep running

Use `AtomicReference<T>` when the real shared state is an immutable object snapshot.
That is often the most powerful pattern in application code because it lets you keep complex state off to the side in an immutable value while the atomic reference handles publication and replacement.

## Production Patterns

The most maintainable production uses are usually the boring ones.
Examples include:

- swapping the current configuration snapshot after a refresh finishes
- exposing a shutdown flag checked by worker loops
- tracking last processed offset or sequence number
- implementing an idempotent one-time transition such as "open" to "closed"

These patterns work because readers can understand them in one sentence.
If your `AtomicReference` starts carrying mutable objects that are then modified after publication, you lose most of the benefit.
The cleaner pattern is:

1. build a new immutable value off-thread
2. validate it
3. atomically replace the current reference
4. let readers observe either old or new, but never a partial mix

## Testing and Review Notes

For these atomic types, many failures come from surrounding assumptions rather than the atomic operation itself.
Review for questions like:

- is `AtomicBoolean` being used where a broader lifecycle lock is actually needed
- does the numeric counter need exact snapshots or only eventual totals
- is `AtomicReference` pointing to immutable state, or to something still being mutated elsewhere
- are callers depending on several reads staying consistent with one another

Tests should include repeated concurrent reads and writes plus clear assertions about what outcomes are allowed.
For example, a snapshot-swap test should allow readers to see either version A or version B, but should never allow them to see a half-updated combination derived from both.

## Second Example: One-Time Transition with AtomicBoolean

A second scenario worth seeing is a one-time transition where only the first caller should win.
That is where `compareAndSet` on `AtomicBoolean` becomes more meaningful than a plain `set(true)`.

```java
import java.util.concurrent.atomic.AtomicBoolean;

public class DrainSwitchDemo {

    public static void main(String[] args) {
        DrainSwitch drainSwitch = new DrainSwitch();

        System.out.println(drainSwitch.beginDrain());
        System.out.println(drainSwitch.beginDrain());
    }

    static final class DrainSwitch {
        private final AtomicBoolean draining = new AtomicBoolean(false);

        boolean beginDrain() {
            return draining.compareAndSet(false, true);
        }
    }
}
```

Only the first caller transitions the service into draining mode.
That is a different use case from counters or snapshot references, and it helps show why atomic type choice follows state meaning.

## Key Takeaways

- `AtomicInteger`, `AtomicLong`, `AtomicBoolean`, and `AtomicReference` cover most practical single-variable atomic needs.
- Pick the type that matches the actual meaning of the shared state.
- `AtomicReference` is especially useful for immutable snapshot replacement.
- Once the invariant spans several fields, move beyond a single atomic variable.

Next post: [Compare And Set and CAS Loops in Java](/java/concurrency/compare-and-set-and-cas-loops-in-java/)
