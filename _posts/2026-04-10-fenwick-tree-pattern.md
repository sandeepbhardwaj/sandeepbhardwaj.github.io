---
categories:
- DSA
- Java
date: 2026-04-10
seo_title: Fenwick Tree Pattern in Java - Interview Preparation Guide
seo_description: Use Binary Indexed Tree in Java for prefix sums and point updates
  in logarithmic time.
tags:
- dsa
- java
- fenwick-tree
- bit
- algorithms
title: Fenwick Tree Pattern in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/fenwick-tree-pattern-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Lightweight Prefix Aggregation Structure
---

Fenwick tree is the range-query pattern for prefix aggregates with efficient point updates in a compact array-backed structure.
Strong candidates explain the least-significant-bit jump rule clearly, because that bit trick is the whole reason the structure works.

> [!NOTE] Interview lens
> A strong explanation should name the invariant, the safe transition, and the condition that makes this pattern preferable to brute force.

## Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
| --- | --- | --- | --- |
| 04 10 Fenwick Tree Pattern | you need prefix sums or counts with frequent point updates | store partial prefix aggregates in bit-indexed buckets and jump by lowbit | Prefix Sum with Updates |

## Problem Statement

Given repeated prefix or range-sum queries plus point updates, maintain results faster than rescanning the array each time.

> [!NOTE]
> Emphasize the constraints before coding. The real signal is often whether the brute-force search space, update volume, or graph model makes the naive solution impossible.

## Pattern Recognition Signals

- Keywords in the problem: Fenwick tree, BIT, prefix sum, point update, lowbit.
- Structural signal: each index owns a power-of-two-sized suffix of prefix information.
- Complexity signal: the optimized version avoids repeated rescans, recomputation, or state explosion that brute force would suffer.

> [!IMPORTANT]
> If you need point updates and prefix queries with simpler implementation than a segment tree, think Fenwick tree.

## Java Template

```java
class Fenwick {
    int n; long[] bit;
    Fenwick(int n){ this.n=n; bit=new long[n+1]; }
    void add(int idx,long delta){ for(int i=idx+1;i<=n;i+=i&-i) bit[i]+=delta; }
    long sumPrefix(int idx){ long s=0; for(int i=idx+1;i>0;i-=i&-i) s+=bit[i]; return s; }
}
```

---

## Range Sum Query

Fenwick naturally gives prefix sums.
Range sum `[l..r]` is:

```java
long sumRange(int l, int r) {
    if (l > r) return 0;
    return sumPrefix(r) - (l == 0 ? 0 : sumPrefix(l - 1));
}
```

---

## Dry Run

Array updates:

- add index `0` by `2`
- add index `2` by `5`
- add index `3` by `1`

Then:

- `sumPrefix(3)` gives `8`
- `sumRange(1,3)` gives `6`

Fenwick updates and queries both touch only `O(log n)` internal nodes.

---

## 1-Based Internal Indexing Note

Fenwick tree uses 1-based indexing internally.
Public API can stay 0-based, but conversion (`idx + 1`) must be consistent.

Most bugs come from mixing these index systems.

---

## Problem 1: Prefix Sum with Point Updates

Problem description:
Support `add(index, delta)` and `sumRange(left, right)` on a mutable array.

What we are solving actually:
We want prefix-sum speed without rebuilding the whole prefix array after each update. Fenwick tree stores just enough partial sums to update and query in `O(log n)`.

What we are doing actually:

1. Keep a 1-based internal `bit` array.
2. Move upward with `i += i & -i` during updates.
3. Move downward with `i -= i & -i` during prefix queries.
4. Convert a range sum into two prefix sums.

```java
class Fenwick {
    private final int n;
    private final long[] bit;

    Fenwick(int n) {
        this.n = n;
        this.bit = new long[n + 1];
    }

    void add(int index, long delta) {
        for (int i = index + 1; i <= n; i += i & -i) {
            bit[i] += delta; // Every touched node covers a range that includes this index.
        }
    }

    long sumPrefix(int index) {
        long sum = 0;
        for (int i = index + 1; i > 0; i -= i & -i) {
            sum += bit[i]; // Walk through the disjoint Fenwick blocks that partition [0..index].
        }
        return sum;
    }

    long sumRange(int left, int right) {
        if (left > right) return 0;
        return sumPrefix(right) - (left == 0 ? 0 : sumPrefix(left - 1)); // Inclusive range becomes two prefix sums.
    }
}
```

Debug steps:

- print every internal `i` visited during one `add` and one `sumPrefix`
- test index `0` and index `n - 1` to catch 0-based vs 1-based mistakes
- verify the invariant that `sumPrefix(i)` matches the real array sum from `0..i`

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

1. Count of Smaller Numbers After Self (LC 315)  
   [LeetCode](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)
2. Reverse Pairs (LC 493)  
   [LeetCode](https://leetcode.com/problems/reverse-pairs/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
