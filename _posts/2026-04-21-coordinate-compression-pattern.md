---
title: Coordinate Compression Pattern in Java - Interview Preparation Guide
date: 2026-04-21
categories:
- DSA
- Java
tags:
- dsa
- java
- coordinate-compression
- algorithms
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Coordinate Compression Pattern in Java - Interview Preparation Guide
seo_description: Compress sparse numeric ranges in Java to dense indices for efficient
  array-based processing.
header:
  overlay_image: "/assets/images/coordinate-compression-pattern-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Order-Preserving Index Compaction
---

Coordinate compression is the mapping pattern for replacing huge sparse values with dense ranks while preserving relative order.
Strong candidates explain what property must stay invariant after compression: usually ordering, equality, and adjacency in sorted rank space.

> [!NOTE] Interview lens
> A strong explanation should name the invariant, the safe transition, and the condition that makes this pattern preferable to brute force.

## Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
| --- | --- | --- | --- |
| 04 21 Coordinate Compression Pattern | values are too large or sparse for direct indexing but only relative order matters | map distinct sorted values to compact indices without changing comparisons | Range Query Preprocessing |

## Problem Statement

Given very large coordinates or values, compress them into a small index range so arrays, trees, or Fenwick-style structures become feasible.

> [!NOTE]
> Emphasize the constraints before coding. The real signal is often whether the brute-force search space, update volume, or graph model makes the naive solution impossible.

## Pattern Recognition Signals

- Keywords in the problem: large coordinates, rank mapping, sparse values, discretization.
- Structural signal: the algorithm needs dense indices, not the original numeric magnitude.
- Complexity signal: the optimized version avoids repeated rescans, recomputation, or state explosion that brute force would suffer.

> [!IMPORTANT]
> If the values are huge but only order and identity matter, think coordinate compression.

## Java Template

```java
int[] vals = Arrays.stream(points).flatMapToInt(Arrays::stream).distinct().sorted().toArray();
Map<Integer, Integer> idx = new HashMap<>();
for (int i = 0; i < vals.length; i++) idx.put(vals[i], i);
```

---

## Dry Run

Coordinates: `[100, 1000, 50, 100]`

1. unique + sorted values: `[50, 100, 1000]`
2. compressed mapping:
   - `50 -> 0`
   - `100 -> 1`
   - `1000 -> 2`
3. transformed sequence: `[1, 2, 0, 1]`

Relative order is preserved, but value gaps are removed.

---

## Reverse Mapping (When Needed)

If queries/results need original coordinate values, keep reverse array:

```java
int originalValueAtCompressedIndex(int compressed, int[] vals) {
    return vals[compressed];
}
```

Compression is often used internally; output may still require original coordinates.

---

## Inclusive Range Boundary Tip

For interval problems, include all relevant boundaries before compression (for example `l`, `r`, and sometimes `r+1` for difference-array style logic).
Missing a boundary causes subtle off-by-one errors after compression.

---

## Problem 1: Maximum Overlap on Huge Coordinates

Problem description:
Given many inclusive intervals with very large endpoint values, return the maximum number of intervals covering any point.

What we are solving actually:
The coordinates are too large to index directly, but the answer only changes at interval boundaries. Coordinate compression keeps those meaningful points and throws away unused gaps.

What we are doing actually:

1. Collect every start and every `end + 1` boundary.
2. Sort and deduplicate them.
3. Map each real coordinate to a compact index.
4. Run a difference-array scan on the compressed indices.

```java
public int maxOverlap(int[][] intervals) {
    List<Integer> coords = new ArrayList<>();
    for (int[] interval : intervals) {
        coords.add(interval[0]);
        coords.add(interval[1] + 1); // Inclusive [l, r] becomes +1 at l and -1 at r + 1.
    }
    Collections.sort(coords);

    List<Integer> unique = new ArrayList<>();
    for (int x : coords) {
        if (unique.isEmpty() || unique.get(unique.size() - 1) != x) unique.add(x);
    }

    Map<Integer, Integer> id = new HashMap<>();
    for (int i = 0; i < unique.size(); i++) id.put(unique.get(i), i);

    int[] diff = new int[unique.size() + 1];
    for (int[] interval : intervals) {
        diff[id.get(interval[0])]++;
        diff[id.get(interval[1] + 1)]--; // The interval stops contributing after the compressed index for r + 1.
    }

    int active = 0, best = 0;
    for (int i = 0; i < unique.size(); i++) {
        active += diff[i];
        best = Math.max(best, active); // Prefix sum reconstructs overlap count at this compressed point.
    }
    return best;
}
```

Debug steps:

- print the `unique` coordinate list to verify compression order
- test two intervals with a huge numeric gap to confirm unused space does not matter
- verify the invariant that each compressed index stands for a boundary where the overlap count can change

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

1. Falling Squares (LC 699)  
   [LeetCode](https://leetcode.com/problems/falling-squares/)
2. Amount of New Area Painted Each Day (LC 2158)  
   [LeetCode](https://leetcode.com/problems/amount-of-new-area-painted-each-day/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
