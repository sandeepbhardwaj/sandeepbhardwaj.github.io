---
title: CyclicBarrier in Java
date: '2018-05-06'
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- cyclicbarrier
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: CyclicBarrier in Java with Example
seo_description: Coordinate threads at a synchronization point using Java CyclicBarrier.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
`CyclicBarrier` is for one very specific kind of coordination:
the same fixed group of threads must all finish phase `N` before any of them may begin phase `N + 1`.

That sounds narrow, and it is.
But when that is exactly your problem, `CyclicBarrier` is much clearer than ad hoc counters, shared flags, or "sleep and hope" orchestration.

## Quick Decision Guide

| Tool | Best fit | What to remember |
| --- | --- | --- |
| `CountDownLatch` | one-time gate | not reusable |
| `CyclicBarrier` | repeated phase boundary for a fixed group | all parties must arrive |
| `Phaser` | repeated phases with dynamic participants | more flexible, more complex |
| structured concurrency | request-scoped parallel tasks | not a reusable phase barrier |

If your workers repeat phases together and the participant count is fixed, `CyclicBarrier` is a strong fit.

## What `CyclicBarrier` Actually Guarantees

Each participating thread calls `await()` when it finishes the current phase.
No thread gets past that call until all required parties have arrived.

Once the final party arrives:

- the barrier is tripped
- an optional barrier action runs
- all waiting parties are released

Then the barrier resets and can be used again for the next phase.

That reusability is what distinguishes it from `CountDownLatch`.

## A Simple Mental Model

Think of a race checkpoint:

```text
phase work -> checkpoint -> phase work -> checkpoint -> ...
```

Every runner can move at a different speed inside a phase.
But nobody is allowed into the next phase until the entire group reaches the checkpoint.

That is exactly what `CyclicBarrier` encodes.

## Basic Example

```java
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierExample {
    public static void main(String[] args) {
        CyclicBarrier barrier = new CyclicBarrier(3, () ->
                System.out.println("All workers finished the phase"));

        for (int i = 1; i <= 3; i++) {
            final int workerId = i;

            new Thread(() -> {
                try {
                    System.out.println("Worker " + workerId + " preparing data");
                    Thread.sleep(500L * workerId);

                    barrier.await();

                    System.out.println("Worker " + workerId + " starts next phase");
                } catch (Exception e) {
                    Thread.currentThread().interrupt();
                }
            }).start();
        }
    }
}
```

The output order inside the first phase can vary.
The important guarantee is that `"starts next phase"` does not appear until all three workers have reached the barrier.

## Multi-Phase Use

This is where `CyclicBarrier` becomes genuinely useful:

```java
for (int phase = 1; phase <= 3; phase++) {
    doPhaseWork(phase);
    barrier.await();
}
```

Common examples:

- simulation steps
- iterative numerical algorithms
- batch pipelines where every worker must finish one stage before the merge step
- partitioned data preparation where the next phase depends on complete prior output

If you only need one final wait point, `CountDownLatch` is usually simpler.

## Why Barrier Actions Need Discipline

You can attach a barrier action:

```java
new CyclicBarrier(3, this::mergePartialResults)
```

That is useful for work that should happen exactly once per phase.
But be careful:

- the action runs when the barrier trips
- it delays release of the waiting threads
- if it is slow, blocking, or failure-prone, it becomes part of your critical path

My rule is simple:
barrier actions should be small, deterministic, and side-effect-conscious.
Heavy orchestration logic usually belongs elsewhere.

## Failure Modes You Must Expect

### Wrong Party Count

If the barrier expects `4` parties and only `3` threads ever call `await()`, your program waits forever unless you use timeouts.

This is the most common production mistake.

### One Slow or Failed Worker Blocks Everyone

The barrier is intentionally all-or-nothing.
If one participant stalls, the rest wait.

That is correct behavior, but it means you need an explicit timeout and failure policy.

### Broken Barrier State

If a waiting thread is interrupted, times out, or otherwise fails during barrier coordination, the barrier becomes broken.
Other waiting threads will see `BrokenBarrierException`.

That is a feature, not a nuisance.
It prevents peers from marching into the next phase under inconsistent assumptions.

## Timeout-Oriented Usage

In real systems, prefer the timeout overload:

```java
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

try {
    barrier.await(2, TimeUnit.SECONDS);
} catch (TimeoutException e) {
    // a participant did not arrive in time
    barrier.reset();
} catch (BrokenBarrierException e) {
    // another participant failed, timed out, or was interrupted
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}
```

Timeouts give you two things:

- a way to avoid indefinite hangs
- an operational signal that the phase contract is being violated

Without them, diagnosis is much harder.

## When Not to Use `CyclicBarrier`

Do not force it into problems it does not naturally fit.

It is usually the wrong choice when:

- participants join and leave dynamically
- tasks are request-scoped and independent rather than phase-coupled
- one stage can proceed on partial results
- your coordination boundary is event-driven rather than thread-synchronous

In those cases, `Phaser`, queues, futures, or structured concurrency often express the system more cleanly.

## `CyclicBarrier` vs `CountDownLatch` vs `Phaser`

### `CountDownLatch`

Use it when one or more threads need to wait for a one-time completion event.
Once the count hits zero, the latch is done.

### `CyclicBarrier`

Use it when the same fixed team repeats synchronized phases.
That is its sweet spot.

### `Phaser`

Use it when the phase idea still fits but the participant set changes over time or you need richer control.
It is more powerful, but also easier to overcomplicate.

## Operational Checklist

Before using `CyclicBarrier`, verify:

- the party count exactly matches the real participants
- a timeout policy exists
- barrier actions are lightweight
- interruption and `BrokenBarrierException` are handled deliberately
- logs make it easy to see which worker reached which phase

If those points are vague, the barrier is probably not production-ready yet.

## Final Takeaway

`CyclicBarrier` is not a general concurrency primitive.
It is a precise tool for repeated phase synchronization among a fixed group of workers.

Use it when the group must advance together, treat broken-barrier behavior as part of the design, and prefer timeout-based coordination so failures become visible instead of turning into silent hangs.
