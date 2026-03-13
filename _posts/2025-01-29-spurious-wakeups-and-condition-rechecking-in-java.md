---
title: Spurious Wakeups and Condition Rechecking in Java
date: 2025-01-29
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- spurious-wakeup
- wait
- monitor
- threads
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Spurious Wakeups and Condition Rechecking in Java
seo_description: Learn what spurious wakeups are in Java and why condition rechecking
  is mandatory when using wait-based coordination.
header:
  overlay_image: "/assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 3
  show_overlay_excerpt: false
---
Spurious wakeups are one of the reasons Java requires `wait()` to be guarded by a loop.

If you already accepted the loop rule in the previous post, this post explains one of the concrete reasons why that rule exists.

---

## Problem Statement

What if a thread wakes from `wait()` even though:

- nobody called `notify`
- nobody called `notifyAll`
- the condition it needs is still false

Java permits that possibility.
That is what a spurious wakeup means.

---

## Correct Mental Model

A spurious wakeup is a wakeup that does not imply your logical condition is satisfied.

You do not need to obsess over the exact low-level mechanism or frequency.
What matters is the rule:

- waiting code must not assume wakeup means condition success

That is why the condition loop remains mandatory.

---

## Why This Is Not Just Theory

Even if you never personally observe a clear spurious wakeup in a tiny demo, the API contract still allows it.

Correct concurrent code follows the contract, not anecdotal behavior.

In practice, the loop rule is also needed for:

- missed assumptions
- wrong waiter awakened
- state changed again before reacquisition

So even if spurious wakeups were rare on your machine, the loop would still be necessary.

---

## Runnable Example

The point of this example is not to force a true spurious wakeup reliably.
The point is to show the correct defensive structure.

```java
import java.util.LinkedList;
import java.util.Queue;

public class ConditionRecheckDemo {

    public static void main(String[] args) throws Exception {
        QueueHolder holder = new QueueHolder();

        Thread consumer = new Thread(holder::consume, "consumer");
        Thread producer = new Thread(() -> holder.produce("message-1"), "producer");

        consumer.start();
        Thread.sleep(500);
        producer.start();

        consumer.join();
        producer.join();
    }

    static final class QueueHolder {
        private final Queue<String> queue = new LinkedList<>();

        synchronized void produce(String value) {
            queue.add(value);
            notifyAll();
        }

        synchronized void consume() {
            while (queue.isEmpty()) {
                try {
                    System.out.println("Still empty, waiting again if needed");
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

The loop is the protection.
That is the whole lesson.

---

## Production-Style Example

Suppose multiple workers wait on the same monitor for different but related conditions:

- one wants enough items for batch processing
- another wants a shutdown signal
- another wants a flush trigger

If one wakeup occurs, not every worker should proceed.
Each must re-check whether its own condition is really satisfied.

This is a much more common practical problem than people think when they first learn `wait`.

---

## Failure Modes

If your code assumes every wakeup is meaningful, it may:

- proceed too early
- consume absent data
- violate invariants
- fail only under rare timing conditions

This is why “it passed local testing” is a very weak concurrency argument.

---

## Testing and Debugging Notes

In review and debugging, focus less on “did a spurious wakeup definitely happen?” and more on:

1. does the code remain correct no matter why the wakeup occurred?
2. is the condition re-checked under the same monitor?

That is the stronger engineering standard.

---

## Decision Guide

When using low-level monitor waiting:

- always code defensively
- always treat wakeup as a prompt to re-check
- never treat wakeup as proof

This mindset is safer and simpler than trying to reason about exceptional cases at runtime.

---

## Production Review Notes

In real code review, the question is not whether someone can reproduce a spurious wakeup in a small demo.
The real question is whether the waiting logic is correct under every allowed wakeup path.
Check for three things together:

- the predicate is read while holding the same monitor
- the thread waits in a `while` loop, not an `if`
- the code that makes the predicate true performs state change before signaling

If any of those pieces is missing, the code is relying on timing luck rather than on the contract.
That is why condition rechecking is one of the most important habits in low-level monitor code.

## Key Takeaways

- spurious wakeups are allowed by the Java waiting contract
- wakeup never replaces condition re-checking
- correctness comes from the loop, not from trust in the wakeup

---

## Next Post

[Guarded Blocks Pattern in Java Concurrency](/java/concurrency/guarded-blocks-pattern-in-java-concurrency/)
