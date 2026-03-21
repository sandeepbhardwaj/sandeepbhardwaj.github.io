---
title: Check-Then-Act Race Condition in Java
date: 2025-02-05
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- race-condition
- check-then-act
- synchronization
- threads
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Check-Then-Act Race Condition in Java
seo_description: Learn the check-then-act race condition in Java with realistic
  examples, broken code, and correct ways to protect invariants.
header:
  overlay_image: "/assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 4
  show_overlay_excerpt: false
---
Check-then-act is one of the most common race patterns in Java.

The bug appears when code first checks some condition and then performs an action based on that condition, but another thread can change the state between those two steps.

---

## Problem Statement

Suppose an order service wants to reserve a coupon only if it has not already been used.

The business rule sounds simple:

- check whether the coupon is unused
- mark it used
- continue checkout

If two threads do that concurrently without one atomic boundary, both may pass the check.

---

## Naive Version

```java
class CouponRegistry {
    private boolean used;

    boolean reserveCoupon() {
        if (!used) {
            used = true;
            return true;
        }
        return false;
    }
}
```

This looks correct in single-threaded code.
Under concurrency, both threads can read `used == false` before either writes `true`.

Then the same coupon gets reserved twice.

---

## Why This Happens

The problem is not the `if` statement by itself.
The problem is that:

- the check reads shared mutable state
- the action writes shared mutable state
- the invariant depends on both steps staying together
- no synchronization or atomic primitive protects that boundary

Check and act are logically one operation.
The code implemented them as two exposed steps.

---

## Runnable Example

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

public class CheckThenActRaceDemo {

    public static void main(String[] args) throws Exception {
        CouponRegistry registry = new CouponRegistry();
        ExecutorService executor = Executors.newFixedThreadPool(2);
        List<Callable<Boolean>> tasks = new ArrayList<>();

        tasks.add(registry::reserveCoupon);
        tasks.add(registry::reserveCoupon);

        List<Future<Boolean>> results = executor.invokeAll(tasks);
        executor.shutdown();

        int successCount = 0;
        for (Future<Boolean> result : results) {
            if (result.get()) {
                successCount++;
            }
        }

        System.out.println("Successful reservations = " + successCount);
        System.out.println("Coupon used = " + registry.isUsed());
    }

    static final class CouponRegistry {
        private boolean used;

        boolean reserveCoupon() {
            if (!used) {
                sleep(30);
                used = true;
                return true;
            }
            return false;
        }

        boolean isUsed() {
            return used;
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

You may observe two successful reservations even though the invariant allows only one.

The delay only widens the timing window.
The bug exists even without it.

---

## Production-Style Scenario

In backend systems, check-then-act appears in code like:

- reserve stock if quantity is available
- create user if email does not exist
- refresh token if current token is expired
- send alert if alert was not already sent
- schedule job if the same job is not already running

These are not minor mistakes.
They violate business invariants.

For example, two API nodes may both see “invoice not paid” and both start a downstream settlement flow.

---

## Broken Inventory Example

```java
class InventoryService {
    private int available = 1;

    boolean reserveOne() {
        if (available > 0) {
            available--;
            return true;
        }
        return false;
    }
}
```

This is also check-then-act:

- check `available > 0`
- act by decrementing

If those steps are not protected together, overselling becomes possible.

---

## Correct Fixes

The fix is to make the whole decision-and-update sequence atomic.

### Option 1: Synchronize the critical section

```java
class SafeCouponRegistry {
    private boolean used;

    synchronized boolean reserveCoupon() {
        if (!used) {
            used = true;
            return true;
        }
        return false;
    }
}
```

### Option 2: Use an atomic primitive when the state shape fits

```java
import java.util.concurrent.atomic.AtomicBoolean;

class AtomicCouponRegistry {
    private final AtomicBoolean used = new AtomicBoolean(false);

    boolean reserveCoupon() {
        return used.compareAndSet(false, true);
    }
}
```

The atomic version is a particularly good fit because the invariant is a single-state transition from `false` to `true`.

---

## Decision Guide

Use `synchronized` or `Lock` when:

- multiple fields must stay consistent together
- the critical section is more than one simple atomic state change
- you need conditions or lock features

Use an atomic class when:

- one variable represents the whole invariant
- the operation is a compare-and-set style transition
- you want a simpler lock-free state update

---

## Common Mistakes

- making the field `volatile` and assuming that fixes the race
- synchronizing only the write but not the read
- checking outside a lock and acting inside it
- reading from one object and updating another object without one shared coordination strategy

`volatile` gives visibility.
It does not combine check and act into one atomic operation.

---

## Testing Notes

Check-then-act bugs are often intermittent.
They may disappear in local testing and appear under load.

Useful ways to expose them:

- widen the timing window with sleeps in test-only demos
- run the same operation many times from a thread pool
- assert business invariants, not just field values
- use repeated stress tests instead of one happy-path run

---

## Key Takeaways

- Check-then-act is a race where the decision and the update are split across an unprotected timing window.
- The fix is not “more threads awareness”; the fix is an actual atomic boundary.
- `volatile` is not enough for this pattern.
- Many business invariant bugs are just check-then-act races wearing business language.

Next post: [Read-Modify-Write Race Condition in Java](/java/concurrency/read-modify-write-race-condition-in-java/)
