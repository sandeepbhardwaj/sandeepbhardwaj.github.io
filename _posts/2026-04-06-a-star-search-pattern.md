---
title: A* Search Pattern in Java - Interview Preparation Guide
date: 2026-04-06
categories:
- DSA
- Java
tags:
- dsa
- java
- a-star
- graph
- pathfinding
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: A* Search Pattern in Java - Interview Preparation Guide
seo_description: Use A* in Java for heuristic-guided shortest path search on grids
  and weighted maps.
header:
  overlay_image: "/assets/images/a-star-search-pattern-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Heuristic Guided Shortest Path Search
---

A* search is the shortest-path pattern for using a heuristic to guide exploration toward the goal while still preserving optimality.
Strong candidates explain the relationship between `g`, `h`, and `f`, and they know that the heuristic must be admissible, and ideally consistent, for the search to stay correct.

> [!NOTE] Interview lens
> A strong explanation should name the invariant, the safe transition, and the condition that makes this pattern preferable to brute force.

## Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
| --- | --- | --- | --- |
| 04 06 A Star Search Pattern | you need shortest path but a good heuristic can prioritize likely-good states | combine known path cost with estimated remaining cost to guide expansion | Shortest Path in a Grid |

## Problem Statement

Given a graph or grid and a goal state, find an optimal path while exploring fewer states than an uninformed shortest-path search would visit.

> [!NOTE]
> Emphasize the constraints before coding. The real signal is often whether the brute-force search space, update volume, or graph model makes the naive solution impossible.

## Pattern Recognition Signals

- Keywords in the problem: heuristic, f = g + h, goal-directed search, pathfinding.
- Structural signal: the priority queue favors states that are both cheap so far and plausibly close to the target.
- Complexity signal: the optimized version avoids repeated rescans, recomputation, or state explosion that brute force would suffer.

> [!IMPORTANT]
> If you have a shortest-path problem and a domain-specific heuristic that does not overestimate, think A*.

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

## Problem 1: Shortest Path in a Grid

Problem description:
Given a grid with blocked cells, a start cell, and a goal cell, return the minimum number of moves needed to reach the goal.

What we are solving actually:
Plain BFS explores every equally-short frontier, but A* tries to reach the goal faster by prioritizing states that already look promising under an admissible heuristic.

What we are doing actually:

1. Track the best known distance `g` to each cell.
2. Order the heap by `f = g + heuristic`.
3. Skip stale states whose `g` is no longer optimal.
4. Stop when the goal is popped because that path is then optimal.

```java
public int shortestPath(int[][] grid, int[] start, int[] goal) {
    int m = grid.length, n = grid[0].length;
    int[][] best = new int[m][n];
    for (int i = 0; i < m; i++) Arrays.fill(best[i], Integer.MAX_VALUE);

    int sr = start[0], sc = start[1], tr = goal[0], tc = goal[1];
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    best[sr][sc] = 0;
    pq.offer(new int[]{heuristic(sr, sc, tr, tc), 0, sr, sc}); // {f, g, row, col}

    int[][] dirs = new int[][]{
        new int[]{1, 0},
        new int[]{-1, 0},
        new int[]{0, 1},
        new int[]{0, -1}
    };
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int g = cur[1], r = cur[2], c = cur[3];
        if (g != best[r][c]) continue; // Ignore stale entries that lost to a better path later.
        if (r == tr && c == tc) return g; // First goal pop is optimal with an admissible heuristic.

        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nr >= m || nc < 0 || nc >= n || grid[nr][nc] == 1) continue;
            int ng = g + 1;
            if (ng < best[nr][nc]) {
                best[nr][nc] = ng;
                int f = ng + heuristic(nr, nc, tr, tc);
                pq.offer(new int[]{f, ng, nr, nc}); // Smaller f means this state looks closer to an optimal solution.
            }
        }
    }
    return -1;
}

private int heuristic(int r, int c, int tr, int tc) {
    return Math.abs(r - tr) + Math.abs(c - tc); // Manhattan distance never overestimates 4-direction grid cost.
}
```

Debug steps:

- print heap states as `{f, g, row, col}` to see how the heuristic reorders exploration
- test one case where BFS and A* return the same distance but explore different cells
- verify the invariant that `best[r][c]` only decreases when a strictly shorter path is found

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
