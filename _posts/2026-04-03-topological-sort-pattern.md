---
author_profile: true
categories:
- DSA
- Java
date: 2026-04-03
seo_title: Topological Sort Pattern in Java – Complete Guide
seo_description: Solve dependency ordering problems in Java using Kahn BFS and DFS
  post-order methods.
tags:
- dsa
- java
- topological-sort
- graph
- algorithms
title: Topological Sort Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/topological-sort-pattern-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Dependency Resolution in DAGs
---
This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

Use indegree (Kahn) or DFS finish order to produce valid ordering in DAG workflows.

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
public List<Integer> topoSort(int n, int[][] edges) {
    List<List<Integer>> g = new ArrayList<>();
    for (int i = 0; i < n; i++) g.add(new ArrayList<>());
    int[] indeg = new int[n];
    for (int[] e : edges) { g.get(e[0]).add(e[1]); indeg[e[1]]++; }

    Queue<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);

    List<Integer> order = new ArrayList<>();
    while (!q.isEmpty()) {
        int u = q.poll();
        order.add(u);
        for (int v : g.get(u)) if (--indeg[v] == 0) q.offer(v);
    }
    return order;
}
```

---

## Dry Run (Kahn’s Algorithm)

`n=4`, edges: `0->1`, `0->2`, `1->3`, `2->3`

Initial indegree:

- `0:0, 1:1, 2:1, 3:2`

Queue starts with `[0]`.

1. pop `0`, order `[0]`, indegree of `1,2` becomes `0` -> enqueue `1,2`
2. pop `1`, order `[0,1]`, indegree of `3` becomes `1`
3. pop `2`, order `[0,1,2]`, indegree of `3` becomes `0` -> enqueue `3`
4. pop `3`, order `[0,1,2,3]`

All nodes processed => DAG and valid topological ordering.

---

## Cycle Detection Rule

Kahn’s method detects cycle by count:

- if `order.size() < n`, graph has at least one cycle
- if equal, ordering exists

Always include this check in dependency-resolution problems.

---

## DFS Topological Sort (Alternative)

DFS post-order + reverse gives topological order (for DAG):

1. run DFS from each unvisited node
2. push node after exploring neighbors
3. reverse finish order

For cycle detection in DFS, track recursion stack (`visiting` state).

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

1. Course Schedule (LC 207)  
   [LeetCode](https://leetcode.com/problems/course-schedule/)
2. Course Schedule II (LC 210)  
   [LeetCode](https://leetcode.com/problems/course-schedule-ii/)
3. Alien Dictionary (LC 269)  
   [LeetCode](https://leetcode.com/problems/alien-dictionary/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
