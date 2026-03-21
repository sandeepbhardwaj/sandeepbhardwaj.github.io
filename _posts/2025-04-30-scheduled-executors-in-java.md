---
title: Scheduled Executors in Java
date: 2025-04-30
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- scheduledexecutorservice
- scheduling
- executors
- timers
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Scheduled Executors in Java
seo_description: Learn how scheduled executors work in Java for delayed and
  periodic execution, and how fixed-rate and fixed-delay scheduling differ.
header:
  overlay_image: "/assets/images/java-concurrency-module-10-executors-futures-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 10
  show_overlay_excerpt: false
---
Scheduled executors are the executor framework's answer to delayed and periodic work.

They exist because many systems need tasks that run:

- later
- regularly
- or repeatedly after completion

That sounds simple, but the semantics matter.

The biggest distinction is between:

- fixed-rate scheduling
- fixed-delay scheduling

If you choose the wrong one, you often get drift, overlap assumptions, or runaway execution behavior you did not intend.

---

## Problem Statement

Applications need recurring background work such as:

- refresh a cache every minute
- emit metrics every 10 seconds
- retry a cleanup task after a delay
- scan for expired state periodically

Raw threads with `sleep()` are the wrong tool here because they mix:

- scheduling policy
- worker management
- shutdown handling

Scheduled executors separate those concerns and make the timing contract explicit.

---

## Mental Model

`ScheduledExecutorService` adds time-aware execution on top of executor worker management.

It supports:

- one-time delayed tasks
- periodic tasks at a fixed rate
- periodic tasks with a fixed delay between runs

That means you can say:

- run this once after 500 ms
- run this every 10 seconds based on schedule
- run this again 10 seconds after the previous run finishes

Those are different policies, not different spellings of the same behavior.

---

## Core API

The most important methods are:

- `schedule(...)`
- `scheduleAtFixedRate(...)`
- `scheduleWithFixedDelay(...)`

Their semantics differ:

### `schedule`

One-time delayed execution.

### `scheduleAtFixedRate`

Tries to maintain a regular schedule boundary.

If a task should run every second, fixed rate tries to align runs with:

- 0s
- 1s
- 2s
- 3s

### `scheduleWithFixedDelay`

Waits a delay after one run finishes before starting the next run.

So if the delay is 1 second:

- finish run
- wait 1 second
- start next run

This is often safer for variable-duration background work.

---

## Runnable Example

```java
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class ScheduledExecutorDemo {

    public static void main(String[] args) throws Exception {
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);

        try {
            scheduler.schedule(
                    () -> System.out.println("One-time delayed task"),
                    300,
                    TimeUnit.MILLISECONDS);

            scheduler.scheduleAtFixedRate(
                    () -> System.out.println("Fixed-rate heartbeat"),
                    0,
                    1,
                    TimeUnit.SECONDS);

            scheduler.scheduleWithFixedDelay(
                    () -> {
                        System.out.println("Fixed-delay cleanup start");
                        sleep(400);
                        System.out.println("Fixed-delay cleanup end");
                    },
                    0,
                    1,
                    TimeUnit.SECONDS);

            TimeUnit.SECONDS.sleep(4);
        } finally {
            scheduler.shutdown();
            scheduler.awaitTermination(5, TimeUnit.SECONDS);
        }
    }

    static void sleep(long millis) {
        try {
            TimeUnit.MILLISECONDS.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

This shows the main execution shapes without needing a complicated example domain.

---

## Choosing Fixed Rate vs Fixed Delay

Use fixed rate when:

- the task represents a periodic cadence
- regular timing matters more than spacing after completion

Examples:

- metrics heartbeat
- periodic polling signal
- scheduled tick-style logic

Use fixed delay when:

- tasks may vary in duration
- overlapping schedule pressure is undesirable
- you want breathing room after each completion

Examples:

- cleanup tasks
- batch maintenance
- retry sweeps

This choice is often more important than pool size for correctness.

---

## Common Mistakes

### Using `Thread.sleep()` loops instead of a scheduled executor

That re-implements scheduling badly and scatters lifecycle logic.

### Choosing fixed rate for slow variable-duration work

This often creates the wrong operational expectation about how frequently work truly runs.

### Treating scheduled executors like durable schedulers

They are in-process runtime tools.
They are not cron replacements with persistence and recovery semantics.

### Ignoring task failure

If recurring tasks throw unexpectedly, the recurring schedule may not behave the way the team expects unless failure handling is deliberate.

---

## Testing and Debugging Notes

Validate:

- delay semantics
- fixed-rate vs fixed-delay choice
- shutdown behavior
- failure handling of recurring tasks

Useful observability:

- run duration
- next-run lag
- missed or delayed execution count

For recurring work, timing drift and execution duration are often more informative than raw success count.

---

## Decision Guide

Use scheduled executors when:

- work is process-local
- delayed or periodic execution is required
- executor lifecycle and timing should stay in one managed place

Do not use them when:

- tasks must survive process restart
- distributed scheduling is required
- the real need is an external job scheduler

---

## Key Takeaways

- Scheduled executors are the JDK tool for delayed and periodic task execution.
- `scheduleAtFixedRate` and `scheduleWithFixedDelay` have different operational semantics and should be chosen deliberately.
- They are runtime scheduling tools, not durable external schedulers.
- Timing policy is part of correctness for recurring work.

Next post: [Future in Java Deep Dive](/java/concurrency/future-in-java-deep-dive/)
