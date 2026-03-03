---
author_profile: true
categories:
- DSA
- Java
date: 2026-04-07
seo_title: "Floyd-Warshall Algorithm in Java – Complete Guide"
seo_description: "Compute all-pairs shortest paths in Java with dynamic programming over intermediate nodes."
tags: [dsa, java, floyd-warshall, graph, algorithms]
canonical_url: "https://sandeepbhardwaj.github.io/dsa/java/floyd-warshall-algorithm/"
title: "Floyd-Warshall Algorithm in Java — A Detailed Guide"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/floyd-warshall-algorithm-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "All-Pairs Shortest Path DP"
---

# Floyd-Warshall Algorithm in Java — A Detailed Guide

This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

Dynamic programming over intermediate vertices computes all-pairs shortest paths in O(n^3).

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
public int[][] floydWarshall(int[][] dist) {
    int n = dist.length;
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] == Integer.MAX_VALUE || dist[k][j] == Integer.MAX_VALUE) continue;
                dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
            }
        }
    }
    return dist;
}
```

---

## Initialization Rules

Before running transitions:

- `dist[i][i] = 0`
- direct edge weight for connected pairs
- `INF` for no direct edge

Use large finite `INF` (for example `1_000_000_000`) to reduce overflow risk in additions.

---

## Dry Run (3 Nodes)

Edges:

- `0 -> 1 = 4`
- `1 -> 2 = 3`
- `0 -> 2 = 10`

At `k=1`, path `0 -> 1 -> 2` gives `4 + 3 = 7`, improving `dist[0][2]` from `10` to `7`.

This is the core DP recurrence in action:

`dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`

---

## Negative Cycle Detection

After algorithm:

```java
for (int i = 0; i < n; i++) {
    if (dist[i][i] < 0) {
        // negative cycle reachable from i
    }
}
```

A negative diagonal entry indicates a negative cycle.

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

1. Find the City With the Smallest Number of Neighbors (LC 1334)  
   [LeetCode](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
