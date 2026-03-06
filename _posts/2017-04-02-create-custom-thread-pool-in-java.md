---
title: Create a Custom Thread Pool in Java
date: '2017-04-02'
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- threadpool
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Create a Custom Thread Pool in Java (Learning Implementation)
seo_description: Build a basic custom thread pool to understand worker threads, queues,
  and coordination.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This is a learning-oriented implementation to understand worker threads, queueing, and task execution flow.

## Real-World Use Cases

- controlled async task execution
- bounded concurrency for expensive operations
- internal job runners

## Minimal Learning Implementation

```java
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class SimpleThreadPool {
    private final BlockingQueue<Runnable> queue;

    public SimpleThreadPool(int workerCount, int capacity) {
        this.queue = new LinkedBlockingQueue<>(capacity);

        for (int i = 0; i < workerCount; i++) {
            Thread worker = new Thread(this::runWorker, "worker-" + i);
            worker.start();
        }
    }

    public void execute(Runnable task) throws InterruptedException {
        queue.put(task);
    }

    private void runWorker() {
        while (true) {
            try {
                Runnable task = queue.take();
                task.run();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
    }
}
```

## Why Custom Pools Fail in Production

Learning pools are useful to understand mechanics, but real systems need more controls:

- graceful shutdown and drain behavior
- task rejection policy under saturation
- uncaught exception handling
- metrics for queue length and active workers

Without these, failure behavior becomes unpredictable under load.

## Java 8 vs JDK 11 vs Java 17 vs Java 21+

- Java 8: fixed pools are common and effective.
- JDK 11: no API shift for `ThreadPoolExecutor`; same tuning model applies.
- Java 17: still same executor model, but this is a common LTS baseline for modern Spring Boot services.
- Java 21+: for IO-heavy workloads, virtual-thread-per-task executors can reduce tuning overhead.

## Production API Equivalent (`ThreadPoolExecutor`)

```java
import java.util.concurrent.*;

public class PoolConfig {
    private static final ExecutorService EXECUTOR = new ThreadPoolExecutor(
            4,                      // core
            8,                      // max
            60, TimeUnit.SECONDS,   // keep-alive
            new ArrayBlockingQueue<>(1000),
            new ThreadPoolExecutor.CallerRunsPolicy()
    );

    public static void submitTask(Runnable task) {
        EXECUTOR.execute(task);
    }
}
```

## Rejection Policy Matters

When queue and workers are full, your policy defines system behavior:

- `AbortPolicy`: fail fast with exception
- `CallerRunsPolicy`: pushes back on caller thread
- `DiscardPolicy`: drops work silently (usually risky)
- custom handler: route to dead-letter or fallback path

Pick policy based on business criticality, not convenience.

## Sizing Heuristic (Starting Point)

- CPU-bound tasks: worker count near CPU cores
- I/O-bound tasks: larger pool possible, but monitor context switching
- queue capacity: bounded, sized from acceptable buffering delay

Then tune with telemetry:

- queue wait time
- task execution time
- rejection count

## Graceful Shutdown Pattern

```java
EXECUTOR.shutdown();
if (!EXECUTOR.awaitTermination(30, TimeUnit.SECONDS)) {
    EXECUTOR.shutdownNow();
}
```

Always define shutdown path in service stop hooks to prevent task loss during deploy.

For Java 21+ IO-heavy workloads:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    executor.submit(() -> {/* blocking IO */});
}
```

## Java 25 Note

Thread pool fundamentals stay relevant. The improvement focus is observability, rejection policies, and workload isolation.

## Monitoring Checklist

- active thread count
- queue depth and queue wait time
- task success/failure count
- rejection rate
- shutdown drain duration

## Key Takeaways

- Use custom pools only for learning.
- In production prefer `ThreadPoolExecutor` or virtual-thread executors.
- Always define queue capacity and rejection behavior.
- Tune pools from metrics, not guesswork.
