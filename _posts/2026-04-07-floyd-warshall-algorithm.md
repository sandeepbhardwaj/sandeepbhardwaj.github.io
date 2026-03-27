---
title: Floyd-Warshall Algorithm in Java - Interview Preparation Guide
date: 2026-04-07
categories:
- DSA
- Java
tags:
- dsa
- java
- floyd-warshall
- graph
- algorithms
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Floyd-Warshall Algorithm in Java - Interview Preparation Guide
seo_description: Compute all-pairs shortest paths in Java with dynamic programming
  over intermediate nodes.
header:
  overlay_image: "/assets/images/floyd-warshall-algorithm-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: All-Pairs Shortest Path DP
---

Floyd-Warshall is the dynamic-programming pattern for all-pairs shortest paths when every node can potentially act as an intermediate waypoint.
Strong candidates explain the “allowed intermediates up to k” state clearly, because that is the real reason the cubic recurrence is correct.

> [!NOTE] Interview lens
> A strong explanation should name the invariant, the safe transition, and the condition that makes this pattern preferable to brute force.

## Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
| --- | --- | --- | --- |
| 04 07 Floyd Warshall Algorithm | you need shortest distances between every pair of nodes | allow one more intermediate node at a time and relax every pair through it | All-Pairs Shortest Paths |

## Problem Statement

Given a weighted directed graph, compute shortest distances between all node pairs and detect negative cycles if they exist.

> [!NOTE]
> Emphasize the constraints before coding. The real signal is often whether the brute-force search space, update volume, or graph model makes the naive solution impossible.

## Pattern Recognition Signals

- Keywords in the problem: all pairs shortest path, transitive closure, negative cycle, dense graph.
- Structural signal: after processing node k, paths may use only intermediates from the first k nodes.
- Complexity signal: the optimized version avoids repeated rescans, recomputation, or state explosion that brute force would suffer.

> [!IMPORTANT]
> If the problem asks for every-pair shortest distances, not just one source, think Floyd-Warshall.

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

## Problem 1: All-Pairs Shortest Paths

Problem description:
Given a weighted directed graph, compute the shortest distance between every pair of nodes.

What we are solving actually:
Re-running single-source shortest path from every node works, but Floyd-Warshall has a cleaner DP view: after step `k`, paths may only use intermediate nodes from `0..k`.

What we are doing actually:

1. Initialize `dist[i][j]` with direct edge weights and `0` on the diagonal.
2. Pick each node `k` as the newest allowed intermediate node.
3. Try routing every `i -> j` path through `k`.
4. Keep the shorter of the old route and the `i -> k -> j` route.

```java
public int[][] floydWarshall(int n, int[][] edges) {
    int INF = 1_000_000_000;
    int[][] dist = new int[n][n];
    for (int i = 0; i < n; i++) {
        Arrays.fill(dist[i], INF);
        dist[i][i] = 0;
    }
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        dist[u][v] = Math.min(dist[u][v], w); // Keep the lightest direct edge if duplicates exist.
    }

    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            if (dist[i][k] == INF) continue; // No path to k means this intermediate route cannot help.
            for (int j = 0; j < n; j++) {
                if (dist[k][j] == INF) continue;
                dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]); // Allow k inside the path.
            }
        }
    }
    return dist;
}
```

Debug steps:

- print the matrix after each `k` iteration to see which paths improved
- test one triangle graph where the indirect path beats the direct edge
- verify the invariant that after processing `k`, no shortest path uses intermediates larger than `k`

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
