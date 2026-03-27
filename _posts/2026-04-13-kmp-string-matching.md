---
categories:
- DSA
- Java
date: 2026-04-13
seo_title: KMP String Matching in Java - Interview Preparation Guide
seo_description: Implement linear-time substring search in Java using LPS prefix-function
  preprocessing.
tags:
- dsa
- java
- kmp
- strings
- algorithms
title: KMP String Matching in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/kmp-string-matching-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Linear-Time Pattern Matching
---

KMP is the string-matching pattern for finding a pattern in linear time by reusing prefix information after mismatches.
Strong candidates explain the prefix-function or LPS array in words, not just code, because it is the core invariant that prevents backtracking in the text.

> [!NOTE] Interview lens
> A strong explanation should name the invariant, the safe transition, and the condition that makes this pattern preferable to brute force.

## Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
| --- | --- | --- | --- |
| 04 13 Kmp String Matching | you need exact pattern search without rescanning already-matched text | reuse the longest proper prefix that is also a suffix after mismatch | Find All Pattern Occurrences |

## Problem Statement

Given a text and a pattern, find matches efficiently even when the pattern contains repeated prefix structure that brute force would keep rechecking.

> [!NOTE]
> Emphasize the constraints before coding. The real signal is often whether the brute-force search space, update volume, or graph model makes the naive solution impossible.

## Pattern Recognition Signals

- Keywords in the problem: pattern search, LPS, prefix function, fallback after mismatch.
- Structural signal: mismatch handling jumps inside the pattern using already-known prefix overlap.
- Complexity signal: the optimized version avoids repeated rescans, recomputation, or state explosion that brute force would suffer.

> [!IMPORTANT]
> If exact string search needs to stay linear despite repeated prefixes, think KMP.

## Java Template

```java
public int[] lps(String p) {
    int n = p.length();
    int[] lps = new int[n];
    for (int i = 1, len = 0; i < n;) {
        if (p.charAt(i) == p.charAt(len)) lps[i++] = ++len;
        else if (len > 0) len = lps[len - 1];
        else lps[i++] = 0;
    }
    return lps;
}
```

---

## KMP Search Function

```java
public int firstMatch(String text, String pattern) {
    if (pattern.isEmpty()) return 0;
    int[] lps = lps(pattern);
    int i = 0, j = 0;

    while (i < text.length()) {
        if (text.charAt(i) == pattern.charAt(j)) {
            i++; j++;
            if (j == pattern.length()) return i - j;
        } else if (j > 0) {
            j = lps[j - 1];
        } else {
            i++;
        }
    }
    return -1;
}
```

---

## Dry Run (LPS for `"ababaca"`)

Pattern: `a b a b a c a`

LPS values:

- `lps[0]=0`
- `lps[1]=0`
- `lps[2]=1`
- `lps[3]=2`
- `lps[4]=3`
- mismatch at `c` -> fallback -> `lps[5]=0`
- `lps[6]=1`

Final LPS: `[0,0,1,2,3,0,1]`

LPS tells how far pattern index can jump on mismatch without re-checking known prefix matches.

---

## When KMP Is Worth It

- repeated searches of same pattern
- large text where `O(n*m)` worst-case is unacceptable
- deterministic linear-time requirement

For one-off tiny inputs, simpler built-in search may be sufficient.

---

## Problem 1: First Occurrence of a Pattern

Problem description:
Given `haystack` and `needle`, return the first index where `needle` appears in `haystack`, or `-1` if it does not appear.

What we are solving actually:
Naively restarting from the next text position wastes matched work. KMP keeps the longest reusable prefix with the LPS table and jumps there after a mismatch.

What we are doing actually:

1. Precompute `lps[i]`, the longest proper prefix that is also a suffix for each prefix of the pattern.
2. Scan the text once with pointer `j` into the pattern.
3. On mismatch, fall back using `lps` instead of restarting at zero.
4. When `j` reaches the full pattern length, we found the answer.

```java
public int strStr(String haystack, String needle) {
    if (needle.isEmpty()) return 0;
    int[] lps = buildLps(needle);
    int j = 0;

    for (int i = 0; i < haystack.length(); i++) {
        while (j > 0 && haystack.charAt(i) != needle.charAt(j)) {
            j = lps[j - 1]; // Fall back to the longest prefix that is still a valid partial match.
        }
        if (haystack.charAt(i) == needle.charAt(j)) {
            j++; // Extend the current matched prefix.
            if (j == needle.length()) return i - j + 1; // Full pattern matched ending at i.
        }
    }
    return -1;
}

private int[] buildLps(String pattern) {
    int[] lps = new int[pattern.length()];
    for (int i = 1, len = 0; i < pattern.length(); ) {
        if (pattern.charAt(i) == pattern.charAt(len)) {
            lps[i++] = ++len; // Extend the current border by one matching character.
        } else if (len > 0) {
            len = lps[len - 1]; // Reuse the next-smaller border instead of restarting completely.
        } else {
            lps[i++] = 0;
        }
    }
    return lps;
}
```

Debug steps:

- print the `lps` array for a pattern like `"ababaca"`
- on each mismatch, log the old and new `j` values to see the fallback jump
- verify the invariant that `j` always equals the matched prefix length after processing `haystack[0..i]`

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

1. Find the Index of the First Occurrence in a String (LC 28)  
   [LeetCode](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)
2. Repeated Substring Pattern (LC 459)  
   [LeetCode](https://leetcode.com/problems/repeated-substring-pattern/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
