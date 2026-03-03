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
author_profile: true
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

# CyclicBarrier in Java

`CyclicBarrier` lets a fixed number of threads wait until all participants reach the same synchronization point.

## Real-World Use Cases

- phased simulation systems
- parallel data preparation before a final merge
- batch processing pipelines with step boundaries

## How It Works

- create barrier with `N` parties
- each worker calls `await()`
- once all `N` arrive, optional barrier action runs
- barrier can be reused for next cycle

## Java 8 Example

```java
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierExample {
    public static void main(String[] args) {
        CyclicBarrier barrier = new CyclicBarrier(3, () ->
                System.out.println("All parties arrived. Merge step starts."));

        for (int i = 1; i <= 3; i++) {
            final int id = i;
            new Thread(() -> {
                try {
                    System.out.println("Worker " + id + " preparing data");
                    Thread.sleep(500L * id);
                    barrier.await();
                    System.out.println("Worker " + id + " continues next phase");
                } catch (Exception e) {
                    Thread.currentThread().interrupt();
                }
            }).start();
        }
    }
}
```

## Multi-Phase Example Pattern

`CyclicBarrier` is most useful when the same group repeats phases.

```java
for (int phase = 1; phase <= 3; phase++) {
    doPhaseWork(phase);
    barrier.await(); // all workers must finish current phase
}
```

This keeps phase boundaries explicit and deterministic.

## Timeout and Broken Barrier Handling

One stuck worker can block everyone. Use timeout overload in real systems:

```java
try {
    barrier.await(2, TimeUnit.SECONDS);
} catch (TimeoutException e) {
    // one participant was too slow
    barrier.reset();
} catch (BrokenBarrierException e) {
    // another participant failed or timed out
}
```

If one thread is interrupted while waiting, the barrier is broken and all waiting parties fail with `BrokenBarrierException`.

## `CyclicBarrier` vs `CountDownLatch` vs `Phaser`

- `CountDownLatch`: one-time wait; not reusable.
- `CyclicBarrier`: reusable barrier with fixed participant count.
- `Phaser`: dynamic participants and richer phase control.

Choose `Phaser` when parties can join/leave dynamically.

## Operational Pitfalls

1. Mismatch between configured parties and actual workers.
2. Long-running or blocking barrier actions.
3. Ignoring broken-barrier state after failures.
4. No timeout policy, causing infinite waits.

## JDK 11 and Java 17 Notes

`CyclicBarrier` remains a stable and relevant choice in JDK 11 and Java 17 for repeated phase synchronization.

## Java 21+ Guidance

For request-scoped parallel tasks, prefer `StructuredTaskScope` style orchestration over manual barriers when possible.
Use `CyclicBarrier` when you explicitly need reusable phase synchronization.

## Java 25 Note

No major usage change expected for `CyclicBarrier`; API is mature and stable.

## Key Takeaways

- `CyclicBarrier` is for reusable phase coordination.
- Handle `BrokenBarrierException` and interruption correctly.
- Use it only when all participants are known upfront.
- Prefer timeout-based `await` in production workflows.
