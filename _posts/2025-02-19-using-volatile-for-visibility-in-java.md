---
title: Using volatile for Visibility in Java
date: 2025-02-19
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- volatile
- visibility
- flags
- configuration
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Using volatile for Visibility in Java
seo_description: Learn how to use volatile correctly for visibility in Java with
  practical examples like stop flags, config snapshots, and status publishing.
header:
  overlay_image: "/assets/images/java-concurrency-module-05-volatile-immutability-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 5
  show_overlay_excerpt: false
---
The previous article explained what `volatile` is and what it is not.

This article focuses on correct use in real code.

The pattern is simple:

- one thread publishes simple state
- another thread must observe that state promptly and correctly

When that is the real problem, `volatile` is often the cleanest solution.

---

## Problem Statement

Backend code frequently needs to share state like:

- “stop this worker”
- “the latest config snapshot is version 42”
- “this service is now RUNNING”

These are not multi-step transactional updates.
They are published state changes.

That is the sweet spot for `volatile`.

---

## Example 1: Stop Flag

```java
class PollingWorker {
    private volatile boolean running = true;

    void stop() {
        running = false;
    }

    void runLoop() {
        while (running) {
            poll();
        }
    }

    void poll() {
    }
}
```

This is the classic correct use case.

Why it works:

- one thread writes the flag
- another thread reads the flag
- there is no compound update around the flag itself

---

## Runnable Example: Shutdown-Aware Poller

```java
import java.util.concurrent.TimeUnit;

public class VolatileVisibilityDemo {

    public static void main(String[] args) throws Exception {
        PollingWorker worker = new PollingWorker();
        Thread thread = new Thread(worker::runLoop, "polling-worker");

        thread.start();
        TimeUnit.SECONDS.sleep(1);

        worker.stop();
        thread.join();

        System.out.println("Worker exited");
    }

    static final class PollingWorker {
        private volatile boolean running = true;

        void stop() {
            running = false;
        }

        void runLoop() {
            while (running) {
                // Simulate polling work.
            }
        }
    }
}
```

This is intentionally minimal because the point is the visibility guarantee, not the work inside the loop.

---

## Example 2: Immutable Config Snapshot

```java
class ConfigManager {
    private volatile AppConfig current =
            new AppConfig("https://payments.internal", 3);

    AppConfig current() {
        return current;
    }

    void reload(AppConfig newConfig) {
        current = newConfig;
    }
}

final class AppConfig {
    private final String endpoint;
    private final int retries;

    AppConfig(String endpoint, int retries) {
        this.endpoint = endpoint;
        this.retries = retries;
    }
}
```

This pattern is strong because:

- the reference is published with `volatile`
- the object itself is immutable
- readers observe whole snapshots rather than in-place mutation

This is a very common production pattern.

---

## Example 3: Service Lifecycle State

```java
enum ServiceState {
    STARTING, RUNNING, STOPPING, STOPPED
}

class ServiceLifecycle {
    private volatile ServiceState state = ServiceState.STARTING;

    void markRunning() {
        state = ServiceState.RUNNING;
    }

    ServiceState state() {
        return state;
    }
}
```

This works because the field represents one published status value.

If later logic depends on several fields moving together with the state, then `volatile` alone is no longer enough.

---

## Production-Style Scenario

Imagine a routing layer in a payment service:

- a background refresh task builds a new immutable routing table snapshot
- request threads read the current snapshot on every request
- the refresh task swaps the reference when a new version is ready

That is an excellent `volatile` use case because:

- one field represents the current published snapshot
- readers do not modify it
- the new version replaces the old version atomically at the reference level

This is far better than mutating a shared routing object in place.

---

## When `volatile` Is a Good Fit

Use it when:

- the field stands alone as the state you care about
- the update is simple publication, not a compound transaction
- the referenced object is immutable or effectively immutable
- the problem is visibility, not exclusion

---

## When It Is the Wrong Fit

Do not use `volatile` alone when:

- several related fields must change together
- you need check-then-act correctness
- updates depend on the previous value
- the object behind the reference is still being mutated concurrently

Safe visibility of a reference is not the same thing as safe mutation of the object graph behind it.

---

## Common Mistakes

- putting `volatile` on a reference to a mutable map and then updating the map from multiple threads
- using `volatile int` for counters
- mixing a volatile flag with unsafely shared associated data

The field may be visible while the surrounding design is still broken.

---

## Key Takeaways

- `volatile` is practical and powerful when the real need is visibility of one published value.
- Stop flags, immutable config snapshots, and lifecycle status fields are strong use cases.
- It works best when the field represents one clear piece of truth.
- Once the logic becomes compound or multi-field, move to atomics or locking.

Next post: [Why volatile Does Not Make Compound Actions Atomic](/java/concurrency/why-volatile-does-not-make-compound-actions-atomic/)
