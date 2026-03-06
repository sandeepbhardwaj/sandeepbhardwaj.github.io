---
author_profile: true
categories:
- DSA
- Java
date: 2026-04-16
seo_title: Manacher Algorithm in Java – Complete Guide
seo_description: Find longest palindromic substrings in linear time in Java with Manacher’s
  algorithm.
tags:
- dsa
- java
- manacher
- palindrome
- strings
title: Manacher Algorithm for Palindromes in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/manacher-algorithm-palindrome-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Linear-Time Palindrome Radius Computation
---
This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

Transform string and expand around centers with mirrored reuse to get O(n) palindrome radii.

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
// Manacher uses transformed string with separators and radius array.
String t = "^#" + String.join("#", s.split("")) + "#$";
int[] p = new int[t.length()];
```

---

## Full Longest Palindrome Extraction

```java
public String longestPalindrome(String s) {
    if (s == null || s.isEmpty()) return "";

    StringBuilder t = new StringBuilder("^");
    for (char c : s.toCharArray()) t.append('#').append(c);
    t.append("#$");

    int n = t.length();
    int[] p = new int[n];
    int center = 0, right = 0;
    int bestLen = 0, bestCenter = 0;

    for (int i = 1; i < n - 1; i++) {
        int mirror = 2 * center - i;
        if (i < right) p[i] = Math.min(right - i, p[mirror]);

        while (t.charAt(i + 1 + p[i]) == t.charAt(i - 1 - p[i])) p[i]++;

        if (i + p[i] > right) {
            center = i;
            right = i + p[i];
        }
        if (p[i] > bestLen) {
            bestLen = p[i];
            bestCenter = i;
        }
    }

    int start = (bestCenter - bestLen) / 2;
    return s.substring(start, start + bestLen);
}
```

---

## Dry Run (Conceptual)

Input: `"babad"`

Transformed string allows odd/even palindromes to be handled uniformly.
Largest radius center corresponds to `"bab"` or `"aba"` (both valid).

Mapping back:

- start index in original string = `(center - radius) / 2`
- length = `radius`

---

## Center-Mirror Invariant

Maintain current best palindrome window `[center - p[center], center + p[center]]`.
For index `i` inside this window, use mirror index to initialize radius before expansion.

This reuse prevents repeated expansion work and yields linear time.

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

1. Longest Palindromic Substring (LC 5)  
   [LeetCode](https://leetcode.com/problems/longest-palindromic-substring/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
