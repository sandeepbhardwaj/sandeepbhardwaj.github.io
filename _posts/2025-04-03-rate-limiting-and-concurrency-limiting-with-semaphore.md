---
title: Rate Limiting and Concurrency Limiting with Semaphore
date: 2025-04-03
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- semaphore
- rate-limiting
- concurrency-limiting
- admission-control
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Rate Limiting and Concurrency Limiting with Semaphore
seo_description: Learn what semaphores do well for concurrency limiting, where
  they can approximate rate limiting, and where dedicated rate-control designs
  are better.
header:
  overlay_image: "/assets/images/java-concurrency-module-08-coordination-utilities-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 8
  show_overlay_excerpt: false
---
Semaphores are naturally good at concurrency limiting.

They are only conditionally good at rate limiting.

Those are not the same thing:

- concurrency limiting controls how many operations run at once
- rate limiting controls how many operations may begin over time

Developers often blur these ideas because both are forms of admission control.
But the operational behavior is different.

---

## Problem Statement

Imagine a service calling a flaky third-party dependency.

You may want to guarantee all of the following:

- no more than 10 calls in flight at once
- no more than 100 calls start per second
- overload gets rejected quickly instead of creating huge internal queues

One semaphore can solve the first requirement directly.
It does not fully solve the second by itself.

That distinction is the whole point of this post.

---

## Concurrency Limiting with Semaphore

This is the natural fit.

A semaphore with 10 permits means:

- at most 10 calls can be active at once
- the 11th caller must wait or fail

That directly controls:

- peak downstream fan-out
- connection or thread pressure
- memory growth from too many active tasks

It is often the simplest and most practical safeguard for a slow dependency.

---

## Runnable Example

```java
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

public class SemaphoreConcurrencyLimiterDemo {

    public static void main(String[] args) throws Exception {
        LimitedPartnerClient client = new LimitedPartnerClient(3);

        for (int i = 1; i <= 5; i++) {
            final int requestId = i;
            new Thread(() -> {
                try {
                    String result = client.callPartner("request-" + requestId);
                    System.out.println(result);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }, "caller-" + i).start();
        }
    }

    static final class LimitedPartnerClient {
        private final Semaphore permits;

        LimitedPartnerClient(int maxConcurrentCalls) {
            this.permits = new Semaphore(maxConcurrentCalls);
        }

        String callPartner(String requestId) throws InterruptedException {
            if (!permits.tryAcquire(200, TimeUnit.MILLISECONDS)) {
                return "rejected-" + requestId + "-over-capacity";
            }

            try {
                TimeUnit.MILLISECONDS.sleep(500);
                return "ok-" + requestId;
            } finally {
                permits.release();
            }
        }
    }
}
```

This code is a true concurrency limiter:

- it bounds active work
- it can reject quickly under pressure

That alone often produces a major stability improvement.

---

## Why This Is Not Full Rate Limiting

Suppose each operation finishes quickly.

With a 10-permit semaphore, you might process:

- 10 calls now
- 10 more a few milliseconds later
- many more within the same second

So a semaphore does not inherently enforce:

- X requests per second

It enforces:

- X requests at the same time

This can indirectly lower rate, but it is not the same control surface.

---

## Can a Semaphore Approximate Rate Limiting

Yes, but only in a limited way.

You can treat permits like tokens refilled periodically.
For example:

- start each second with 100 permits
- each request acquires one
- a scheduler replenishes the permits for the next second

That is a coarse token-bucket-like pattern.

But once you need:

- smooth per-time-unit behavior
- burst handling rules
- distributed coordination
- weighted costs

you usually want a dedicated rate-limiting design rather than a plain semaphore alone.

---

## Production Guidance

Use a semaphore directly when the real risk is:

- too many active expensive operations
- downstream collapse from too much fan-out
- resource exhaustion from concurrent in-flight work

Use a dedicated rate-control design when the real contract is:

- API quota per second or minute
- burst policy
- tenant-specific request budgets
- globally coordinated rate enforcement

Many systems need both:

- concurrency limit for local protection
- rate limit for external contract protection

Those are complementary, not competing, controls.

---

## Common Mistakes

### Calling a concurrency limit a rate limit

This leads to false confidence and confused capacity planning.

### Waiting forever for permits

If overload is possible, bounded `tryAcquire` is often safer than unbounded waiting.

Otherwise you may move the queue from the downstream dependency into your own process.

### Ignoring queue growth around the semaphore

A semaphore can protect a resource while still allowing large external request queues to build elsewhere.

You still need a whole-system overload strategy.

---

## Decision Guide

Use `Semaphore` for concurrency limiting when:

- the danger is too many active in-flight operations
- you want to cap local work and protect shared capacity

Use a rate-limiting design when:

- the danger is too many operation starts per time window
- you must honor an external quota or traffic budget

Use both when:

- you need local stability and external contract control at the same time

---

## Key Takeaways

- Semaphores are a natural tool for concurrency limiting, not for precise time-based rate limiting.
- Concurrency limiting protects active capacity; rate limiting controls operation starts over time.
- A semaphore can approximate simple token-style throttling, but dedicated rate-control designs are better for real quotas and burst policies.
- In production systems, the best answer is often both a concurrency limit and a rate limit.

Next post: [Exchanger in Java and When It Is Useful](/java/concurrency/exchanger-in-java-and-when-it-is-useful/)
