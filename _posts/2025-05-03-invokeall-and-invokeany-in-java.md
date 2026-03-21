---
title: invokeAll and invokeAny in Java
date: 2025-05-03
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- invokeall
- invokeany
- executorservice
- futures
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: invokeAll and invokeAny in Java
seo_description: Learn how invokeAll and invokeAny work in Java for batch task
  submission, all-results collection, and first-success result strategies.
header:
  overlay_image: "/assets/images/java-concurrency-module-10-executors-futures-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 10
  show_overlay_excerpt: false
---
`invokeAll` and `invokeAny` are batch execution helpers on `ExecutorService`.

They solve a common problem:

- several tasks belong together logically
- submitting them one by one is not the full story

The two methods answer different coordination goals:

- wait for all results
- return one successful result and stop caring about the rest

That makes them surprisingly useful in production code, especially for parallel lookups and redundant strategies.

---

## Problem Statement

Suppose you have several candidate tasks:

- query several shards
- try several upstream sources
- calculate several independent reports

Sometimes the goal is:

- run them all and collect every result

Other times the goal is:

- return whichever succeeds first

If you code these manually with repeated `submit` and `get`, the control flow often becomes noisy.

`invokeAll` and `invokeAny` express those batch intents directly.

---

## `invokeAll`

`invokeAll`:

- submits a collection of callables
- waits until all have completed
- returns a list of futures in the same order as the input tasks

This makes it useful when:

- the whole batch matters
- every result is needed
- you want one bulk waiting boundary

It can also be called with a timeout.

---

## `invokeAny`

`invokeAny`:

- submits several callables
- returns one successfully completed result
- treats the first successful completion as the winner

This is useful when:

- several equivalent ways exist to get an answer
- only one successful result is needed
- waiting for all would waste time

If no task completes successfully, it throws.

This is not "first completion no matter what."
It is "first successful completion."

---

## Runnable Example

```java
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

public class InvokeAllInvokeAnyDemo {

    public static void main(String[] args) throws Exception {
        ExecutorService executor = Executors.newFixedThreadPool(3);

        try {
            List<Future<String>> allResults = executor.invokeAll(List.of(
                    () -> slowTask("report-a", 300),
                    () -> slowTask("report-b", 200),
                    () -> slowTask("report-c", 100)
            ));

            for (Future<String> future : allResults) {
                System.out.println("invokeAll result = " + future.get());
            }

            String fastestSuccess = executor.invokeAny(List.of(
                    () -> slowTask("primary", 400),
                    () -> slowTask("secondary", 150),
                    () -> slowTask("tertiary", 250)
            ));

            System.out.println("invokeAny result = " + fastestSuccess);
        } finally {
            executor.shutdown();
        }
    }

    static String slowTask(String name, long millis) throws Exception {
        TimeUnit.MILLISECONDS.sleep(millis);
        return name + "-done";
    }
}
```

This shows the semantic difference clearly:

- `invokeAll` gathers the whole batch
- `invokeAny` wants one winner

---

## Where Each Fits Well

Use `invokeAll` for:

- parallel batch calculations
- shard fan-out where all responses matter
- testing or reporting workflows that need every result

Use `invokeAny` for:

- redundant upstream calls
- first-success lookup strategies
- fast-fallback querying where any one good answer is enough

These are very different coordination patterns even though both start from "a collection of callables."

---

## Common Mistakes

### Assuming `invokeAny` means first finished task regardless of success

It means first successful result.

### Forgetting timeout handling

Batch execution that waits forever is rarely what you want in production request paths.

### Using `invokeAll` when result streaming would be better

If you want to process results as they complete rather than after the whole batch finishes, `CompletionService` is often a better fit.

### Treating them as distributed orchestration tools

They are local executor coordination tools.
You still need timeout, cancellation, and failure policy around the tasks themselves.

---

## Decision Guide

Choose `invokeAll` when:

- every result matters
- one batch completion boundary is appropriate

Choose `invokeAny` when:

- one successful result is enough
- continuing to wait for the rest is wasteful

Choose something else when:

- results should be consumed in completion order
- you need richer async composition

In those cases:

- use `CompletionService`
- or move to `CompletableFuture`

---

## Key Takeaways

- `invokeAll` is for "run this whole batch and wait for all of it."
- `invokeAny` is for "give me one successful result from this batch."
- They are useful batch coordination tools for local executor workloads.
- Their value comes from matching the result-ownership pattern correctly, not just from reducing boilerplate.

Next post: [CompletionService in Java for Fastest Result Collection](/java/concurrency/completionservice-in-java-for-fastest-result-collection/)
