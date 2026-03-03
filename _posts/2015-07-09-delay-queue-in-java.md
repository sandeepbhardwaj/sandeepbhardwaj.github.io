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

## How DelayQueue Actually Works

`DelayQueue` stores elements ordered by delay expiration.  
`take()` blocks until the head element's delay reaches zero or less.

Important implications:

- only expired elements are returned
- queue size can be non-zero even when `take()` blocks
- ordering is by earliest expiration, not insertion order

This makes it excellent for “not before time T” processing.

## Example: Retry with Exponential Backoff

This pattern is common in resilient integrations where failed jobs should be retried later.

```java
import java.util.concurrent.*;

public class DelayQueueRetryWorker {
    private final DelayQueue<RetryTask> queue = new DelayQueue<>();
    private final ExecutorService workers = Executors.newFixedThreadPool(4);

    public void submit(String id, int attempt) {
        long delayMs = Math.min(30_000, (1L << attempt) * 250L); // capped exponential backoff
        queue.put(RetryTask.of(id, attempt, delayMs, TimeUnit.MILLISECONDS));
    }

    public void start() {
        Thread scheduler = Thread.ofPlatform().name("retry-scheduler").start(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    RetryTask task = queue.take();
                    workers.submit(() -> process(task));
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        });
    }

    private void process(RetryTask task) {
        boolean ok = callDownstream(task.jobId());
        if (!ok && task.attempt() < 6) {
            submit(task.jobId(), task.attempt() + 1);
        }
    }

    private boolean callDownstream(String id) {
        return ThreadLocalRandom.current().nextInt(10) > 2; // demo only
    }
}

record RetryTask(String jobId, int attempt, long readyAtNanos) implements Delayed {
    static RetryTask of(String jobId, int attempt, long delay, TimeUnit unit) {
        return new RetryTask(jobId, attempt, System.nanoTime() + unit.toNanos(delay));
    }

    @Override
    public long getDelay(TimeUnit unit) {
        return unit.convert(readyAtNanos - System.nanoTime(), TimeUnit.NANOSECONDS);
    }

    @Override
    public int compareTo(Delayed other) {
        return Long.compare(this.readyAtNanos, ((RetryTask) other).readyAtNanos);
    }
}
```

What this gives you:

- retry scheduling without busy loops
- centralized backoff policy
- bounded worker pool separated from timing queue

## Cancellation and Rescheduling Pattern

If delayed work may become irrelevant (for example order already completed), maintain an index by task id.

Approach:

1. store task id in delayed object
2. keep a `ConcurrentHashMap<String, RetryTask>` for active tasks
3. before processing, verify task is still active/current
4. on cancel, remove id from map (and optionally from queue if reference available)

This avoids executing stale delayed tasks.

## Operational Pitfalls

1. Using `System.currentTimeMillis()` for delay logic (clock shifts break timing).
2. Unbounded retries without max-attempt or dead-letter path.
3. Running heavy business logic directly on queue-consumer thread.
4. No metrics for queue depth, oldest delayed age, and retry attempt distribution.

## Monitoring Checklist

- queue size over time
- time from scheduled-at to processed-at
- retries per job and max attempt reached count
- success after retry vs permanent failure rate

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
- Separate scheduling (`DelayQueue`) from execution (bounded worker pool).
