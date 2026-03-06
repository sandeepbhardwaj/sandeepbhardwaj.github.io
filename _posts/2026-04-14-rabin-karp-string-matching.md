---
author_profile: true
categories:
- DSA
- Java
date: 2026-04-14
seo_title: Rabin-Karp String Matching in Java – Complete Guide
seo_description: Use rolling hash in Java for efficient string matching and multi-pattern
  scanning.
tags:
- dsa
- java
- rabin-karp
- rolling-hash
- strings
title: Rabin-Karp String Matching in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/rabin-karp-string-matching-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Hash-Based Substring Search
---
This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

Use rolling hash windows to compare substrings efficiently with collision checks.

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
// Rolling hash window update.
long hash = 0;
for (int i = 0; i < m; i++) hash = (hash * base + s.charAt(i)) % mod;
```

---

## Single-Pattern Search Example

```java
public int rabinKarp(String text, String pat) {
    int n = text.length(), m = pat.length();
    if (m == 0) return 0;
    if (m > n) return -1;

    long mod = 1_000_000_007L, base = 911382323L;
    long pow = 1, ph = 0, th = 0;
    for (int i = 0; i < m; i++) {
        ph = (ph * base + pat.charAt(i)) % mod;
        th = (th * base + text.charAt(i)) % mod;
        if (i > 0) pow = (pow * base) % mod;
    }

    for (int i = 0; i + m <= n; i++) {
        if (ph == th && text.regionMatches(i, pat, 0, m)) return i; // collision-safe check
        if (i + m < n) {
            th = (th - text.charAt(i) * pow) % mod;
            if (th < 0) th += mod;
            th = (th * base + text.charAt(i + m)) % mod;
        }
    }
    return -1;
}
```

---

## Dry Run (Conceptual)

Text: `"abracadabra"`, pattern: `"cad"` (`m=3`)

1. compute hash of pattern and first window `"abr"`
2. slide one char each step, update hash in O(1)
3. when hash matches at window `"cad"`, verify exact substring to avoid collision
4. return starting index

Rolling hash avoids re-hashing full substring each shift.

---

## Collision Handling Rule

Hash match is necessary, not sufficient.
Always verify actual substring equality before declaring match.

For very large-scale matching, use double hashing to reduce collision probability further.

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
2. Repeated DNA Sequences (LC 187)  
   [LeetCode](https://leetcode.com/problems/repeated-dna-sequences/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
