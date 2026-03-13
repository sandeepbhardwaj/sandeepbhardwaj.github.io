---
title: Error Handling with CompletableFuture in Java
date: 2025-05-22
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- completablefuture
- async
- exceptions
- futures
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Error Handling with CompletableFuture in Java
seo_description: Learn how error propagation and recovery work with
  CompletableFuture in Java using exceptionally, handle, and whenComplete.
header:
  overlay_image: "/assets/images/java-concurrency-module-11-forkjoin-async-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 11
  show_overlay_excerpt: false
---
Async workflows are only readable if their failure behavior is readable too.

That is where many `CompletableFuture` codebases degrade.

Teams often learn how to:

- start stages
- combine results
- join at the end

but leave failures to emerge as wrapped exceptions far away from the real source.

`CompletableFuture` gives you the tools to do much better, but you have to use them deliberately.

---

## Problem Statement

Consider a service that asynchronously loads:

- user profile
- account balance
- recommendation data

Any of those operations can fail.

The system then needs to decide:

- fail the entire workflow
- substitute a fallback
- record the error and continue partially

Without explicit error handling, async code quickly becomes difficult to reason about and difficult to operate.

---

## Mental Model

A `CompletableFuture` can complete:

- normally
- exceptionally
- via cancellation

Dependent stages see that completion state unless they intercept or recover from it.

The most commonly used error-handling tools are:

- `exceptionally`
- `handle`
- `whenComplete`

They sound similar, but their roles are different.

---

## Runnable Example

```java
import java.util.concurrent.CompletableFuture;

public class CompletableFutureErrorDemo {

    public static void main(String[] args) {
        CompletableFuture<String> future = CompletableFuture
                .supplyAsync(() -> {
                    throw new IllegalStateException("pricing service unavailable");
                })
                .exceptionally(error -> {
                    System.out.println("Recovering from: " + error.getMessage());
                    return "fallback-price";
                });

        System.out.println(future.join());
    }
}
```

This shows the simplest recovery shape:

- failure occurs
- recovery function converts it into a normal value

---

## `exceptionally`

Use `exceptionally` when you want:

- recovery only on failure

It maps an exception to a replacement value.

That makes it useful for:

- defaults
- degraded responses
- one-stage fallback behavior

What it does not do is run on success.
It is specifically a recovery path.

---

## `handle`

Use `handle` when you want access to:

- the successful result if present
- the exception if failure occurred

It always runs and returns a new value.

That makes it useful when the next step should unify success and failure into one output model.

For example:

- produce a final response object that may contain partial data and error metadata

---

## `whenComplete`

Use `whenComplete` for:

- observation
- logging
- metrics
- cleanup side effects

It sees the result or exception, but it does not naturally transform the outcome the way `handle` does.

That makes it a better fit for diagnostics than for recovery logic.

---

## Common Mistakes

### Recovering too early and hiding important failures

Not every failure should become a default value.

### Logging in many stages and duplicating noise

Error handling should be deliberate and layered, not scattered.

### Calling `join()` and only then thinking about failure

By that point, the real context is often already obscured.

### Mixing business fallback with diagnostics in the same handler

Keep "what response do we return" separate from "what do we log or measure."

---

## Practical Failure Strategy

A healthy async workflow often has:

- stage-local recovery only where it is truly meaningful
- central composition-level handling for workflow failure
- metrics or logs attached with `whenComplete`

Ask of each stage:

- is this dependency optional or required

That one decision determines whether fallback is appropriate.

---

## Join and Exception Wrapping

When you eventually call:

- `join()`
- `get()`

failures are wrapped differently.

Operationally, that means error handling is often cleaner earlier in the pipeline than at the final blocking edge.

The more context you preserve near the source of failure, the easier production diagnosis becomes.

---

## Key Takeaways

- `exceptionally` recovers from failure, `handle` sees both success and failure, and `whenComplete` is best for observation and side effects.
- Not every async failure should be hidden behind a fallback value.
- Error handling is clearer when recovery, transformation, and diagnostics have separate roles.
- The best `CompletableFuture` code makes exceptional completion part of the workflow design, not an afterthought.

Next post: [Timeouts and Fallback with CompletableFuture in Java](/2025/05/23/timeouts-and-fallback-with-completablefuture-in-java/)
