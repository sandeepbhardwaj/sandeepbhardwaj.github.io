---
title: CompletionService in Java for Fastest Result Collection
date: 2025-05-04
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- completionservice
- executorcompletionservice
- futures
- executors
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: CompletionService in Java for Fastest Result Collection
seo_description: Learn how CompletionService works in Java to consume task
  results in completion order rather than submission order.
header:
  overlay_image: "/assets/images/java-concurrency-module-10-executors-futures-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 10
  show_overlay_excerpt: false
---
Sometimes the important question is not:

- how do I submit several tasks

It is:

- how do I consume their results as soon as each task finishes

That is what `CompletionService` is for.

It combines:

- an executor for running tasks
- a completion queue for finished results

This is often better than waiting in submission order when task durations vary significantly.

---

## Problem Statement

Suppose you submit ten independent tasks.

If you keep the returned futures in a list and call `get()` in submission order, this can happen:

- task 1 is slow
- task 2 through 10 are already done
- the caller still waits on task 1 first

That means the result-consumption order now depends on submission order, not completion order.

In many systems, that is wasteful.

Examples:

- shard queries where partial results can be processed immediately
- scraping or lookup tasks with variable latency
- batch tasks where the first completed outputs should be drained quickly

`CompletionService` solves this exact mismatch.

---

## Mental Model

`ExecutorCompletionService` wraps an executor and keeps completed tasks in a queue.

So the workflow becomes:

1. submit tasks
2. tasks run on the executor
3. finished tasks are placed on the completion queue
4. caller takes completed futures in completion order

This is the key advantage:

- submission order and result-consumption order are decoupled

---

## Runnable Example

```java
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

public class CompletionServiceDemo {

    public static void main(String[] args) throws Exception {
        ExecutorService executor = Executors.newFixedThreadPool(3);
        ExecutorCompletionService<String> completionService =
                new ExecutorCompletionService<>(executor);

        try {
            completionService.submit(() -> work("shard-a", 400));
            completionService.submit(() -> work("shard-b", 150));
            completionService.submit(() -> work("shard-c", 250));

            for (int i = 0; i < 3; i++) {
                Future<String> completed = completionService.take();
                System.out.println("Received " + completed.get());
            }
        } finally {
            executor.shutdown();
        }
    }

    static String work(String name, long millis) throws Exception {
        TimeUnit.MILLISECONDS.sleep(millis);
        return name + "-done";
    }
}
```

The results arrive in completion order, not submission order.

That is the entire reason this abstraction exists.

---

## Where It Fits Well

Strong fits:

- fan-out queries with variable latency
- batch task processing where early completions should be drained immediately
- systems that want to start aggregating as soon as partial results appear

This is especially useful when the caller can make progress before the slowest task finishes.

---

## Comparison with Other Tools

Compared with plain list-of-futures handling:

- `CompletionService` avoids waiting in submission order

Compared with `invokeAll`:

- `invokeAll` gives one whole-batch wait
- `CompletionService` streams finished results incrementally

Compared with `CompletableFuture`:

- `CompletionService` is simpler and more direct for executor-backed completion-order consumption
- `CompletableFuture` is richer for composition graphs

This makes `CompletionService` a very practical middle ground.

---

## Common Mistakes

### Forgetting cancellation of tasks no longer needed

If you only need the first few completed answers, you may still need to cancel the rest deliberately.

### Assuming it solves failure policy automatically

You still need to decide:

- what to do if one completed future failed
- whether to keep draining others

### Using it where simple `invokeAll` is enough

If partial incremental consumption is not useful, `invokeAll` may be simpler.

---

## Decision Guide

Use `CompletionService` when:

- many tasks are submitted together
- durations vary
- completion-order consumption matters

Use other tools when:

- you need all results only after full batch completion
- or you need richer async chaining than completion-order draining

---

## Key Takeaways

- `CompletionService` lets you process executor task results in completion order instead of submission order.
- It is a strong fit for fan-out workloads with variable task latency.
- It sits between plain futures and richer async composition APIs in complexity.
- Its value is highest when early results are useful before the full batch completes.

Next post: [Thread Pool Sizing for CPU Bound Workloads](/java/concurrency/thread-pool-sizing-for-cpu-bound-workloads/)
