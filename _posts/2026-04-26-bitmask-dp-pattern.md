---
categories:
- DSA
- Java
date: 2026-04-26
seo_title: Bitmask DP Pattern in Java – Complete Guide
seo_description: Model subset states in Java with bitmask DP for assignment, TSP-style,
  and covering problems.
tags:
- dsa
- java
- bitmask-dp
- dynamic-programming
title: Bitmask DP Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/bitmask-dp-pattern-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Subset State Dynamic Programming
---
This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

Represent subsets as bitmasks and transition over remaining choices.

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
int N = 1 << n;
int[] dp = new int[N];
Arrays.fill(dp, Integer.MAX_VALUE / 2);
dp[0] = 0;
for (int mask = 0; mask < N; mask++) {
    for (int nxt = 0; nxt < n; nxt++) if ((mask & (1 << nxt)) == 0) {
        int nm = mask | (1 << nxt);
        dp[nm] = Math.min(dp[nm], dp[mask] + cost(mask, nxt));
    }
}
```

---

## Dry Run (Tiny Assignment-Style)

`n=3` => masks from `000` to `111`

- `dp[000]=0`
- choose item `0` -> `dp[001]`
- choose item `1` -> `dp[010]`
- ...
- transitions keep improving `dp[newMask]` from smaller subsets

Final answer is `dp[111]` (all elements included).

This subset-growth order is the core invariant.

---

## Useful Bit Operations

- check bit: `(mask & (1 << i)) != 0`
- set bit: `mask | (1 << i)`
- remove bit: `mask & ~(1 << i)`
- iterate set bits:

```java
for (int sub = mask; sub > 0; sub &= (sub - 1)) {
    int bit = Integer.numberOfTrailingZeros(sub);
    // process bit
}
```

Efficient bit iteration matters in tight DP loops.

---

## Feasibility Rule of Thumb

Bitmask DP is usually practical for `n <= 20` (sometimes up to ~22 with optimizations).
Beyond that, state space `2^n` often becomes too large.

Always check `2^n` memory/time before choosing this pattern.

---

## Problem 1: Traveling Salesman on a Small Graph

Problem description:
Given a complete graph of small size, return the minimum tour cost that starts at node `0`, visits every node once, and comes back to `0`.

What we are solving actually:
The order of visited cities matters, but only through two pieces of state: which cities are already used and where we currently stand. Bitmask DP compresses that state efficiently.

What we are doing actually:

1. Let `mask` represent the visited set.
2. Let `u` represent the current city.
3. Try every unvisited next city.
4. Memoize the best completion cost for each `(mask, u)` state.

```java
public int tsp(int[][] dist) {
    int n = dist.length;
    int[][] memo = new int[1 << n][n];
    for (int[] row : memo) Arrays.fill(row, -1);
    return dfs(1, 0, dist, memo);
}

private int dfs(int mask, int u, int[][] dist, int[][] memo) {
    int n = dist.length;
    if (mask == (1 << n) - 1) return dist[u][0]; // All cities visited, so close the tour back to the start.
    if (memo[mask][u] != -1) return memo[mask][u];

    int best = Integer.MAX_VALUE / 2;
    for (int v = 0; v < n; v++) {
        if ((mask & (1 << v)) != 0) continue; // Skip cities already present in this visited-set state.
        int next = dist[u][v] + dfs(mask | (1 << v), v, dist, memo);
        best = Math.min(best, next); // Try every legal next city and keep the cheapest completion.
    }
    return memo[mask][u] = best;
}
```

Debug steps:

- print `(mask, u)` in binary for a tiny graph with `n = 4`
- test one graph where a greedy nearest-city choice is not optimal
- verify the invariant that `memo[mask][u]` only depends on cities not yet present in `mask`

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

1. Partition to K Equal Sum Subsets (LC 698)  
   [LeetCode](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)
2. Shortest Path Visiting All Nodes (LC 847)  
   [LeetCode](https://leetcode.com/problems/shortest-path-visiting-all-nodes/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
