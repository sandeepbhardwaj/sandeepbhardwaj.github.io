---
title: Visibility Bugs Without Synchronization in Java
date: 2025-02-07
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- visibility
- synchronization
- java-memory-model
- volatile
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Visibility Bugs Without Synchronization in Java
seo_description: Learn why visibility bugs happen in Java without synchronization
  or volatile, and how stale reads break concurrent systems.
header:
  overlay_image: "/assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 4
  show_overlay_excerpt: false
---
Some concurrency bugs are not about two threads writing at the same time.

Sometimes one thread writes and another thread simply does not see the write when it matters.

That is a visibility bug.

---

## Problem Statement

Suppose one thread sets a stop flag and expects a worker thread to notice and exit.

Without a valid visibility guarantee, the worker may keep looping on a stale value.

The code may look completely reasonable and still fail.

---

## Naive Version

```java
class TaskRunner {
    private boolean running = true;

    void runLoop() {
        while (running) {
            doWork();
        }
    }

    void stop() {
        running = false;
    }

    void doWork() {
    }
}
```

Many developers expect `stop()` to make the loop finish immediately.
That expectation is not guaranteed here.

---

## Why This Happens

Without `volatile`, `synchronized`, or another happens-before relationship:

- one thread may cache the value
- the JIT may optimize the loop aggressively
- the reading thread may continue using a stale view of memory

The problem is not that the write never happened.
The problem is that the reading thread has no rule forcing it to observe that write in time.

---

## Runnable Example

```java
import java.util.concurrent.TimeUnit;

public class VisibilityBugDemo {

    public static void main(String[] args) throws Exception {
        TaskRunner runner = new TaskRunner();

        Thread worker = new Thread(runner::runLoop, "worker-thread");
        worker.start();

        TimeUnit.SECONDS.sleep(1);
        runner.stop();

        worker.join(1000);
        System.out.println("Worker alive after stop = " + worker.isAlive());
    }

    static final class TaskRunner {
        private boolean running = true;

        void runLoop() {
            long iterations = 0;
            while (running) {
                iterations++;
            }
            System.out.println("Stopped after iterations = " + iterations);
        }

        void stop() {
            running = false;
        }
    }
}
```

This demo is nondeterministic by nature.
That is normal for visibility bugs.

The key point is not whether it fails every time on your laptop.
The key point is that the code has no guarantee.

---

## Production-Style Scenarios

Visibility bugs commonly appear in:

- shutdown flags for background workers
- cache refresh state
- configuration reload signals
- health-state transitions for connection pools
- in-memory feature flags

A service may keep serving requests with old configuration even after another thread “updated” the value.

The bug is easy to dismiss because logs may show the write happened.
The problem is that another thread may still be reading stale state.

---

## Correct Fix with `volatile`

```java
class SafeTaskRunner {
    private volatile boolean running = true;

    void runLoop() {
        while (running) {
            doWork();
        }
    }

    void stop() {
        running = false;
    }

    void doWork() {
    }
}
```

`volatile` works well here because:

- one thread writes a new flag value
- another thread reads the latest flag value
- no compound invariant needs atomic multi-step updates

This is a visibility problem, not a read-modify-write problem.

---

## Correct Fix with Synchronization

```java
class SynchronizedTaskRunner {
    private boolean running = true;

    synchronized void stop() {
        running = false;
    }

    synchronized boolean isRunning() {
        return running;
    }

    void runLoop() {
        while (isRunning()) {
            doWork();
        }
    }

    void doWork() {
    }
}
```

This also works, but it may be heavier than needed for a simple stop flag.

---

## `volatile` Does Not Solve Everything

Developers often overlearn one lesson and start using `volatile` everywhere.

That is also wrong.

`volatile` is suitable for:

- simple state flags
- publication of immutable references
- status fields read by many threads

`volatile` is not enough when:

- updates depend on the previous value
- multiple fields must stay consistent together
- a condition and action must be atomic as one unit

---

## Realistic Example: Config Refresh Signal

```java
class ConfigRefreshCoordinator {
    private volatile long latestVersion = 0;

    void publishNewVersion(long version) {
        latestVersion = version;
    }

    boolean isStale(long workerVersion) {
        return workerVersion < latestVersion;
    }
}
```

This is a good use of `volatile` because workers only need to see the latest published version number.

If the update involved several related fields that had to remain internally consistent, a stronger design would be required.

---

## Testing Notes

Visibility bugs are notoriously hard to prove with one casual run.

Useful practices:

- repeat the test many times
- run on different hardware and JVM settings
- prefer reasoning from Java Memory Model guarantees, not from “it seemed fine”
- use thread dumps and logging carefully, but do not mistake logging side effects for correctness

Sometimes logging accidentally changes timing enough to hide the bug.

---

## Key Takeaways

- A visibility bug happens when a write occurs but another thread is not guaranteed to observe it.
- Absence of failure in testing does not mean correctness.
- `volatile` is appropriate for simple visibility use cases like stop flags and published immutable references.
- `volatile` does not fix compound atomicity problems.

Next post: [Lost Updates in Concurrent Java Code](/java/concurrency/lost-updates-in-concurrent-java-code/)
