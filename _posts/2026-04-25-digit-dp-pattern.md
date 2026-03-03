---
author_profile: true
categories:
- DSA
- Java
date: 2026-04-25
seo_title: "Digit DP Pattern in Java – Complete Guide"
seo_description: "Count numbers under digit constraints in Java with tight-bound state transitions."
tags: [dsa, java, digit-dp, dynamic-programming, algorithms]
canonical_url: "https://sandeepbhardwaj.github.io/dsa/java/digit-dp-pattern/"
title: "Digit DP Pattern in Java — A Detailed Guide"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/digit-dp-pattern-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Counting Under Numeric Bound Constraints"
---

# Digit DP Pattern in Java — A Detailed Guide

This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

DP on digits with tight/started/state flags to count numbers satisfying constraints.

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
// Digit DP state: pos, tight, started, sum/mod/etc.
long dfs(int pos, int tight, int started, int state) { return 0L; }
```

---

## Common State Design

Typical Digit DP memo keys:

- `pos`: current digit index
- `tight`: whether prefix is equal to bound so far
- `started`: whether non-leading-zero digit has started number
- extra state: sum, modulo, mask, previous digit, etc.

Memoization is usually allowed only when `tight == 0` (or fully represented in key).

---

## Example: Count Numbers <= N with Digit Sum = S

```java
long countWithDigitSum(String n, int target) {
    char[] d = n.toCharArray();
    Long[][][] memo = new Long[d.length + 1][2][target + 1];
    return dfs(0, 1, 0, d, target, memo);
}

long dfs(int pos, int tight, int sum, char[] d, int target, Long[][][] memo) {
    if (sum > target) return 0;
    if (pos == d.length) return sum == target ? 1 : 0;
    if (memo[pos][tight][sum] != null) return memo[pos][tight][sum];

    int lim = tight == 1 ? d[pos] - '0' : 9;
    long ans = 0;
    for (int dig = 0; dig <= lim; dig++) {
        int nt = (tight == 1 && dig == lim) ? 1 : 0;
        ans += dfs(pos + 1, nt, sum + dig, d, target, memo);
    }
    return memo[pos][tight][sum] = ans;
}
```

Count in range `[L, R]` using: `count(R) - count(L-1)`.

---

## Dry Run Idea

For `N=25`, target sum `=2`:

- valid numbers: `2, 11, 20`
- DP explores digit-by-digit with tight control and sum accumulation
- answer = `3`

Tiny manual checks like this are crucial to validate state transitions.

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

1. Numbers At Most N Given Digit Set (LC 902)  
   [LeetCode](https://leetcode.com/problems/numbers-at-most-n-given-digit-set/)
2. Count Special Integers (LC 2376)  
   [LeetCode](https://leetcode.com/problems/count-special-integers/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
