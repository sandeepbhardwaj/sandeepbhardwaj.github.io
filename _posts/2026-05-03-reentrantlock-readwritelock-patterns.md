---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-03
seo_title: "ReentrantLock and ReadWriteLock Patterns in Java"
seo_description: "Use explicit lock APIs in Java for advanced coordination and lock-state control."
tags: [java, concurrency, reentrantlock, readwritelock]
canonical_url: "https://sandeepbhardwaj.github.io/java/reentrantlock-readwritelock-patterns/"
title: "ReentrantLock and ReadWriteLock Patterns in Java"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Explicit Locking Strategies for Shared State"
---

# ReentrantLock and ReadWriteLock Patterns in Java

`ReentrantLock` and `ReadWriteLock` are useful when intrinsic monitors are too limited for production coordination needs.
Use them intentionally, because lock flexibility comes with complexity.

---

## When to Prefer Explicit Locks

- need `tryLock()` for fail-fast behavior
- need interruptible locking in cancellation-aware flows
- need read/write separation for read-heavy maps
- need fair locking semantics for starvation-sensitive paths

---

## ReentrantLock Pattern

```java
class WalletService {
    private final ReentrantLock lock = new ReentrantLock();
    private long balance;

    boolean transferOut(long amount) {
        lock.lock();
        try {
            if (balance < amount) return false;
            balance -= amount;
            return true;
        } finally {
            lock.unlock();
        }
    }
}
```

---

## ReadWriteLock Pattern

```java
class ConfigStore {
    private final ReadWriteLock rw = new ReentrantReadWriteLock();
    private final Map<String, String> data = new HashMap<>();

    String get(String key) {
        rw.readLock().lock();
        try { return data.get(key); }
        finally { rw.readLock().unlock(); }
    }

    void put(String key, String value) {
        rw.writeLock().lock();
        try { data.put(key, value); }
        finally { rw.writeLock().unlock(); }
    }
}
```

---

## Operational Notes

- measure contention and lock wait time before introducing lock hierarchy.
- keep critical sections short and side-effect free.
- never call remote APIs while holding locks.

---

## Key Takeaways

- explicit locks are valuable for advanced coordination semantics.
- start simple; use read-write split only when real read dominance exists.
- prioritize deadlock-free design and observability over clever locking.
