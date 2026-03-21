---
categories:
- DSA
- Java
date: 2026-04-17
seo_title: Rolling Hash Pattern in Java – Complete Guide
seo_description: Apply rolling hash in Java for substring comparison, duplicate detection,
  and string indexing.
tags:
- dsa
- java
- rolling-hash
- strings
- algorithms
title: Rolling Hash Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/rolling-hash-pattern-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Compact String Fingerprinting
---
This article goes deeper into intuition, constraints, implementation templates, and tradeoffs for production-grade Java solutions.

---

## Why This Pattern Matters

Map strings to numeric fingerprints to compare substrings quickly in O(1) after preprocessing.

Use this pattern when brute-force introduces repeated work, unstable latency, or unnecessary memory pressure.

---

## Java Template

```java
// Prefix-hash + power arrays for O(1) substring hash.
long[] pref = new long[n + 1], pow = new long[n + 1];
pow[0] = 1;
```

---

## O(1) Substring Hash Query

```java
class RollingHash {
    private static final long MOD = 1_000_000_007L;
    private static final long BASE = 911382323L;
    private final long[] pref, pow;

    RollingHash(String s) {
        int n = s.length();
        pref = new long[n + 1];
        pow = new long[n + 1];
        pow[0] = 1;
        for (int i = 0; i < n; i++) {
            pref[i + 1] = (pref[i] * BASE + s.charAt(i)) % MOD;
            pow[i + 1] = (pow[i] * BASE) % MOD;
        }
    }

    long hash(int l, int r) { // inclusive
        long val = (pref[r + 1] - (pref[l] * pow[r - l + 1]) % MOD) % MOD;
        return val < 0 ? val + MOD : val;
    }
}
```

---

## Dry Run

String: `"abcd"`

- compare substring `"bc"` (`[1..2]`) with another range quickly via `hash(l,r)`
- both queries are O(1) after O(n) preprocessing

This is powerful for repeated substring equality checks in binary-search-on-answer style problems.

---

## Collision Rule

Equal hash does not always mean equal string.
For critical correctness:

- verify by direct compare on hash match, or
- use double hashing (two mod values).

Use collision-safe strategy in production-sensitive matching logic.

---

## Problem 1: Substring Equality Queries

Problem description:
Given many queries asking whether `s[l1..r1]` equals `s[l2..r2]`, answer each query quickly.

What we are solving actually:
Direct substring comparison costs linear time per query. Rolling hash turns each substring into a reusable numeric fingerprint so repeated equality checks become constant time after preprocessing.

What we are doing actually:

1. Build prefix hashes and powers of the base.
2. Remove the left contribution to recover any substring hash.
3. Normalize the value under the modulus.
4. Compare hashes only for substrings of the same length.

```java
class RollingHash {
    private static final long BASE = 911382323L;
    private static final long MOD = 1_000_000_007L;
    private final long[] prefix;
    private final long[] power;

    RollingHash(String s) {
        int n = s.length();
        prefix = new long[n + 1];
        power = new long[n + 1];
        power[0] = 1;
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = (prefix[i] * BASE + s.charAt(i)) % MOD; // Prefix hash extends the previous window by one character.
            power[i + 1] = (power[i] * BASE) % MOD;
        }
    }

    long hash(int left, int right) {
        long raw = prefix[right + 1] - (prefix[left] * power[right - left + 1]) % MOD;
        return raw < 0 ? raw + MOD : raw; // Normalize after removing the left contribution.
    }

    boolean same(int l1, int r1, int l2, int r2) {
        if (r1 - l1 != r2 - l2) return false; // Different lengths cannot represent equal substrings.
        return hash(l1, r1) == hash(l2, r2);
    }
}
```

Debug steps:

- print `prefix` and `power` for a short string like `"abac"`
- test one equal-query pair and one unequal-query pair of the same length
- verify the invariant that `hash(l, r)` is derived only from `prefix` values and the corresponding power length

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

1. Distinct Echo Substrings (LC 1316)  
   [LeetCode](https://leetcode.com/problems/distinct-echo-substrings/)
2. Longest Duplicate Substring (LC 1044)  
   [LeetCode](https://leetcode.com/problems/longest-duplicate-substring/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
