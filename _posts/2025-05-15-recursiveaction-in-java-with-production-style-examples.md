---
title: RecursiveAction in Java with Production Style Examples
date: 2025-05-15
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- forkjoin
- recursiveaction
- parallelism
- performance
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: RecursiveAction in Java with Production Style Examples
seo_description: Learn how to use RecursiveAction in Java for divide-and-conquer
  work that does not return a value.
header:
  overlay_image: "/assets/images/java-concurrency-module-11-forkjoin-async-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 11
  show_overlay_excerpt: false
---
`RecursiveAction` is the sibling of `RecursiveTask`, but for tasks that do not return a value.

That usually means the task:

- mutates a data structure in place
- writes results to a target buffer
- performs side effects within a partitioned region

The same Fork/Join rules still apply:

- split carefully
- keep tasks independent
- avoid blocking

---

## Problem Statement

Not every recursive parallel workload naturally produces a final value.

Some workloads instead do work directly against partitions, such as:

- applying a transformation to slices of an array
- normalizing image tiles
- traversing a tree and marking nodes

In those cases, returning a value from every subtask can be awkward and unnecessary.

That is where `RecursiveAction` fits.

---

## Mental Model

Use `RecursiveAction` when:

- the task can modify only its own slice safely
- there is no meaningful returned result
- parent tasks only need to wait for child completion

If multiple subtasks mutate overlapping state, the design becomes unsafe or synchronization-heavy.

The cleanest `RecursiveAction` workloads partition ownership cleanly.

---

## Runnable Example

This example applies a discount factor to a range of prices in place.

```java
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveAction;

public class RecursiveActionDemo {

    public static void main(String[] args) {
        double[] prices = new double[20_000];
        for (int i = 0; i < prices.length; i++) {
            prices[i] = 100.0;
        }

        ForkJoinPool pool = new ForkJoinPool();
        pool.invoke(new DiscountTask(prices, 0, prices.length, 0.90));
        pool.shutdown();

        System.out.println("First adjusted price = " + prices[0]);
    }

    static final class DiscountTask extends RecursiveAction {
        private static final int THRESHOLD = 1_000;
        private final double[] prices;
        private final int start;
        private final int end;
        private final double multiplier;

        DiscountTask(double[] prices, int start, int end, double multiplier) {
            this.prices = prices;
            this.start = start;
            this.end = end;
            this.multiplier = multiplier;
        }

        @Override
        protected void compute() {
            if (end - start <= THRESHOLD) {
                for (int i = start; i < end; i++) {
                    prices[i] = prices[i] * multiplier;
                }
                return;
            }

            int mid = (start + end) / 2;
            invokeAll(
                    new DiscountTask(prices, start, mid, multiplier),
                    new DiscountTask(prices, mid, end, multiplier));
        }
    }
}
```

The safety comes from partition ownership:

- each task writes only within its own index range

That is the pattern to preserve.

---

## Good Production Fits

`RecursiveAction` is a reasonable fit for:

- in-place array transformations
- tile-based image processing
- partitioned validation passes
- recursive traversal where side effects are partition-local

It is a poor fit for:

- global shared maps updated by every task
- remote I/O
- workflows where a returned result would simplify reasoning

If returning a result would make the combine phase safer, use `RecursiveTask` instead.

---

## Common Mistakes

### Overlapping writes across subtasks

This creates races or forces locking.

### Using `RecursiveAction` when a return value exists conceptually

That often leads to hidden shared state and harder reasoning.

### Doing expensive logging in every tiny task

This can destroy parallel efficiency.

### Threshold too aggressive

Again, too much task overhead can erase the benefit of parallel execution.

---

## Testing and Performance Guidance

For `RecursiveAction`, correctness testing should focus on:

- full output validation
- edge ranges such as empty, tiny, and odd-sized partitions
- repeated runs to catch accidental overlap bugs

For performance:

- compare against a sequential in-place version
- experiment with thresholds
- verify CPU usage and runtime rather than assuming the fork/join variant wins

---

## Decision Guide

Choose `RecursiveAction` when:

- the work is naturally side-effecting
- each task owns its output region
- the workload is CPU-bound and partitionable

Avoid it when:

- subtasks must coordinate over shared mutable state
- the absence of a return value makes correctness harder to express
- the work is mostly waiting on I/O

---

## Key Takeaways

- `RecursiveAction` is the Fork/Join tool for recursive parallel work without a returned result.
- It works best when each subtask owns a non-overlapping region of state.
- If subtasks need to coordinate over shared mutable data, the design becomes much weaker.
- As with all Fork/Join work, threshold tuning and sequential comparison still matter.

Next post: [Choosing Task Granularity in Fork Join Workloads](/java/concurrency/choosing-task-granularity-in-fork-join-workloads/)
