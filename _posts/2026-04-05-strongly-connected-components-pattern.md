---
author_profile: true
categories:
- DSA
- Java
date: 2026-04-05
seo_title: SCC Pattern in Java – Complete Guide
seo_description: Decompose directed graphs into SCCs in Java using Kosaraju and low-link
  concepts.
tags:
- dsa
- java
- scc
- graph
- algorithms
title: Strongly Connected Components Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/strongly-connected-components-pattern-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Directed Graph Component Decomposition
---
This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

Collapse directed graph into SCC components using two-pass DFS (Kosaraju) or low-link logic (Tarjan).

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
// Kosaraju skeleton: order by finish time, then DFS on reversed graph.
public int countSCC(int n, List<List<Integer>> g, List<List<Integer>> rg) {
    boolean[] vis = new boolean[n];
    List<Integer> order = new ArrayList<>();
    for (int i = 0; i < n; i++) if (!vis[i]) dfs1(i, g, vis, order);
    Arrays.fill(vis, false);
    int scc = 0;
    for (int i = order.size() - 1; i >= 0; i--) {
        int u = order.get(i);
        if (!vis[u]) { scc++; dfs2(u, rg, vis); }
    }
    return scc;
}
```

---

## Kosaraju in 3 Steps

1. DFS on original graph, push nodes by finish order
2. reverse all edges
3. DFS in reverse finish order on reversed graph; each DFS tree is one SCC

Time complexity stays linear: `O(V + E)`.

---

## Dry Run (Small Directed Graph)

Edges:

- `0 -> 1`, `1 -> 2`, `2 -> 0` (one SCC)
- `2 -> 3`
- `3 -> 4`, `4 -> 3` (second SCC)

SCCs:

- `{0,1,2}`
- `{3,4}`

Kosaraju first pass gives finish order ensuring SCC roots are processed correctly in second pass.

---

## Problem 1: Count Strongly Connected Components

Problem description:
Given a directed graph, count how many strongly connected components it contains.

What we are solving actually:
Reachability in directed graphs is asymmetric, so one DFS is not enough. We need finish order from the original graph and component collection on the reversed graph.

What we are doing actually:

1. Run DFS on the original graph and record nodes by finish time.
2. Reverse all edges.
3. Process nodes in reverse finish order.
4. Each DFS on the reversed graph marks exactly one SCC.

```java
public int countStronglyConnectedComponents(int n, int[][] edges) {
    List<Integer>[] graph = new ArrayList[n];
    List<Integer>[] reverse = new ArrayList[n];
    for (int i = 0; i < n; i++) {
        graph[i] = new ArrayList<>();
        reverse[i] = new ArrayList<>();
    }
    for (int[] edge : edges) {
        graph[edge[0]].add(edge[1]);
        reverse[edge[1]].add(edge[0]); // Reverse graph lets us collect one SCC at a time.
    }

    boolean[] vis = new boolean[n];
    List<Integer> order = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        if (!vis[i]) dfs1(i, graph, vis, order);
    }

    Arrays.fill(vis, false);
    int components = 0;
    for (int i = order.size() - 1; i >= 0; i--) {
        int u = order.get(i);
        if (vis[u]) continue;
        dfs2(u, reverse, vis); // This reverse DFS stays inside one strongly connected component.
        components++;
    }
    return components;
}

private void dfs1(int u, List<Integer>[] graph, boolean[] vis, List<Integer> order) {
    vis[u] = true;
    for (int v : graph[u]) {
        if (!vis[v]) dfs1(v, graph, vis, order);
    }
    order.add(u); // Finish order matters because sink SCCs must be processed first on the reverse graph.
}

private void dfs2(int u, List<Integer>[] reverse, boolean[] vis) {
    vis[u] = true;
    for (int v : reverse[u]) {
        if (!vis[v]) dfs2(v, reverse, vis);
    }
}
```

Debug steps:

- print `order` after the first pass to confirm finish times are collected correctly
- test a graph with one isolated node and one directed cycle
- verify the invariant that one `dfs2` call never crosses into another SCC

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

## Practical Caution

`Critical Connections` (bridges in undirected graph) is related low-link thinking but not SCC decomposition.
For SCC specifically, use Kosaraju or Tarjan on directed graphs.

---

## Practice Set (Recommended Order)

1. Strongly Connected Components reference problems (CF/GFG style)  
2. Critical Connections in a Network (LC 1192)  
   [LeetCode](https://leetcode.com/problems/critical-connections-in-a-network/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
