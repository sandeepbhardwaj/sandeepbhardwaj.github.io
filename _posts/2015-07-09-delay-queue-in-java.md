---
title: DelayQueue in Java with Example
date: '2015-07-09'
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- multithreading
- delayqueue
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: DelayQueue in Java with Producer-Consumer Example
seo_description: Learn how DelayQueue works in Java with a complete delayed-message
  processing example.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Delay Queue in Java

`DelayQueue` is a specialized blocking queue where elements become available only after a delay expires.

## Real-World Use Cases

- retry scheduling with cooldown
- delayed notifications/reminders
- token expiry workflows
- deferred cleanup tasks

## Java 8 Example

```java
import java.util.concurrent.*;

public class DelayQueueExample {
    public static void main(String[] args) throws InterruptedException {
        DelayQueue<DelayedTask> queue = new DelayQueue<>();

        queue.put(new DelayedTask("retry-order-1", 2, TimeUnit.SECONDS));
        queue.put(new DelayedTask("retry-order-2", 4, TimeUnit.SECONDS));

        while (!queue.isEmpty()) {
            System.out.println("Execute: " + queue.take().name());
        }
    }
}

record DelayedTask(String name, long readyAtNanos) implements Delayed {
    DelayedTask(String name, long delay, TimeUnit unit) {
        this(name, System.nanoTime() + unit.toNanos(delay));
    }

    @Override
    public long getDelay(TimeUnit unit) {
        return unit.convert(readyAtNanos - System.nanoTime(), TimeUnit.NANOSECONDS);
    }

    @Override
    public int compareTo(Delayed o) {
        DelayedTask other = (DelayedTask) o;
        return Long.compare(this.readyAtNanos, other.readyAtNanos);
    }
}
```

## JDK 11 and Java 17 Notes

`DelayQueue` API and behavior are effectively unchanged in JDK 11 and Java 17 for this use case.

## Java 21+ Improvement

The example above uses `record` for cleaner immutable delayed-task modeling.

## Java 25 Note

No fundamental API shift expected. Keep retry metadata (attempt count, cause, jitter strategy) alongside delayed tasks.

## Key Takeaways

- `DelayQueue` is ideal for time-based availability.
- Use monotonic time (`System.nanoTime`) for delay calculations.
- Prefer immutable task metadata for safer concurrency.
