---
categories:
- DSA
- Java
date: 2026-04-09
seo_title: Segment Tree Pattern in Java – Complete Guide
seo_description: Answer mutable range queries in Java with segment tree templates
  and update/query patterns.
tags:
- dsa
- java
- segment-tree
- range-query
- algorithms
title: Segment Tree Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/segment-tree-pattern-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Fast Mutable Range Queries
---
This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

Store aggregated values in a tree for fast range query + point update in O(log n).

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
class SegmentTree {
    int n; long[] tree;
    SegmentTree(int[] a) { n = a.length; tree = new long[4*n]; build(1,0,n-1,a); }
    void build(int node,int l,int r,int[] a){ if(l==r){tree[node]=a[l];return;} int m=(l+r)/2; build(node*2,l,m,a); build(node*2+1,m+1,r,a); tree[node]=tree[node*2]+tree[node*2+1]; }
}
```

---

## Query and Update Operations

```java
long query(int node, int l, int r, int ql, int qr) {
    if (qr < l || r < ql) return 0;              // no overlap
    if (ql <= l && r <= qr) return tree[node];   // total overlap
    int m = (l + r) / 2;
    return query(node*2, l, m, ql, qr) + query(node*2+1, m+1, r, ql, qr);
}

void update(int node, int l, int r, int idx, int val) {
    if (l == r) { tree[node] = val; return; }
    int m = (l + r) / 2;
    if (idx <= m) update(node*2, l, m, idx, val);
    else update(node*2+1, m+1, r, idx, val);
    tree[node] = tree[node*2] + tree[node*2+1];
}
```

Time:

- point update: `O(log n)`
- range query: `O(log n)`

---

## Dry Run (Range Sum)

Array: `[2,1,5,3]`

Query sum `[1..3]`:

- combine segments covering values `1,5,3` => `9`

Update index `2` to `4`:

- update leaf for position `2`
- recompute all ancestors on path

Query `[1..3]` again => `8`

Segment tree updates only affected path, not full array.

---

## Problem 1: Range Sum Query with Updates

Problem description:
Support point updates and range sum queries on an array while keeping both operations fast.

What we are solving actually:
Prefix sums answer queries quickly but break on updates. Segment trees keep partial answers for subranges so only the affected path must be rebuilt.

What we are doing actually:

1. Store array values as leaves.
2. Build parent nodes by merging two child ranges.
3. On update, rewrite one leaf and rebuild its ancestors.
4. On query, collect only the segments that exactly cover the requested range.

```java
class SegmentTree {
    private final int n;
    private final long[] tree;

    SegmentTree(int[] nums) {
        n = nums.length;
        tree = new long[2 * n];
        for (int i = 0; i < n; i++) {
            tree[n + i] = nums[i]; // Leaves store the original array values.
        }
        for (int i = n - 1; i > 0; i--) {
            tree[i] = tree[2 * i] + tree[2 * i + 1]; // Parent stores the merged answer of both children.
        }
    }

    void update(int index, int value) {
        int p = index + n;
        tree[p] = value; // Overwrite the exact leaf for this array position.
        for (p /= 2; p > 0; p /= 2) {
            tree[p] = tree[2 * p] + tree[2 * p + 1]; // Rebuild ancestors because their segment answer changed.
        }
    }

    long query(int left, int right) {
        long ans = 0;
        for (int l = left + n, r = right + n; l <= r; l /= 2, r /= 2) {
            if ((l & 1) == 1) ans += tree[l++]; // l is a right child, so that whole segment belongs in the answer.
            if ((r & 1) == 0) ans += tree[r--]; // r is a left child, so include it before moving upward.
        }
        return ans;
    }
}
```

Debug steps:

- print the `tree` array after build and after one update to see which ancestors changed
- test a single-element query like `[3,3]` and a full-range query like `[0,n-1]`
- verify the invariant that every internal node equals the merge of its two children

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

1. Range Sum Query - Mutable (LC 307)  
   [LeetCode](https://leetcode.com/problems/range-sum-query-mutable/)
2. My Calendar I (LC 729)  
   [LeetCode](https://leetcode.com/problems/my-calendar-i/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
