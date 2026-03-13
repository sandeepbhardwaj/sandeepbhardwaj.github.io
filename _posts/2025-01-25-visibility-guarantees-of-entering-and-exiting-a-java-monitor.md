---
title: Visibility Guarantees of Entering and Exiting a Java Monitor
date: 2025-01-25
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- visibility
- synchronized
- monitor
- happens-before
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Visibility Guarantees of Entering and Exiting a Java Monitor
seo_description: Learn the visibility guarantees of entering and exiting a Java
  monitor, and why synchronized is about visibility as well as mutual exclusion.
header:
  overlay_image: "/assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 3
  show_overlay_excerpt: false
---
Many developers think `synchronized` is only about “one thread at a time.”
That is incomplete.

`synchronized` also creates visibility boundaries.
Those boundaries are one of the reasons it fixes bugs that plain field access does not.

---

## Problem Statement

Suppose thread A updates shared state inside a synchronized block.
Later, thread B enters a synchronized block guarded by the same monitor.

Can thread B safely observe what thread A wrote?

Yes.
That is one of the key guarantees monitor entry and exit provide.

---

## Why This Matters

If `synchronized` only gave mutual exclusion, it would still leave visibility problems:

- thread A updates a field
- exits the critical section
- thread B enters later but still somehow sees stale data

That would make monitor-based coordination unreliable.

Java avoids that by tying visibility to monitor boundaries:

- unlock on a monitor happens-before a later lock on the same monitor

That is the practical rule.

---

## Broken Shape Without Proper Visibility

```java
class ConfigState {
    private boolean ready;
    private int timeoutMs;

    void publish(int timeoutMs) {
        this.timeoutMs = timeoutMs;
        this.ready = true;
    }

    int readTimeoutIfReady() {
        if (ready) {
            return timeoutMs;
        }
        return -1;
    }
}
```

This code has no proper synchronization boundary.
Another thread may observe inconsistent or stale state.

---

## Safe Version with the Same Monitor

```java
class ConfigState {
    private boolean ready;
    private int timeoutMs;

    synchronized void publish(int timeoutMs) {
        this.timeoutMs = timeoutMs;
        this.ready = true;
    }

    synchronized int readTimeoutIfReady() {
        if (ready) {
            return timeoutMs;
        }
        return -1;
    }
}
```

Now the same monitor governs both publication and reading.

This gives:

- mutual exclusion for the protected operations
- visibility of earlier writes across monitor exit and later monitor entry

That second point is the focus here.

---

## Runnable Example

```java
public class MonitorVisibilityDemo {

    public static void main(String[] args) throws Exception {
        SharedConfig config = new SharedConfig();

        Thread writer = new Thread(() -> config.publish(1500), "writer");
        Thread reader = new Thread(() -> {
            int timeout = config.readTimeoutIfReady();
            System.out.println("Observed timeout = " + timeout);
        }, "reader");

        writer.start();
        writer.join();
        reader.start();
        reader.join();
    }

    static final class SharedConfig {
        private boolean ready;
        private int timeoutMs;

        synchronized void publish(int timeoutMs) {
            this.timeoutMs = timeoutMs;
            this.ready = true;
        }

        synchronized int readTimeoutIfReady() {
            if (ready) {
                return timeoutMs;
            }
            return -1;
        }
    }
}
```

The important reasoning is:

- writer exits the monitor after publication
- reader later enters the same monitor
- the reader sees the properly published state through the same synchronization boundary

---

## Production-Style Example

Imagine an in-memory feature-flag holder:

- admin thread updates flag rules
- request threads read current rule set

If both use the same synchronized boundary, readers observe a consistent and visible state through monitor handoff.

If updates happen under a monitor but reads do not, the visibility guarantee is broken.

This is why “some writes are synchronized” is not enough.
The full access discipline matters.

---

## Where Teams Get This Wrong

Common mistakes:

- writing under a lock but reading outside it
- protecting different fields with different monitors even though they form one publication boundary
- assuming synchronized methods automatically help code paths that do not use the same monitor

The rule is strict:

- visibility guarantee is tied to the same monitor relationship

No shared monitor, no shared guarantee.

---

## Performance and Trade-Offs

Monitor-based visibility is strong and simple, but it comes with locking cost.

If you only need visibility for a simple flag, `volatile` may be enough.
If you need atomic multi-field invariants and visibility together, monitor-based locking is often the right choice.

This is why concurrency design is about matching guarantee strength to the real problem.

---

## Testing and Debugging Notes

Review questions:

1. do writers and readers use the same monitor?
2. are all relevant fields published within the same boundary?
3. is any code path reading shared state outside the lock discipline?

These questions catch visibility holes that otherwise survive for a long time.

---

## Decision Guide

Use synchronized monitor boundaries when:

- multiple related fields need visible and consistent publication
- readers and writers can follow the same locking rule

Prefer simpler visibility tools only when:

- the state shape truly allows it

Do not weaken the guarantee without a clear reason.

---

## Key Takeaways

- monitor entry and exit provide visibility guarantees, not only exclusion
- unlock on a monitor happens-before a later lock on the same monitor
- synchronized reads and writes must use the same monitor to benefit from that guarantee

---

## Next Post

[Reentrancy of Intrinsic Locks in Java](/java/concurrency/reentrancy-of-intrinsic-locks-in-java/)
