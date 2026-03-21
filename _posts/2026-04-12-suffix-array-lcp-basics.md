---
categories:
- DSA
- Java
date: 2026-04-12
seo_title: Suffix Array and LCP Basics in Java - Interview Preparation Guide
seo_description: Understand suffix array and LCP basics in Java for substring ranking
  and repetition analysis.
tags:
- dsa
- java
- suffix-array
- lcp
- strings
title: Suffix Array and LCP Basics in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/suffix-array-lcp-basics-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Suffix Ordering and Prefix Overlap
---
This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

Sort suffixes and derive LCP array to answer substring and repeated-pattern problems.

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
// Suffix array conceptual skeleton (O(n log n) sorting by suffix).
Integer[] sa = new Integer[s.length()];
for (int i = 0; i < s.length(); i++) sa[i] = i;
Arrays.sort(sa, Comparator.comparing(s::substring));
```

---

## Dry Run (`"banana"`)

Suffixes:

- `0: banana`
- `1: anana`
- `2: nana`
- `3: ana`
- `4: na`
- `5: a`

Sorted suffix array indices:

`[5, 3, 1, 0, 4, 2]`

LCP between adjacent sorted suffixes:

- LCP(`a`, `ana`) = 1
- LCP(`ana`, `anana`) = 3
- LCP(`anana`, `banana`) = 0
- LCP(`banana`, `na`) = 0
- LCP(`na`, `nana`) = 2

Max LCP = `3` => repeated substring `"ana"`.

---

## LCP Array (Kasai Overview)

Given suffix array, build rank array and compute LCP in linear time:

```java
int[] buildLcp(String s, int[] sa) {
    int n = s.length();
    int[] rank = new int[n], lcp = new int[n - 1];
    for (int i = 0; i < n; i++) rank[sa[i]] = i;

    int k = 0;
    for (int i = 0; i < n; i++) {
        if (rank[i] == n - 1) { k = 0; continue; }
        int j = sa[rank[i] + 1];
        while (i + k < n && j + k < n && s.charAt(i + k) == s.charAt(j + k)) k++;
        lcp[rank[i]] = k;
        if (k > 0) k--;
    }
    return lcp;
}
```

This is the practical base for repeated-substring and lexicographic range queries.

---

## Practical Constraint Note

`Comparator.comparing(s::substring)` is easy to teach but expensive for large strings.
For larger inputs, use efficient suffix-array construction (doubling / SA-IS) to avoid heavy substring allocation.

---

## Problem 1: Longest Repeated Substring

Problem description:
Given a string, return the longest substring that appears at least twice.

What we are solving actually:
Comparing every pair of substrings is too expensive. Once suffixes are sorted, the best repeated substring must come from the largest common prefix of two adjacent suffixes.

What we are doing actually:

1. Build the suffix array so suffixes are in lexicographic order.
2. Build the LCP array for adjacent suffixes.
3. Scan for the maximum LCP value.
4. Recover the repeated substring from that suffix start index.

```java
public String longestRepeatedSubstring(String s) {
    int[] sa = buildSuffixArray(s);
    int[] lcp = buildLcp(s, sa);
    int bestLen = 0;
    int bestStart = 0;

    for (int i = 1; i < sa.length; i++) {
        if (lcp[i] > bestLen) {
            bestLen = lcp[i]; // Adjacent suffixes with the largest LCP define the best repeated substring.
            bestStart = sa[i];
        }
    }
    return bestLen == 0 ? "" : s.substring(bestStart, bestStart + bestLen);
}
```

Debug steps:

- print the suffix array and LCP array for `"banana"` to confirm the ordering by hand
- test a string with no repetition like `"abcd"`
- verify the invariant that every `lcp[i]` compares suffix `sa[i - 1]` with suffix `sa[i]`

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

1. Longest Duplicate Substring (LC 1044)  
   [LeetCode](https://leetcode.com/problems/longest-duplicate-substring/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
