---
title: Deadlock in Java Reproduction Detection and Prevention
date: 2025-02-11
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- deadlock
- locks
- threads
- diagnostics
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Deadlock in Java Reproduction Detection and Prevention
seo_description: Learn how deadlock happens in Java, how to reproduce it, detect
  it with thread dumps, and prevent it in production systems.
header:
  overlay_image: "/assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 4
  show_overlay_excerpt: false
---
Deadlock is one of the clearest concurrency failures because the system stops making progress even though the process is still alive.

Two or more threads wait forever because each is holding something the other needs.

---

## Problem Statement

Suppose one thread transfers money from account A to B while another transfers money from B to A.

If both threads lock the two accounts in opposite order, they can each acquire one lock and wait forever for the second.

That is a deadlock.

---

## Naive Version

```java
class AccountService {
    void transfer(Account from, Account to, int amount) {
        synchronized (from) {
            synchronized (to) {
                from.balance -= amount;
                to.balance += amount;
            }
        }
    }
}
```

This code looks fine until another thread calls `transfer(b, a, amount)`.

Now lock ordering depends on request timing.

---

## Runnable Example

```java
import java.util.concurrent.TimeUnit;

public class DeadlockDemo {

    public static void main(String[] args) throws Exception {
        Account a = new Account("A", 1000);
        Account b = new Account("B", 1000);

        Thread t1 = new Thread(() -> transfer(a, b, 100), "transfer-a-to-b");
        Thread t2 = new Thread(() -> transfer(b, a, 200), "transfer-b-to-a");

        t1.start();
        t2.start();

        TimeUnit.SECONDS.sleep(2);
        System.out.println("t1 state = " + t1.getState());
        System.out.println("t2 state = " + t2.getState());
    }

    static void transfer(Account from, Account to, int amount) {
        synchronized (from) {
            sleep(100);
            synchronized (to) {
                from.balance -= amount;
                to.balance += amount;
            }
        }
    }

    static final class Account {
        private final String id;
        private int balance;

        Account(String id, int balance) {
            this.id = id;
            this.balance = balance;
        }
    }

    static void sleep(long millis) {
        try {
            TimeUnit.MILLISECONDS.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }
}
```

The sleep only makes the timing easier to observe.
The real bug is inconsistent lock ordering.

---

## Why Deadlock Happens

Deadlock typically requires four conditions:

- mutual exclusion
- hold and wait
- no preemption
- circular wait

In normal application code, the most practical cause is circular wait:

- thread 1 holds lock A and waits for B
- thread 2 holds lock B and waits for A

---

## Production-Style Scenarios

Deadlocks appear in systems like:

- account or inventory transfers touching two domain objects
- cache and database update paths that lock resources in different order
- service shutdown code acquiring lifecycle locks while worker threads hold them
- nested framework callbacks that combine application locks with library locks

These incidents often surface as:

- requests hanging forever
- thread pools slowly filling with blocked threads
- health checks timing out
- CPU looking low even though the service is effectively down

---

## Detecting Deadlock

The most practical diagnostic tool is a thread dump.

Look for threads:

- stuck in `BLOCKED`
- waiting on monitors or locks
- each holding one resource while waiting for another

JVM tooling such as `jstack` and `jcmd Thread.print` can often identify deadlocks directly.

The important operational lesson is to name threads clearly so thread dumps are readable in production.

---

## Safe Fix: Global Lock Ordering

If code must acquire two locks, always acquire them in a consistent order.

```java
class SafeAccountService {
    void transfer(Account a, Account b, int amount) {
        Account first = a.id.compareTo(b.id) < 0 ? a : b;
        Account second = a.id.compareTo(b.id) < 0 ? b : a;

        synchronized (first) {
            synchronized (second) {
                if (a.balance >= amount) {
                    a.balance -= amount;
                    b.balance += amount;
                }
            }
        }
    }

    static final class Account {
        private final String id;
        private int balance;

        Account(String id, int balance) {
            this.id = id;
            this.balance = balance;
        }
    }
}
```

This works because all transfers agree on one lock acquisition order.

---

## Other Prevention Strategies

- reduce the number of nested locks
- use time-bounded lock acquisition with explicit recovery paths
- avoid calling external code while holding a lock
- hand ownership to a single-threaded worker or queue instead of sharing mutable state directly

The best deadlock prevention technique is often architectural simplification.

---

## Common Mistakes

- locking objects in request-dependent order
- holding a lock while calling another component that may call back
- mixing intrinsic locks and explicit locks without one clear discipline
- assuming deadlock only happens in very large systems

Small code paths deadlock all the time if lock order is inconsistent.

---

## Key Takeaways

- Deadlock is a liveness failure where threads wait forever on each other.
- The most practical cause is circular wait created by inconsistent lock ordering.
- Thread dumps are the primary production diagnostic tool.
- Consistent ordering, fewer nested locks, and simpler ownership models are the main prevention strategies.

Next post: [Livelock in Java and How It Differs from Deadlock](/java/concurrency/livelock-in-java-and-how-it-differs-from-deadlock/)
