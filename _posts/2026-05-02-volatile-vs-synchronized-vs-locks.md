---
categories:
- Java
- Backend
date: 2026-05-02
seo_title: volatile vs synchronized vs Locks in Java
seo_description: Choose the right synchronization primitive in Java based on correctness
  and contention patterns.
tags:
- java
- concurrency
- volatile
- synchronized
- locks
title: volatile vs synchronized vs Locks in Java — Practical Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Choosing the Right Synchronization Primitive
---
Most Java concurrency bugs do not come from forgetting a keyword. They come from choosing a synchronization primitive that does not match the shape of the shared state.

`volatile`, `synchronized`, and explicit locks solve different problems. If you treat them as interchangeable, the code may look disciplined while still leaking races, lost updates, or unnecessary contention.

---

## Start With the Correctness Question

Before comparing APIs, ask what must be true after every update:

- Is this only a visibility flag?
- Is there a read-modify-write step?
- Must multiple fields change together?
- Do callers need timeouts, interruptibility, or fairness?

Those questions usually tell you the answer faster than micro-benchmarking ever will.

---

## A Practical Decision Matrix

### Use `volatile` when:

- one variable represents the whole truth
- readers only need the latest published value
- writes do not depend on the old value

Typical examples:

- shutdown flags
- feature toggles
- latest immutable snapshot reference

### Use `synchronized` when:

- more than one field participates in an invariant
- an operation performs read-modify-write
- the critical section is simple and easy to reason about

Typical examples:

- counters with derived state
- inventory transitions
- balance transfers inside one object

### Use explicit locks when:

- you need `tryLock()` or timed acquisition
- interruption should cancel lock acquisition
- you need multiple conditions or lock orchestration
- you are intentionally trading simplicity for more control

That usually means `ReentrantLock`, and only sometimes a more specialized lock.

---

## `volatile` Gives Visibility, Not Compound Atomicity

This is the mistake teams make most often. `volatile` guarantees that threads see the latest write. It does not make `count++` atomic.

```java
final class UnsafeCounter {
    private volatile int count;

    void increment() {
        count++; // read, add, write
    }

    int current() {
        return count;
    }
}
```

The bug is not subtle:

1. Thread A reads `0`
2. Thread B reads `0`
3. Thread A writes `1`
4. Thread B writes `1`

One increment disappears.

If the operation depends on the previous value, `volatile` alone is not the right primitive.

---

## `synchronized` Is the Best Default for Small Critical Sections

For many code paths, intrinsic locking is still the clearest answer.

```java
final class SafeCounter {
    private int count;

    synchronized void increment() {
        count++;
    }

    synchronized int current() {
        return count;
    }
}
```

This gives you both:

- mutual exclusion
- happens-before visibility between unlock and the next lock acquisition

That combination is often exactly what application code needs.

> [!TIP]
> If the protected code is short, local, and easy to explain, `synchronized` is usually the right starting point. Do not reach for more advanced locking just because it feels more "production-grade."

---

## When `ReentrantLock` Actually Helps

Explicit locks earn their complexity only when the API surface matters to the design.

```java
final class InventoryService {
    private final ReentrantLock lock = new ReentrantLock();
    private int availableUnits;

    boolean reserve(int units) throws InterruptedException {
        if (!lock.tryLock(50, TimeUnit.MILLISECONDS)) {
            return false;
        }

        try {
            if (availableUnits < units) {
                return false;
            }
            availableUnits -= units;
            return true;
        } finally {
            lock.unlock();
        }
    }
}
```

Here the value is not raw speed. The value is that the service can:

- fail fast under contention
- avoid waiting forever
- participate in cancellation-aware flows

Those are architectural behaviors, not stylistic preferences.

---

## A Real Example: Inventory State Needs One Atomic Boundary

Imagine an inventory object with:

- `available`
- `reserved`
- `sold`

If those numbers move together, the correctness rule is simple: all transitions must happen under one atomic boundary.

`volatile` fields cannot preserve that invariant. You may see the latest values, but you cannot guarantee they were updated as one coherent state transition.

```java
final class InventoryState {
    private int available;
    private int reserved;
    private int sold;

    synchronized boolean reserve(int units) {
        if (available < units) {
            return false;
        }

        available -= units;
        reserved += units;
        return true;
    }

    synchronized void markSold(int units) {
        reserved -= units;
        sold += units;
    }
}
```

This is the right mental model:

- state transitions are protected together
- reads outside the lock should use a snapshot or accessor
- expensive work happens after the state transition, not while the lock is held

---

## Contention Problems Usually Come From Lock Scope, Not Lock Type

Teams often blame `synchronized` when the real issue is broader:

- doing I/O while holding the lock
- calling downstream services inside the critical section
- protecting too much unrelated state with one lock

If p95 or p99 latency is climbing, look at lock hold time first.

That usually means:

1. reduce work inside the critical section
2. isolate the state that truly needs the same lock
3. move logging, network calls, and serialization outside the lock

Changing primitives without changing lock scope rarely fixes the real bottleneck.

---

## Fast Selection Heuristic

Use this in design reviews:

- Need a visibility flag or an immutable snapshot reference? `volatile`
- Need an atomic state transition? `synchronized`
- Need timed acquisition, interruptibility, or explicit lock orchestration? `ReentrantLock`

The simplest primitive that preserves correctness is usually the best one.

---

## Production Review Checklist

- Can you name the exact state protected by this primitive?
- Does any operation depend on the previous value?
- Do multiple fields have to change together?
- Is the critical section free of remote calls and blocking I/O?
- If using explicit locks, is there a clear reason beyond preference?

If the answer to the last question is "not really," simplify.

---

## Key Takeaways

- `volatile` is for visibility and publication, not compound updates.
- `synchronized` remains the safest default for simple shared-state protection.
- `ReentrantLock` is valuable when the coordination semantics justify the extra complexity.
- Most performance problems come from lock scope and contention, not from choosing the "wrong" keyword.
