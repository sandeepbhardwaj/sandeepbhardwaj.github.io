---
categories:
- DSA
- Java
date: 2026-04-16
seo_title: Manacher Algorithm in Java - Interview Preparation Guide
seo_description: Find longest palindromic substrings in linear time in Java with Manacher’s
  algorithm.
tags:
- dsa
- java
- manacher
- palindrome
- strings
title: Manacher Algorithm for Palindromes in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/manacher-algorithm-palindrome-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Linear-Time Palindrome Radius Computation
---

Manacher’s algorithm is the palindrome pattern for computing longest palindromic spans around every center in linear time.
Strong candidates explain the transformed-string trick and the current palindrome window, because those are what eliminate repeated center expansion.

> [!NOTE] Interview lens
> A strong explanation should name the invariant, the safe transition, and the condition that makes this pattern preferable to brute force.

## Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
| --- | --- | --- | --- |
| 04 16 Manacher Algorithm Palindrome | longest palindromic substring or palindrome radii are needed | mirror palindrome information across the current best center and expand only when necessary | Longest Palindromic Substring |

## Problem Statement

Given a string, compute palindromic span information faster than expanding independently from every center.

> [!NOTE]
> Emphasize the constraints before coding. The real signal is often whether the brute-force search space, update volume, or graph model makes the naive solution impossible.

## Pattern Recognition Signals

- Keywords in the problem: palindrome radius, center expansion, transformed string, mirror index.
- Structural signal: centers inside the current palindrome inherit a lower-bound radius from their mirrored partner.
- Complexity signal: the optimized version avoids repeated rescans, recomputation, or state explosion that brute force would suffer.

> [!IMPORTANT]
> If naive center expansion is too slow for palindrome spans, think Manacher.

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

## Problem 1: Longest Palindromic Substring

Problem description:
Given a string, return its longest palindromic substring.

What we are solving actually:
Expanding around every center is already decent, but Manacher avoids repeating the same symmetry work by mirroring palindrome radii inside the current rightmost palindrome.

What we are doing actually:

1. Transform the string so odd and even length palindromes share one format.
2. Track the current center and right boundary.
3. Use the mirrored radius as a safe starting point.
4. Expand only when the palindrome can grow beyond known information.

```java
public String longestPalindrome(String s) {
    if (s.isEmpty()) return "";

    StringBuilder t = new StringBuilder("^");
    for (char ch : s.toCharArray()) t.append('#').append(ch);
    t.append("#$");

    int[] radius = new int[t.length()];
    int center = 0, right = 0;
    int bestCenter = 0, bestRadius = 0;

    for (int i = 1; i < t.length() - 1; i++) {
        int mirror = 2 * center - i;
        if (i < right) {
            radius[i] = Math.min(right - i, radius[mirror]); // Mirror gives a guaranteed lower bound inside the known palindrome.
        }
        while (t.charAt(i + 1 + radius[i]) == t.charAt(i - 1 - radius[i])) {
            radius[i]++; // Expand only beyond the already-confirmed mirrored region.
        }
        if (i + radius[i] > right) {
            center = i;
            right = i + radius[i]; // Update the rightmost palindrome we know so far.
        }
        if (radius[i] > bestRadius) {
            bestRadius = radius[i];
            bestCenter = i;
        }
    }

    int start = (bestCenter - bestRadius) / 2; // Map transformed indices back to the original string.
    return s.substring(start, start + bestRadius);
}
```

Debug steps:

- print the transformed string and `radius` values for a small input like `"abba"`
- test both odd and even palindrome winners, such as `"babad"` and `"cbbd"`
- verify the invariant that `right` is always the farthest confirmed palindrome boundary seen so far

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
