---
title: wait notify and notifyAll in Java Explained Properly
date: 2025-01-27
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- wait
- notify
- notifyall
- monitor
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: wait notify and notifyAll in Java Explained Properly
seo_description: Learn how wait, notify, and notifyAll really work in Java, with
  monitor-based coordination examples and common failure modes.
header:
  overlay_image: "/assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 3
  show_overlay_excerpt: false
---
`wait`, `notify`, and `notifyAll` are some of the oldest and most misunderstood coordination tools in Java.

They are powerful enough to build correct coordination.
They are also easy to misuse badly.

This post explains what they actually do.

---

## Problem Statement

Mutual exclusion alone is not enough for many concurrent designs.

Sometimes a thread must:

- wait until data becomes available
- wait until a condition changes
- wake another thread when progress is possible

That is where monitor wait/notify coordination enters.

---

## Correct Mental Model

These methods operate on an object's monitor and condition-waiting behavior.

### `wait()`

The current thread:

- must already own the monitor
- releases the monitor
- enters waiting state until notified or interrupted

### `notify()`

The current thread:

- must already own the monitor
- wakes one waiting thread on that same monitor

### `notifyAll()`

The current thread:

- must already own the monitor
- wakes all waiting threads on that same monitor

Important:

- waking a thread does not mean it runs immediately
- it must still re-acquire the monitor before continuing

That detail matters a lot.

---

## Naive Misunderstanding

A common naive model is:

- `notify()` instantly hands execution to the other thread

That is false.

The waiting thread becomes eligible to continue, but it still needs monitor re-entry.
Until the current owner exits the synchronized block, the notified thread cannot proceed inside that monitor.

---

## Runnable Example

```java
import java.util.LinkedList;
import java.util.Queue;

public class WaitNotifyDemo {

    public static void main(String[] args) throws Exception {
        MessageQueue queue = new MessageQueue();

        Thread consumer = new Thread(queue::consume, "consumer");
        Thread producer = new Thread(() -> queue.produce("event-1"), "producer");

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
            System.out.println("Produced " + value);
            notifyAll();
        }

        synchronized void consume() {
            while (queue.isEmpty()) {
                try {
                    System.out.println("Queue empty, waiting");
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

This is the right basic shape:

- hold the monitor
- test the condition
- wait if condition is not satisfied
- notify when the condition may have changed

---

## Why Ownership Rules Exist

Java requires `wait`, `notify`, and `notifyAll` to run while holding the relevant monitor.

Otherwise:

- the condition check
- waiting transition
- and signal relationship

would not be coordinated correctly.

That is why calling them outside synchronized code throws `IllegalMonitorStateException`.

The rule is not arbitrary.
It follows directly from the monitor model.

---

## Production-Style Example

Suppose a report worker waits until:

- enough data chunks arrive
- or a batch flush signal appears

That worker can coordinate on one monitor-protected state object:

- producers add chunks
- producers notify waiting consumers
- consumers re-check whether work is now ready

This is a realistic coordination shape, even though modern code often prefers higher-level queues.

Understanding it still matters because:

- some libraries use similar patterns internally
- reading old code requires it
- monitor conditions are still a valid low-level tool

---

## notify vs notifyAll

### `notify()`

Wakes one waiter.
This can be efficient, but risky if:

- multiple condition types are waiting on the same monitor
- the wrong waiting thread wakes and still cannot proceed

### `notifyAll()`

Wakes all waiters.
This is often safer when:

- multiple wait conditions share the monitor
- correctness is more important than avoiding extra wakeups

Many real-world bugs come from optimistic misuse of `notify()` where `notifyAll()` was the safer choice.

---

## Failure Modes

Common mistakes:

- calling `wait` outside synchronized
- calling `notify` before the waiting thread actually waits
- using `if` instead of `while` around condition checks
- assuming notification itself transfers ownership immediately

The `if` vs `while` issue is important enough that it gets its own next post.

---

## Testing and Debugging Notes

When reviewing wait/notify code, ask:

1. what exact condition is being waited on?
2. is it checked under the same monitor?
3. why is `notify` safe instead of `notifyAll`, if used?
4. what happens on interruption?

If those answers are unclear, the code is fragile.

---

## Decision Guide

Use wait/notify only when:

- low-level monitor coordination is appropriate
- the state and condition are tightly tied to one monitor

Prefer higher-level abstractions when:

- queues, latches, conditions, or futures express the intent more clearly

Still, every Java concurrency engineer should understand wait/notify deeply.

---

## Key Takeaways

- `wait` releases the monitor and waits for a signal
- `notify` wakes one waiter; `notifyAll` wakes all
- waiting threads must re-acquire the monitor before continuing
- these methods are correct only when tied to clear monitor-protected conditions

---

## Next Post

[Why wait Must Always Be Used in a Loop](/java/concurrency/why-wait-must-always-be-used-in-a-loop/)
