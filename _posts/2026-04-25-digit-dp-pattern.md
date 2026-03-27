---
title: Digit DP Pattern in Java - Interview Preparation Guide
date: 2026-04-25
categories:
- DSA
- Java
tags:
- dsa
- java
- digit-dp
- dynamic-programming
- algorithms
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Digit DP Pattern in Java - Interview Preparation Guide
seo_description: Count numbers under digit constraints in Java with tight-bound state
  transitions.
header:
  overlay_image: "/assets/images/digit-dp-pattern-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Counting Under Numeric Bound Constraints
---

Digit DP is the counting pattern for numeric ranges where brute force over every number is impossible but digit-by-digit constraints are manageable.
Strong candidates explain the `tight` flag and state compression carefully, because the whole technique depends on counting valid prefixes without exceeding the bound.

> [!NOTE] Interview lens
> A strong explanation should name the invariant, the safe transition, and the condition that makes this pattern preferable to brute force.

## Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
| --- | --- | --- | --- |
| 04 25 Digit Dp Pattern | counting or optimizing over a huge numeric range depends on digit-wise rules | build the number digit by digit while tracking bound-tightness and extra state | Count Numbers with Digit Constraints |

## Problem Statement

Given a numeric range and a digit-based rule, count or optimize over all valid numbers without iterating through the entire range.

> [!NOTE]
> Emphasize the constraints before coding. The real signal is often whether the brute-force search space, update volume, or graph model makes the naive solution impossible.

## Pattern Recognition Signals

- Keywords in the problem: digit DP, tight flag, leading zeros, count numbers in [0,n].
- Structural signal: every partial prefix is either still tied to the bound or already safely below it.
- Complexity signal: the optimized version avoids repeated rescans, recomputation, or state explosion that brute force would suffer.

> [!IMPORTANT]
> If the domain is a huge integer range and the rule is digit-based, think digit DP.

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

## Problem 1: Count Numbers Up to N with a Target Digit Sum

Problem description:
Given `n` and a target digit sum, count how many numbers in `[0, n]` have digits summing exactly to that target.

What we are solving actually:
Brute force checks every number separately. Digit DP builds the number left to right and uses `tight` to know whether we are still forced to match the prefix of `n`.

What we are doing actually:

1. Process digits from left to right.
2. Track remaining digit sum and whether the prefix is still tight.
3. Reuse memo only when the state is already loose.
4. Count all valid completions when we reach the end.

```java
public int countWithDigitSum(long n, int target) {
    char[] digits = Long.toString(n).toCharArray();
    Integer[][] memo = new Integer[digits.length][target + 1];
    return dfs(0, target, true, digits, memo);
}

private int dfs(int pos, int remaining, boolean tight, char[] digits, Integer[][] memo) {
    if (remaining < 0) return 0;
    if (pos == digits.length) return remaining == 0 ? 1 : 0;
    if (!tight && memo[pos][remaining] != null) return memo[pos][remaining]; // Loose states repeat across many branches.

    int limit = tight ? digits[pos] - '0' : 9;
    int ways = 0;
    for (int d = 0; d <= limit; d++) {
        ways += dfs(pos + 1, remaining - d, tight && d == limit, digits, memo); // Tight stays true only if we match the prefix exactly.
    }

    if (!tight) memo[pos][remaining] = ways;
    return ways;
}
```

Debug steps:

- print `(pos, remaining, tight)` for a tiny input like `n = 25`, `target = 4`
- test target `0` to confirm leading zeros are handled as shorter numbers
- verify the invariant that loose states never depend on the exact prefix chosen earlier

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
