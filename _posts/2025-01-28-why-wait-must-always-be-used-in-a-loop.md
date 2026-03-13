---
title: Why wait Must Always Be Used in a Loop
date: 2025-01-28
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- wait
- monitor
- guarded-block
- threads
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Why wait Must Always Be Used in a Loop
seo_description: Learn why Java wait must always be used in a loop, with practical
  examples covering condition re-checking, spurious wakeups, and missed assumptions.
header:
  overlay_image: "/assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 3
  show_overlay_excerpt: false
---
This rule is simple and non-negotiable:
`wait()` must be used inside a loop that re-checks the condition.

If you remember only one guardrail for low-level monitor coordination, remember this one.

---

## Problem Statement

A waiting thread wants to continue only if a condition is true.

Broken idea:

```java
if (!condition) {
    wait();
}
```

Correct idea:

```java
while (!condition) {
    wait();
}
```

Why is the loop necessary?
Because waking up does not guarantee the condition is still valid.

---

## Why `if` Is Wrong

Even after a thread wakes:

- another thread may have consumed the condition first
- the wakeup may not correspond to the condition this thread needs
- spurious wakeups are permitted

So “I woke up” is not the same as “it is now safe to proceed.”

The condition must be checked again under the same monitor.

---

## Runnable Example

Broken version:

```java
import java.util.LinkedList;
import java.util.Queue;

public class BrokenWaitIfDemo {

    public static void main(String[] args) throws Exception {
        MessageQueue queue = new MessageQueue();

        Thread consumer = new Thread(queue::consumeBroken, "consumer");
        Thread producer = new Thread(() -> queue.produce("task-1"), "producer");

        consumer.start();
        Thread.sleep(500);
        producer.start();

        consumer.join();
        producer.join();
    }

    static final class MessageQueue {
        private final Queue<String> queue = new LinkedList<>();

        synchronized void produce(String value) {
            queue.add(value);
            notifyAll();
        }

        synchronized void consumeBroken() {
            if (queue.isEmpty()) {
                try {
                    wait();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
            System.out.println("Consumed " + queue.remove());
        }
    }
}
```

This may appear to work in easy runs.
It is still wrong.

---

## Correct Version

```java
import java.util.LinkedList;
import java.util.Queue;

public class WaitLoopDemo {

    public static void main(String[] args) throws Exception {
        MessageQueue queue = new MessageQueue();

        Thread consumer = new Thread(queue::consume, "consumer");
        Thread producer = new Thread(() -> queue.produce("task-1"), "producer");

        consumer.start();
        Thread.sleep(500);
        producer.start();

        consumer.join();
        producer.join();
    }

    static final class MessageQueue {
        private final Queue<String> queue = new LinkedList<>();

        synchronized void produce(String value) {
            queue.add(value);
            notifyAll();
        }

        synchronized void consume() {
            while (queue.isEmpty()) {
                try {
                    wait();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
            System.out.println("Consumed " + queue.remove());
        }
    }
}
```

This is the correct guarded-wait pattern.

---

## Production-Style Example

Imagine a batching worker that waits until:

- queue size reaches threshold
- or shutdown requests final flush

The worker should not wake once and blindly continue.
It must re-check:

- do I truly have enough work?
- did another worker already consume it?
- did the signal mean something else?

That is why loop-based waiting is standard, not optional style.

---

## Why the Loop Preserves Correctness

The loop ties together:

- the monitor
- the condition
- the wakeup
- the re-check

Without the re-check, the code assumes the wakeup itself is proof.
That assumption is too weak.

A loop makes the condition itself the authority.

That is the correct mindset.

---

## Failure Modes

Using `if` instead of `while` leads to:

- removing from an empty queue
- proceeding on the wrong condition
- rare race bugs that are hard to reproduce
- hidden fragility when multiple waiters exist

This mistake often passes light testing and fails only under timing pressure.

---

## Testing and Debugging Notes

When reviewing low-level coordination code:

1. find every `wait()`
2. check whether it is inside a condition loop
3. verify the condition and state are protected by the same monitor

If a `wait()` is guarded by `if`, assume the code is wrong until proven otherwise.

That is a good review default.

---

## Decision Guide

Always use:

```java
while (!condition) {
    wait();
}
```

Never use:

```java
if (!condition) {
    wait();
}
```

There are many nuanced concurrency rules.
This one is not nuanced.

---

## Key Takeaways

- waking up is not proof that the condition is safe
- `wait()` must be paired with loop-based re-checking
- condition state, monitor ownership, and re-checking must all line up

---

## Next Post

[Spurious Wakeups and Condition Rechecking in Java](/java/concurrency/spurious-wakeups-and-condition-rechecking-in-java/)
