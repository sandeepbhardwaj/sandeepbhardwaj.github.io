---
author_profile: true
categories:
- DSA
- Java
date: 2026-04-29
seo_title: LRU LFU Cache Design in Java – Complete Guide
seo_description: Design O(1) LRU/LFU caches in Java using hash maps and linked/bucket
  structures.
tags:
- dsa
- java
- cache-design
- lru
- lfu
title: LRU and LFU Cache Design in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/lru-lfu-cache-design-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Constant-Time Cache Eviction Structures
---
This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

Combine hashmap + linked structures (or frequency buckets) for O(1) cache operations.

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
// LRU skeleton: HashMap<K,Node> + Doubly Linked List
class LRUCache {
    private final Map<Integer, Node> map = new HashMap<>();
    // get/put in O(1) by moving node to front
}
```

---

## Practical LRU Shortcut (Java)

For many use cases, `LinkedHashMap` with access-order gives compact LRU:

```java
class LRU<K, V> extends LinkedHashMap<K, V> {
    private final int cap;
    LRU(int cap) { super(16, 0.75f, true); this.cap = cap; }
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > cap;
    }
}
```

This is not always enough for advanced metrics/TTL policies, but great for baseline LRU behavior.

---

## LRU Dry Run

Capacity `2`, operations:

1. `put(1,A)` -> `[1]`
2. `put(2,B)` -> `[2,1]` (most recent first conceptual)
3. `get(1)` -> `[1,2]`
4. `put(3,C)` -> evict `2`, cache `[3,1]`

Eviction is based on recency, not frequency.

---

## LFU State Model

LFU usually needs:

- key -> node (value + frequency)
- frequency -> ordered keys (to break ties by recency)
- `minFreq` tracker

All updates must keep these structures consistent, otherwise evictions become incorrect.

---

## Production Cache Design Notes

- include TTL/refresh policy (LRU/LFU alone is often insufficient)
- measure hit ratio and eviction churn
- guard against cache stampede on misses
- define behavior on cache backend failure (degrade gracefully)

Cache correctness and observability matter as much as asymptotic `O(1)` operations.

---

## Problem 1: Design an LRU Cache

Problem description:
Design a cache with `get` and `put` in `O(1)` where the least recently used key is evicted when capacity is full.

What we are solving actually:
Hash lookup alone is not enough because we must also know the recency order. The clean shortcut in Java is `LinkedHashMap` with access-order enabled.

What we are doing actually:

1. Store key-value pairs in an access-ordered `LinkedHashMap`.
2. On `get`, return the value and let access-order refresh recency.
3. On `put`, update existing keys in place.
4. When full, evict the eldest entry before inserting a new key.

```java
class LRUCache {
    private final int capacity;
    private final LinkedHashMap<Integer, Integer> map;

    LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new LinkedHashMap<>(16, 0.75f, true); // accessOrder=true keeps iteration order aligned with recency.
    }

    int get(int key) {
        return map.getOrDefault(key, -1); // A successful access moves the key to the most-recent position.
    }

    void put(int key, int value) {
        if (capacity == 0) return;
        if (map.containsKey(key)) {
            map.put(key, value); // Updating an existing key also refreshes its recency.
            return;
        }
        if (map.size() == capacity) {
            int lruKey = map.keySet().iterator().next();
            map.remove(lruKey); // The eldest access-ordered entry is the one to evict.
        }
        map.put(key, value); // New key becomes most recently used.
    }
}
```

Debug steps:

- print the key iteration order after each `get` and `put`
- test an update on an existing key to confirm it refreshes recency instead of duplicating state
- verify the invariant that the first key in iteration order is always the next eviction candidate

---

## Problem-Fit Checklist

- Identify whether input size or query count requires preprocessing or specialized data structures.
- Confirm problem constraints (sorted input, non-negative weights, DAG-only, immutable array, etc.).
- Validate that the pattern gives asymptotic improvement over brute-force under worst-case input.
- Define explicit success criteria: value only, index recovery, count, path reconstruction, or ordering.

---

## Invariant and Reasoning

- Write one invariant that must stay true after every transition (loop step, recursion return, or update).
- Ensure each step makes measurable progress toward termination.
- Guard boundary states explicitly (empty input, singleton, duplicates, overflow, disconnected graph).
- Add a quick correctness check using a tiny hand-worked example before coding full solution.

---

## Complexity and Design Notes

- Compute time complexity for both preprocessing and per-query/per-update operations.
- Track memory overhead and object allocations, not only Big-O notation.
- Prefer primitives and tight loops in hot paths to reduce GC pressure in Java.
- If multiple variants exist, choose the one with the simplest correctness proof first.

---

## Production Perspective

- Convert algorithmic states into explicit metrics (queue size, active nodes, cache hit ratio, relaxation count).
- Add guardrails for pathological inputs to avoid latency spikes.
- Keep implementation deterministic where possible to simplify debugging and incident analysis.
- Separate pure algorithm logic from I/O and parsing so the core stays testable.

---

## Implementation Workflow

1. Implement the minimal correct template with clear invariants.
2. Add edge-case tests before optimizing.
3. Measure complexity-sensitive operations on realistic input sizes.
4. Refactor for readability only after behavior is locked by tests.

---

## Common Mistakes

1. Choosing the pattern without proving problem fit.
2. Ignoring edge cases (empty input, duplicates, overflow, disconnected state).
3. Mixing multiple strategies without clear invariants.
4. No complexity analysis against worst-case input.

---

## Practice Set (Recommended Order)

1. LRU Cache (LC 146)  
   [LeetCode](https://leetcode.com/problems/lru-cache/)
2. LFU Cache (LC 460)  
   [LeetCode](https://leetcode.com/problems/lfu-cache/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
