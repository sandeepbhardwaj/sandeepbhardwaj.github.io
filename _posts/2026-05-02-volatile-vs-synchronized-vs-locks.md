---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-02
seo_title: "volatile vs synchronized vs Locks in Java"
seo_description: "Choose the right synchronization primitive in Java based on correctness and contention patterns."
tags: [java, concurrency, volatile, synchronized, locks]
canonical_url: "https://sandeepbhardwaj.github.io/java/volatile-vs-synchronized-vs-locks/"
title: "volatile vs synchronized vs Locks in Java — Practical Guide"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Choosing the Right Synchronization Primitive"
---

# volatile vs synchronized vs Locks in Java — Practical Guide

Choosing the wrong synchronization primitive creates either hidden race bugs or unnecessary latency.
This guide gives a decision framework you can apply quickly in production code.

---

## Decision Matrix

- Use `volatile` when:
  - single variable state
  - no compound invariants
  - no read-modify-write logic
- Use `synchronized` when:
  - you need mutual exclusion + visibility
  - lock scope is small and simple
  - intrinsic monitor semantics are enough
- Use `ReentrantLock` / advanced locks when:
  - tryLock, timed lock, fairness, interruptible lock needed
  - explicit lock orchestration required

---

## Correctness Rule of Thumb

If multiple variables must change together atomically, `volatile` alone is insufficient.
Use a lock or redesign state ownership.

---

## Example: Why volatile Is Not Enough

```java
class UnsafeCounter {
    volatile int count = 0;

    void inc() {
        count++; // read + add + write is not atomic
    }
}
```

Correct lock-based variant:

```java
class SafeCounter {
    private int count;

    synchronized void inc() {
        count++;
    }

    synchronized int get() {
        return count;
    }
}
```

Dry interleaving:

- `count=0`
- Thread A reads `0`
- Thread B reads `0`
- A writes `1`
- B writes `1`

Expected `2`, actual `1` (lost update).

---

## Advanced Lock Example

```java
class Inventory {
    private final ReentrantLock lock = new ReentrantLock();
    private int units;

    boolean reserve(int n) {
        lock.lock();
        try {
            if (units < n) return false;
            units -= n;
            return true;
        } finally {
            lock.unlock();
        }
    }
}
```

---

## Performance and Operational Notes

- lock contention shows up as increased p95/p99 latency.
- lock hold time matters more than lock type in many systems.
- avoid synchronizing on broad shared objects.
- profile before replacing synchronized with complex lock APIs.

---

## Key Takeaways

- `volatile` is visibility/order, not compound atomicity.
- `synchronized` is the safest default for simple critical sections.
- explicit locks are for advanced coordination, not premature optimization.

---

## Practical Decision Checklist

Use this quick checklist during design reviews:

- if writes are independent and single-variable, start with `volatile`
- if operations update multiple fields together, use `synchronized`
- if you need timeout, interruptible waits, or multiple conditions, use `ReentrantLock`
- if contention is high, optimize critical section length before changing primitives

```java
if (!lock.tryLock(50, TimeUnit.MILLISECONDS)) {
    throw new ServiceUnavailableException("inventory subsystem busy");
}
```

---

## Case Study: Inventory Reservation Consistency

If `available`, `reserved`, and `sold` move together, you need one atomic update boundary.
`volatile` fields cannot preserve this invariant.

A practical approach:

1. guard all state transitions under one lock
2. expose read-only snapshots outside lock
3. track lock hold time and contention metrics
4. move expensive I/O outside critical section

Correctness first, then contention optimization.

---

## Fast Selection Heuristic

- Need only visibility flag? `volatile`
- Need atomic read-modify-write? `synchronized` or lock
- Need timed/interruptible acquisition or multiple conditions? `ReentrantLock`

Use the simplest primitive that preserves correctness; complexity should be justified by coordination requirements.
