---
title: Binary Semaphore vs Counting Semaphore in Java
date: 2025-04-02
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- semaphore
- binary-semaphore
- counting-semaphore
- locking
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Binary Semaphore vs Counting Semaphore in Java
seo_description: Learn the difference between binary and counting semaphores in
  Java, and why a binary semaphore is not the same thing as a lock.
header:
  overlay_image: "/assets/images/java-concurrency-module-08-coordination-utilities-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 8
  show_overlay_excerpt: false
---
Semaphores come in two broad conceptual forms:

- binary
- counting

The difference is simple on paper:

- binary semaphore: at most one permit
- counting semaphore: several permits

In practice, the more important distinction is what developers infer incorrectly from the binary case.

A binary semaphore may allow only one concurrent entrant, but it is still not the same thing as a lock.

---

## Binary Semaphore

A binary semaphore has one permit.

That means:

- one thread can acquire it
- everyone else waits until it is released

This sounds similar to a mutex.
But semaphores do not express ownership in the same way locks do.

That difference affects how you reason about correctness.

---

## Counting Semaphore

A counting semaphore has N permits.

That means:

- up to N concurrent holders may proceed
- callers beyond N must wait or fail to acquire

This is the common form used for:

- bounded connection access
- concurrency caps
- slot management

The counting case is the more obviously "permit-oriented" use.

---

## Why Binary Semaphore Is Not Just a Lock

This is the key conceptual warning.

A lock usually implies:

- ownership by the acquiring thread
- structured critical-section discipline
- unlock by the owning thread

A semaphore does not encode the same ownership contract.
It models permit availability.

That means a binary semaphore can coordinate one-at-a-time access, but it should not automatically replace a lock when the real need is:

- protecting a multi-field invariant
- expressing reentrant ownership
- using `Condition`
- relying on lock semantics in debugging and reasoning

---

## Runnable Comparison Example

```java
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class BinaryVsCountingSemaphoreDemo {

    public static void main(String[] args) throws Exception {
        BinaryRefreshGate refreshGate = new BinaryRefreshGate();
        refreshGate.refresh();

        LimitedUploader uploader = new LimitedUploader(3);
        uploader.upload("file-a");
        uploader.upload("file-b");
        uploader.upload("file-c");

        OwnershipProtectedState protectedState = new OwnershipProtectedState();
        protectedState.increment();
        System.out.println("Protected count = " + protectedState.value());
    }

    // One-at-a-time admission for a task that should not overlap.
    static final class BinaryRefreshGate {
        private final Semaphore gate = new Semaphore(1);

        void refresh() throws InterruptedException {
            gate.acquire();
            try {
                System.out.println("Refreshing shared snapshot");
                TimeUnit.MILLISECONDS.sleep(100);
            } finally {
                gate.release();
            }
        }
    }

    // Bounded concurrency over several slots.
    static final class LimitedUploader {
        private final Semaphore slots;

        LimitedUploader(int maxConcurrentUploads) {
            this.slots = new Semaphore(maxConcurrentUploads);
        }

        void upload(String fileName) throws InterruptedException {
            slots.acquire();
            try {
                System.out.println("Uploading " + fileName);
            } finally {
                slots.release();
            }
        }
    }

    // Real invariant protection is still often clearer with a lock.
    static final class OwnershipProtectedState {
        private final ReentrantLock lock = new ReentrantLock();
        private int value;

        void increment() {
            lock.lock();
            try {
                value++;
            } finally {
                lock.unlock();
            }
        }

        int value() {
            lock.lock();
            try {
                return value;
            } finally {
                lock.unlock();
            }
        }
    }
}
```

The point of the example is not syntax.
It is boundary selection:

- binary semaphore for one-at-a-time admission
- counting semaphore for bounded parallelism
- lock for invariant ownership

---

## Good Use Cases

Binary semaphore fits when:

- one operation should not overlap with itself
- the problem is one-at-a-time admission, not rich lock semantics
- you want a permit model, not a critical-section API

Counting semaphore fits when:

- there are multiple equivalent slots
- the system can safely run several tasks in parallel but only up to a limit

Examples:

- binary: allow only one cache rebuild at a time
- counting: allow at most 20 concurrent exports

---

## Common Mistakes

### Treating a binary semaphore as a reentrant lock

It is not reentrant.
If the same thread acquires it twice without release, it blocks itself.

### Using a semaphore to protect complex invariants

You can sometimes force the design, but the code often becomes harder to understand than a simple lock-based critical section.

### Ignoring ownership semantics

If the logic relies on the concept that only the owner should release, a lock is usually the safer and clearer abstraction.

---

## Decision Guide

Choose a binary semaphore when:

- the system concept is "only one active admission at a time"
- you do not need lock features such as reentrancy or conditions

Choose a counting semaphore when:

- the system concept is "there are N interchangeable capacity units"

Choose a lock when:

- the real problem is protected state ownership and invariant safety

---

## Key Takeaways

- A binary semaphore allows only one concurrent permit holder; a counting semaphore allows several.
- Binary semaphores can look like mutexes, but they do not communicate the same ownership model as locks.
- Counting semaphores are natural for bounded-capacity access.
- If the real requirement is state protection rather than admission control, a lock is usually clearer.

Next post: [Rate Limiting and Concurrency Limiting with Semaphore](/2025/04/03/rate-limiting-and-concurrency-limiting-with-semaphore/)
