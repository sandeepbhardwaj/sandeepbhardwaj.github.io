---
author_profile: true
categories:
- DSA
- Java
date: 2026-04-06
seo_title: "A* Search Pattern in Java – Complete Guide"
seo_description: "Use A* in Java for heuristic-guided shortest path search on grids and weighted maps."
tags: [dsa, java, a-star, graph, pathfinding]
canonical_url: "https://sandeepbhardwaj.github.io/dsa/java/a-star-search-pattern/"
title: "A* Search Pattern in Java — A Detailed Guide"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/a-star-search-pattern-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Heuristic Guided Shortest Path Search"
---

# A* Search Pattern in Java — A Detailed Guide

This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

Use priority by f(n)=g(n)+h(n) to guide shortest path search with an admissible heuristic.

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
// Grid A* skeleton with Manhattan heuristic.
int h(int r, int c, int tr, int tc) { return Math.abs(r - tr) + Math.abs(c - tc); }
```

---

## Complete Grid A* Skeleton

```java
int aStar(int[][] grid, int sr, int sc, int tr, int tc) {
    int m = grid.length, n = grid[0].length;
    int[][] g = new int[m][n];
    for (int[] row : g) Arrays.fill(row, Integer.MAX_VALUE);
    g[sr][sc] = 0;

    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    pq.offer(new int[]{h(sr, sc, tr, tc), 0, sr, sc}); // f, g, r, c

    int[][] dirs = { {1,0}, {-1,0}, {0,1}, {0,-1} };

    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int cg = cur[1], r = cur[2], c = cur[3];
        if (r == tr && c == tc) return cg;
        if (cg != g[r][c]) continue; // stale

        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= m || nc >= n || grid[nr][nc] == 1) continue;
            int ng = cg + 1;
            if (ng < g[nr][nc]) {
                g[nr][nc] = ng;
                int f = ng + h(nr, nc, tr, tc);
                pq.offer(new int[]{f, ng, nr, nc});
            }
        }
    }
    return -1;
}
```

---

## Heuristic Rule (Critical)

For optimality, heuristic must be:

- admissible (never overestimates true remaining cost)
- ideally consistent (triangle inequality style)

On 4-direction unit-cost grid, Manhattan distance is admissible and consistent.

---

## Dry Run (Conceptual)

Start `(0,0)`, target `(2,2)`:

1. push neighbors with priority `f=g+h`
2. node with smallest `f` expanded first
3. stale entries skipped if better `g` already found
4. when target popped, shortest path cost is finalized

A* explores less than plain Dijkstra when heuristic is informative.

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

1. Shortest Path in Binary Matrix (LC 1091)  
   [LeetCode](https://leetcode.com/problems/shortest-path-in-binary-matrix/)
2. The Maze II (LC 505)  
   [LeetCode](https://leetcode.com/problems/the-maze-ii/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
