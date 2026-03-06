---
author_profile: true
categories:
- DSA
- Java
date: 2026-04-15
seo_title: Z-Algorithm String Matching in Java – Complete Guide
seo_description: Compute Z-array in Java for prefix-match based string search and
  border analysis.
tags:
- dsa
- java
- z-algorithm
- strings
- algorithms
title: Z-Algorithm for String Matching in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/z-algorithm-string-matching-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Prefix Match Array Techniques
---
This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

Z-array stores longest prefix match at each index and enables linear pattern checks.

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
public int[] zArray(String s) {
    int n = s.length();
    int[] z = new int[n];
    for (int i = 1, l = 0, r = 0; i < n; i++) {
        if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
        while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
        if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
    }
    return z;
}
```

---

## Pattern Matching with Z-Array

For finding `pattern` in `text`:

1. build string `pattern + "#" + text`
2. compute Z-array
3. any index with `Z[i] == pattern.length()` is a match

```java
public List<Integer> zMatch(String text, String pat) {
    String s = pat + "#" + text;
    int[] z = zArray(s);
    List<Integer> out = new ArrayList<>();
    int m = pat.length();
    for (int i = m + 1; i < s.length(); i++) {
        if (z[i] == m) out.add(i - m - 1);
    }
    return out;
}
```

---

## Dry Run (Conceptual)

`text="ababcab"`, `pat="ab"`

Combined: `"ab#ababcab"`

Z values equal to `2` at text offsets where `"ab"` starts:

- index `0`
- index `2`
- index `5`

So matches are `[0,2,5]`.

---

## Z-Box Invariant

Maintain `[l, r]` as rightmost segment where substring matches prefix.
If `i` is inside this box, reuse previous Z information before extending.

This reuse is why algorithm is linear `O(n)`.

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

1. Pattern matching tasks via Z-array (CP)
2. Longest Happy Prefix (LC 1392)  
   [LeetCode](https://leetcode.com/problems/longest-happy-prefix/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
