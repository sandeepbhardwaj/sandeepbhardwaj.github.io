---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-30
seo_title: Distributed Locking Patterns in Java Guide
seo_description: Coordinate distributed critical sections safely with lease-based
  Java locking patterns.
tags:
- java
- distributed-locking
- redis
- zookeeper
title: Distributed Locking Patterns in Java (Redis ZooKeeper)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Cross-Node Mutual Exclusion with Lease Safety
---
Distributed locks coordinate critical sections across service instances.
They are lease-based coordination primitives, not equivalent to in-process `synchronized`.

---

## Use Cases That Justify Locking

- singleton scheduled job across nodes
- serialized operation on shared external resource
- short critical section where duplicate execution is harmful

If you can design idempotent or partitioned processing, prefer that over global locks.

---

## Redis Lease Lock Pattern

Acquire with unique owner token and TTL.
Release only if token still matches owner.

```java
String token = UUID.randomUUID().toString();
boolean acquired = redis.set(lockKey, token, SetArgs.Builder.nx().px(10_000));

if (!acquired) {
    return;
}

try {
    doCriticalWork();
} finally {
    // Lua script: delete only if value == token
    redis.eval(RELEASE_SCRIPT, List.of(lockKey), List.of(token));
}
```

Never `DEL` lock key blindly.

---

## TTL and Lease Renewal

TTL must exceed expected critical section duration plus jitter buffer.
If work can run long:

- renew lease periodically while owner is healthy
- stop work immediately if renewal fails

Lock-loss handling is part of correctness, not optional enhancement.

---

## ZooKeeper/Curator Alternative

ZooKeeper-style ephemeral nodes give stronger session semantics for coordination and leader election.
Use when you need:

- stronger coordination guarantees
- watch-based failover signaling
- richer election patterns than simple key lease

Cost: more operational complexity than single Redis lock key.

---

## Dry Run: Scheduler Lock Loss Scenario

1. node A acquires lock and starts job.
2. GC pause/network issue prevents lease renewal.
3. lease expires; node B acquires same lock.
4. node A resumes and tries to continue work.
5. lock-check detects ownership loss; node A aborts.

Without step 5, duplicate execution happens.

---

## Safety Checklist

- unique token per lock owner
- compare-and-delete release
- bounded critical section duration
- lock renewal with health checks
- idempotent job actions in case of split execution window
- metrics for acquire latency, contention, renewal failure, lock loss

---

## Common Mistakes

- assuming distributed lock gives exactly-once side effects
- using long unbounded lock TTLs
- forgetting owner check on unlock
- running large business workflows under one coarse global lock

---

## Key Takeaways

- distributed locking is a failure-sensitive coordination mechanism.
- lease ownership checks and lock-loss handling are mandatory.
- use partitioned/idempotent designs first; lock only where truly required.
