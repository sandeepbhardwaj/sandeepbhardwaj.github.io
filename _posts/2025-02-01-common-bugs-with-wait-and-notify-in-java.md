---
title: Common Bugs with wait and notify in Java
date: 2025-02-01
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- wait
- notify
- bugs
- monitor
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Common Bugs with wait and notify in Java
seo_description: Learn the most common wait and notify bugs in Java, including
  missed signals, wrong monitors, if-vs-while mistakes, and interruption handling.
header:
  overlay_image: "/assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 3
  show_overlay_excerpt: false
---
Low-level monitor coordination is powerful enough to be correct and dangerous enough to be fragile.

This post focuses on the bugs that show up again and again in `wait`/`notify` code.

If you can recognize these patterns quickly, you will save a lot of debugging time.

---

## The Common Failure Shape

Most `wait`/`notify` bugs are not exotic.
They are one of these:

- the wrong monitor is used
- the condition is checked incorrectly
- the signal does not correspond to a meaningful state transition
- interruption is mishandled

The code often looks reasonable in a code review until you ask very specific questions about condition ownership.

---

## Bug 1: Using `if` Instead of `while`

Broken:

```java
synchronized (lock) {
    if (!ready) {
        lock.wait();
    }
    useSharedState();
}
```

Correct:

```java
synchronized (lock) {
    while (!ready) {
        lock.wait();
    }
    useSharedState();
}
```

Why it breaks:

- wakeup is not proof that the condition is now satisfied

---

## Bug 2: Waiting and Signaling on Different Monitors

Broken idea:

- thread A waits on `lockA`
- thread B notifies on `lockB`

Those threads are not coordinating.
They are using two separate monitor domains.

This is one of the easiest ways to write code that “has wait/notify” and still does not work.

---

## Bug 3: Calling `wait` or `notify` Without Owning the Monitor

Broken:

```java
lock.wait();
```

outside the required synchronized region.

This throws `IllegalMonitorStateException`.
It is not just a stylistic mistake; it violates the monitor contract directly.

---

## Bug 4: Notifying Before Meaningful State Change

Broken sequence:

1. notify
2. later update the guarded condition

Correct sequence:

1. update guarded state
2. notify after the state transition that waiters care about

The signal should correspond to a condition becoming possibly true.
Otherwise the wakeup is misleading.

---

## Bug 5: Using `notify()` Where `notifyAll()` Is Safer

If multiple different conditions share the same monitor, `notify()` may wake a thread that still cannot proceed.

This can lead to:

- stalled systems
- rare deadlock-like behavior
- hard-to-reproduce production hangs

`notifyAll()` is often the safer default when multiple waiter roles exist.

---

## Bug 6: Swallowing Interruption

Broken:

```java
catch (InterruptedException e) {
    // ignore
}
```

This is especially dangerous in wait-based coordination because it hides shutdown or cancellation intent.

At minimum, interruption policy should be explicit:

- restore status and exit
- or restore status and let caller decide

---

## Production-Style Example

Imagine a batching service where workers wait for:

- enough records to fill a batch
- or a shutdown-triggered flush

Typical bug shapes:

- one worker uses `if`
- another uses `notify()` for all signals
- interruption is swallowed

Under low load, it may seem fine.
Under mixed load and shutdown timing, the service may hang or drop work unexpectedly.

That is why `wait`/`notify` code must be reviewed with discipline, not optimism.

---

## Practical Review Checklist

When you see wait/notify code, ask:

1. what exact condition is being guarded?
2. is it checked in a loop?
3. what monitor protects that condition?
4. does notification happen after a meaningful state change?
5. is interruption handled intentionally?

If any answer is vague, assume the code is fragile.

---

## Decision Guide

Use wait/notify only when:

- the monitor condition is local and simple
- the team can reason precisely about the shared state

If the coordination shape gets even moderately complex, that is a sign to consider:

- `Condition`
- `BlockingQueue`
- latches
- futures

Low-level wait/notify code is correct only when the design discipline is high.

---

## Key Takeaways

- most wait/notify bugs come from condition and monitor mismatches
- `if` instead of `while` is a serious bug
- wrong-monitor signaling makes the whole mechanism ineffective
- interruption handling must be explicit

---

## Next Post

[Timed Waiting with wait timeout in Java](/java/concurrency/timed-waiting-with-wait-timeout-in-java/)
