---
categories:
- DSA
- Java
date: 2026-04-08
seo_title: Bellman-Ford Algorithm in Java – Complete Guide
seo_description: Handle negative edge weights and detect negative cycles in Java using
  Bellman-Ford.
tags:
- dsa
- java
- bellman-ford
- graph
- algorithms
title: Bellman-Ford Algorithm in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/bellman-ford-algorithm-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Negative Edge Shortest Paths
---
This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

Relax all edges repeatedly to support negative edges and detect negative cycles.

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
public int[] bellmanFord(int n, int[][] edges, int src) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    for (int i = 1; i < n; i++) {
        for (int[] e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
        }
    }
    return dist;
}
```

---

## Negative Cycle Detection Pass

After `n-1` relaxations, run one more edge pass:

```java
boolean hasNegativeCycle = false;
for (int[] e : edges) {
    int u = e[0], v = e[1], w = e[2];
    if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
        hasNegativeCycle = true;
        break;
    }
}
```

If any distance still improves, a negative cycle is reachable.

---

## Dry Run (Simple Case)

Edges:

- `0 -> 1 (4)`
- `0 -> 2 (5)`
- `1 -> 2 (-2)`

`src=0`

Pass 1:

- `dist[1]=4`, `dist[2]=5`, then via `1->2`, `dist[2]=2`

Further passes no longer improve.
Final shortest distance to node `2` is `2`.

---

## Early-Exit Optimization

Track whether any relaxation happened in current pass.
If none, stop early.

```java
boolean changed = false;
// inside pass, set changed=true on update
if (!changed) break;
```

This significantly speeds up easy graphs while preserving correctness.

---

## Problem 1: Single-Source Shortest Path with Negative Edges

Problem description:
Given a weighted directed graph that may contain negative edges, return shortest distances from a source node and detect a reachable negative cycle.

What we are solving actually:
Dijkstra breaks when negative edges exist. Bellman-Ford instead relaxes all edges repeatedly and uses one extra pass to prove whether a negative cycle is still improving the answer.

What we are doing actually:

1. Start with distance `0` at the source and infinity elsewhere.
2. Relax every edge `n - 1` times.
3. Stop early if an entire pass makes no change.
4. Run one more pass to detect a reachable negative cycle.

```java
public int[] bellmanFord(int n, int[][] edges, int src) {
    int INF = 1_000_000_000;
    int[] dist = new int[n];
    Arrays.fill(dist, INF);
    dist[src] = 0;

    for (int i = 1; i < n; i++) {
        boolean changed = false;
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (dist[u] == INF) continue; // Unreached nodes cannot relax outgoing edges yet.
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w; // Found a shorter path using at most i edges.
                changed = true;
            }
        }
        if (!changed) break; // No update means all shortest distances are already stable.
    }

    for (int[] edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        if (dist[u] != INF && dist[u] + w < dist[v]) {
            return null; // One more improvement proves a reachable negative cycle exists.
        }
    }
    return dist;
}
```

Debug steps:

- print the `dist` array after each full relaxation pass
- test one graph with a negative edge but no negative cycle, and one with a reachable negative cycle
- verify the invariant that each pass only shortens paths that use one more edge than before

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

1. Network Delay Time (LC 743)  
   [LeetCode](https://leetcode.com/problems/network-delay-time/)
2. Cheapest Flights Within K Stops (LC 787)  
   [LeetCode](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
