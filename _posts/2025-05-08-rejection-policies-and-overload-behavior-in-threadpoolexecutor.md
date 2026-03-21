---
title: Rejection Policies and Overload Behavior in ThreadPoolExecutor
date: 2025-05-08
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- threadpoolexecutor
- overload
- rejection
- executors
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Rejection Policies and Overload Behavior in ThreadPoolExecutor
seo_description: Learn how rejection handlers change overload behavior in
  ThreadPoolExecutor and how to design executor rejection deliberately.
header:
  overlay_image: "/assets/images/java-concurrency-module-10-executors-futures-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 10
  show_overlay_excerpt: false
---
An executor is not really production-ready until overload behavior is explicit.

That is where rejection policies matter.

When a `ThreadPoolExecutor` cannot accept more work, the system must make a decision:

- fail
- slow the caller
- drop something
- or run work elsewhere

If that decision was never designed, overload becomes unpredictable application behavior.

---

## Problem Statement

Every executor has a finite ability to absorb work.

That limit comes from some combination of:

- thread count
- queue capacity
- memory budget
- downstream system limits

When those limits are reached, submissions eventually stop fitting.
At that moment, the rejection policy becomes the true overload strategy of the service.

This is why rejection handlers are not just executor trivia.
They are part of system design.

---

## When Rejection Happens

In `ThreadPoolExecutor`, rejection occurs when:

- all workers up to `maximumPoolSize` are busy
- the work queue cannot accept another task
- the executor is still receiving submissions

It can also happen if the executor is shutting down.

The core point is simple:

- rejection is what honest capacity control looks like

Without that moment, systems often continue to accept work they no longer have a realistic chance of completing on time.

---

## Built-In Policies

### `AbortPolicy`

Throws `RejectedExecutionException`.

Use when:

- submission should fail fast
- callers can retry, shed load, or return an error response

This is often the safest default because overload is visible.

### `CallerRunsPolicy`

Runs the task on the submitting thread.

Use when:

- slowing the caller is acceptable
- submission backpressure is beneficial

This can be effective in request-handling flows, but it also means the caller may suddenly do real work and block longer than expected.

### `DiscardPolicy`

Silently drops the task.

Use rarely.
Silent drops are operationally dangerous unless task loss is acceptable and separately measured.

### `DiscardOldestPolicy`

Drops the oldest queued task, then retries submission.

This can make sense only if:

- stale queued work has less value than new work

Otherwise it creates confusing behavior under load.

---

## Runnable Example

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class RejectionPolicyDemo {

    public static void main(String[] args) {
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
                2,
                2,
                0,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(2),
                new ThreadPoolExecutor.AbortPolicy());

        for (int i = 1; i <= 10; i++) {
            int taskId = i;
            try {
                executor.execute(() -> runTask(taskId));
            } catch (RejectedExecutionException e) {
                System.out.println("Rejected task " + taskId);
            }
        }

        executor.shutdown();
    }

    static void runTask(int taskId) {
        try {
            System.out.println("Running task " + taskId);
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

This example does not just demonstrate a Java API.
It demonstrates a service decision:

- what should happen when we are out of room

That question exists whether the team answers it explicitly or not.

---

## Choosing a Policy by Work Type

Good candidates for fail-fast rejection:

- HTTP requests that can return `429` or `503`
- short-lived work where stale completion is not valuable
- systems with upstream retries or circuit breaking

Good candidates for `CallerRunsPolicy`:

- internal pipelines where slowing producers helps stabilize the system
- workloads where the submitter is allowed to pay the execution cost

Dangerous candidates for silent discard:

- billing
- orders
- audit events
- anything with durability or correctness obligations

If work matters, dropping it without visibility is a bug disguised as a policy.

---

## Custom Rejection Handlers

A custom handler can:

- increment rejection counters
- log structured overload events
- emit alerts
- route work to a fallback path

But custom logic must stay lightweight.
If the rejection handler blocks heavily, it can make overload worse.

A good custom rejection handler usually does two things:

- makes overload visible
- enforces a simple, clear consequence

---

## Common Mistakes

### Using an unbounded queue and therefore never seeing rejection

This often converts overload into hidden latency and memory growth.

### Choosing `CallerRunsPolicy` without understanding the caller

If the caller holds critical locks or event-loop threads, this can be disastrous.

### Silently discarding tasks that matter

This is one of the easiest ways to lose correctness during traffic spikes.

### Treating rejection as exceptional rather than expected under overload

Overload is a normal production condition.
The system should have an intentional answer.

---

## Production Guidance

A healthy overload design usually includes:

- bounded queues
- explicit rejection behavior
- metrics for rejections and queue age
- upstream handling such as retries, fallbacks, or backpressure

The correct rejection policy depends on business semantics.
There is no single best handler across all workloads.

What matters is that rejection is:

- expected
- measured
- documented
- tested

---

## Key Takeaways

- Rejection policy is part of your overload strategy, not a minor executor detail.
- `AbortPolicy` makes overload visible, `CallerRunsPolicy` pushes back on submitters, and discard policies should be used only with extreme care.
- Bounded queues plus explicit rejection create more predictable systems than unlimited buffering.
- The right policy depends on whether late work, dropped work, or slowed callers are acceptable for the business flow.

Next post: [Custom ThreadFactory in Java](/java/concurrency/custom-threadfactory-in-java/)
