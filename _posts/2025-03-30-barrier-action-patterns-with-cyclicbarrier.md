---
title: Barrier Action Patterns with CyclicBarrier
date: 2025-03-30
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- cyclicbarrier
- barrier-action
- coordination
- parallelism
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Barrier Action Patterns with CyclicBarrier
seo_description: Learn practical barrier action patterns with CyclicBarrier in
  Java, including aggregation, phase validation, and safe publication.
header:
  overlay_image: "/assets/images/java-concurrency-module-08-coordination-utilities-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 8
  show_overlay_excerpt: false
---
The optional barrier action is what turns `CyclicBarrier` from a simple rendezvous tool into a phase-transition tool.

Without a barrier action, the barrier says:

- everyone meet here before the next round

With a barrier action, it can also say:

- once everyone is here, do one group-level step before anyone continues

That group-level step is useful, but easy to misuse.

---

## What a Barrier Action Really Is

A barrier action is a runnable that executes exactly once each time the barrier trips.

Conceptually, it sits between:

- the last arrival
- the release of the waiting parties

That timing makes it useful for:

- combining partial results
- publishing a new shared snapshot
- validating phase completion
- logging a round boundary

It also means a bad barrier action can stall everyone.

---

## Problem Statement

Suppose several worker threads compute partial pricing adjustments in parallel.

You want this shape:

1. each worker computes its partition
2. once all are done, merge the partial results
3. publish one immutable snapshot
4. let the next round begin

That merge-and-publish step is not per-worker logic.
It is phase-transition logic.

That is an excellent use for a barrier action.

---

## Runnable Example

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

public class BarrierActionDemo {

    public static void main(String[] args) throws Exception {
        PricingRoundProcessor processor = new PricingRoundProcessor(3);
        processor.runOneRound();
    }

    static final class PricingRoundProcessor {
        private final List<Map<String, Integer>> partials = new ArrayList<>();
        private final AtomicReference<Map<String, Integer>> publishedSnapshot =
                new AtomicReference<>(Map.of());
        private final CyclicBarrier barrier;
        private final int workerCount;

        PricingRoundProcessor(int workerCount) {
            this.workerCount = workerCount;
            for (int i = 0; i < workerCount; i++) {
                partials.add(new ConcurrentHashMap<>());
            }
            this.barrier = new CyclicBarrier(workerCount, this::mergeAndPublish);
        }

        void runOneRound() throws Exception {
            ExecutorService executor = Executors.newFixedThreadPool(workerCount);

            for (int workerId = 0; workerId < workerCount; workerId++) {
                final int id = workerId;
                executor.submit(() -> {
                    Map<String, Integer> bucket = partials.get(id);
                    bucket.put("P100", 100 + id);
                    bucket.put("P200", 200 + id);
                    barrier.await();
                    return null;
                });
            }

            executor.shutdown();
            executor.awaitTermination(5, TimeUnit.SECONDS);

            System.out.println("Published snapshot = " + publishedSnapshot.get());
        }

        void mergeAndPublish() {
            Map<String, Integer> merged = new ConcurrentHashMap<>();
            for (Map<String, Integer> partial : partials) {
                merged.putAll(partial);
                partial.clear();
            }
            publishedSnapshot.set(Map.copyOf(merged));
            System.out.println("Merged and published new pricing snapshot");
        }
    }
}
```

The design intent is clear:

- workers compute independently
- the barrier action performs one group-level merge
- the published result becomes visible as a whole snapshot

---

## Strong Barrier Action Patterns

### 1. Result aggregation

Each worker produces partial output.
The barrier action merges them.

Examples:

- merge partial maps
- combine scores
- compute final summary statistics for the round

### 2. Snapshot publication

Workers prepare the next state in parallel.
The barrier action publishes one immutable snapshot after the group finishes.

This is one of the safest and most practical patterns because it keeps publication centralized.

### 3. Phase validation

Before workers proceed, the barrier action checks:

- every partition produced output
- counts match expectations
- required invariants hold

If validation fails, the action can throw and break the barrier rather than letting the system advance with bad state.

### 4. Round-boundary instrumentation

The action records:

- round completion metrics
- processing duration
- trace events

This is useful when the action is lightweight and clearly operational.

---

## What Not to Put in a Barrier Action

Barrier actions are easy to overload.

Poor fits include:

- slow database writes
- network calls
- large blocking disk I/O
- complex error recovery logic

Why?

Because every waiting worker is still blocked until the action completes.
A heavy barrier action serializes the round transition and turns the barrier into a bottleneck.

The action should usually be:

- short
- deterministic
- purely in-memory when possible

---

## Failure Behavior

If the barrier action throws, the barrier is broken.

That is often correct.

If you cannot safely advance to the next round without the action succeeding, breaking the barrier is better than letting workers continue on inconsistent shared state.

But you need to design around that:

- how will the failure be surfaced
- who owns recovery
- should the group stop, retry, or reset

Barrier action failures are group failures, not just local thread failures.

---

## Common Mistakes

### Hiding business logic inside the action

If the action becomes large and policy-heavy, the coordination primitive is starting to own too much domain behavior.

### Mutating shared state before the barrier

If workers publish partially visible shared state before the action runs, you may undermine the whole benefit of phase-aligned publication.

### Assuming the action runs on a dedicated coordinator thread

It does not.
It runs in the context of one of the participating threads.

That matters for:

- logging
- thread naming
- exception propagation

---

## Testing and Debugging Notes

Test barrier actions as phase transitions, not just as helper methods.

Useful checks:

- all workers produced expected partial outputs
- the action ran exactly once per round
- the published snapshot is whole and immutable
- failure in the action breaks the round visibly

If debugging a stuck barrier, inspect:

- whether a worker never arrived
- whether the action blocked
- whether the action threw and broke the barrier

---

## Decision Guide

Use a barrier action when:

- there is one natural group-level step at the end of each round
- that step should happen exactly once
- workers should not continue until it completes

Avoid it when:

- the step is slow or externally blocking
- the logic is not truly tied to the barrier phase
- a dedicated coordinator or queue-driven stage would be clearer

---

## Key Takeaways

- Barrier actions let `CyclicBarrier` perform one group-level step before releasing the next round.
- Strong patterns include result aggregation, snapshot publication, phase validation, and lightweight instrumentation.
- Keep barrier actions short and avoid blocking I/O in them.
- If the action fails, treat it as a group-level coordination failure.

Next post: [Phaser in Java for Reusable Phase Coordination](/java/concurrency/phaser-in-java-for-reusable-phase-coordination/)
