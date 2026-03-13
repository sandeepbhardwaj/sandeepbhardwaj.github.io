---
title: Mutual Exclusion with synchronized in Java
date: 2025-01-24
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- synchronized
- mutual-exclusion
- monitor
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Mutual Exclusion with synchronized in Java
seo_description: Learn how synchronized provides mutual exclusion in Java, with
  practical examples, invariant protection, and production locking guidance.
header:
  overlay_image: "/assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 3
  show_overlay_excerpt: false
---
Mutual exclusion is one of the most basic goals of locking:
only one thread should execute a critical section at a time.

In Java, `synchronized` provides that guarantee for code guarded by the same monitor.

This post focuses on that guarantee directly.

---

## Problem Statement

Suppose two threads both update the same account balance.

Without mutual exclusion:

- both may read the same old value
- both may write conflicting new values
- the final state can be incorrect

You need a boundary that forces one thread to finish its critical update before another can enter.

That boundary is mutual exclusion.

---

## Broken Version

```java
class Account {
    private int balance = 1000;

    void withdraw(int amount) {
        if (balance >= amount) {
            balance -= amount;
        }
    }

    int balance() {
        return balance;
    }
}
```

This is unsafe under concurrency because the check and the update can interleave across threads.

---

## Correct Version with synchronized

```java
class Account {
    private int balance = 1000;

    synchronized void withdraw(int amount) {
        if (balance >= amount) {
            balance -= amount;
        }
    }

    synchronized int balance() {
        return balance;
    }
}
```

Now the same monitor protects:

- checking the balance
- updating the balance
- reading the balance consistently through the same locking discipline

That is mutual exclusion in practical form.

---

## Runnable Example

```java
import java.util.concurrent.TimeUnit;

public class MutualExclusionDemo {

    public static void main(String[] args) throws Exception {
        Account account = new Account(100);

        Thread t1 = new Thread(() -> account.withdraw(80), "withdraw-1");
        Thread t2 = new Thread(() -> account.withdraw(80), "withdraw-2");

        t1.start();
        t2.start();

        t1.join();
        t2.join();

        System.out.println("Final balance = " + account.balance());
    }

    static final class Account {
        private int balance;

        Account(int balance) {
            this.balance = balance;
        }

        synchronized void withdraw(int amount) {
            if (balance >= amount) {
                sleep(200);
                balance -= amount;
                System.out.println(Thread.currentThread().getName() + " withdrew " + amount);
            } else {
                System.out.println(Thread.currentThread().getName() + " rejected");
            }
        }

        synchronized int balance() {
            return balance;
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

The artificial sleep widens the race window, but `synchronized` preserves correctness by ensuring one withdrawing thread owns the critical section at a time.

---

## Mutual Exclusion Is About Invariants

A lot of developers reduce mutual exclusion to “only one thread at a time.”
That is true, but incomplete.

The real question is:

- what invariant is being protected?

In the account example, the invariant is:

- balance must never go below what the protected logic allows

In an inventory system, it may be:

- available + reserved + sold remains consistent

Good locking protects invariants, not arbitrary blocks of code.

---

## Production-Style Example

Consider a reservation service:

- reserve stock
- release stock
- confirm purchase

These operations all affect the same inventory truth.
If mutual exclusion does not protect them correctly, business data breaks.

That is why lock design is not just about thread mechanics.
It is about domain correctness under overlap.

---

## Failure Modes

Mutual exclusion fails when:

- different threads use different monitors for the same invariant
- some reads or writes skip the lock entirely
- critical sections include too much unrelated work and create contention pressure

A system can be “using synchronized” and still be wrong if the exclusion boundary does not match the actual shared-state invariant.

---

## Performance and Trade-Offs

Mutual exclusion preserves correctness, but it reduces concurrency for that protected region.

That creates trade-offs:

- larger critical sections simplify correctness but increase contention
- smaller sections may improve throughput but can accidentally split an invariant

The right boundary is usually:

- as small as possible
- but large enough to protect the full invariant

That balance is central to practical locking.

---

## Testing and Debugging Notes

Review questions:

1. what invariant is protected?
2. do all related reads and writes use the same monitor?
3. is unrelated slow work inside the critical section?

These questions are better than just asking “is this synchronized?”

---

## Decision Guide

Use `synchronized` mutual exclusion when:

- one monitor can cleanly protect one local invariant
- correctness matters more than maximizing overlap in that code path

Revisit the design if:

- contention becomes high
- the invariant spans too many operations
- you need advanced lock behavior

But start by preserving correctness.

---

## Key Takeaways

- mutual exclusion means one thread at a time in the protected critical section
- in practice it exists to protect invariants
- `synchronized` is often enough for local shared-state correctness
- the correct exclusion boundary matters more than simply adding a keyword

---

## Next Post

[Visibility Guarantees of Entering and Exiting a Java Monitor](/java/concurrency/visibility-guarantees-of-entering-and-exiting-a-java-monitor/)
