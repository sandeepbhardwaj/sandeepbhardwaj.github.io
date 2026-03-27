---
categories:
- DSA
- Java
date: 2026-04-02
seo_title: Greedy Algorithms Pattern in Java - Interview Preparation Guide
seo_description: Learn greedy strategy design in Java with proof mindset and classic
  scheduling/selection examples.
tags:
- dsa
- java
- greedy
- algorithms
title: Greedy Algorithms Pattern in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/greedy-algorithms-pattern-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Local Choices with Global Guarantees
---

Greedy algorithms are the interview pattern for problems where one local choice can be proven safe enough to lead to a global optimum.
Strong candidates do not just say “sort and scan.” They explain the local rule, the invariant it preserves, and the exchange argument or proof idea that makes the greedy choice correct.

> [!NOTE] Interview lens
> A strong explanation should name the invariant, the safe transition, and the condition that makes this pattern preferable to brute force.

## Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
| --- | --- | --- | --- |
| 04 02 Greedy Algorithms Pattern | a local choice can be justified by ordering or exchange reasoning | take the safest local improvement while preserving the future search space | Jump Game |

## Problem Statement

Given many possible choices, build an optimal or feasible answer by repeatedly taking the best next move without backtracking through all combinations.

> [!NOTE]
> Emphasize the constraints before coding. The real signal is often whether the brute-force search space, update volume, or graph model makes the naive solution impossible.

## Pattern Recognition Signals

- Keywords in the problem: earliest finish, farthest reach, minimum removals, choose best next.
- Structural signal: the remaining subproblem keeps the same shape after a locally optimal choice.
- Complexity signal: the optimized version avoids repeated rescans, recomputation, or state explosion that brute force would suffer.

> [!IMPORTANT]
> If you can sort, make one local choice, and argue that any optimal answer can be transformed to include it, think greedy.

## Java Template

```java
public int maxNonOverlappingIntervals(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[1]));
    int count = 0, end = Integer.MIN_VALUE;
    for (int[] in : intervals) {
        if (in[0] >= end) {
            count++;
            end = in[1];
        }
    }
    return count;
}
```

---

## Dry Run (Interval Selection)

Intervals: `[[1,3],[2,4],[3,5],[6,7]]`

Sort by end:

`[1,3], [2,4], [3,5], [6,7]`

Selection:

1. pick `[1,3]` (end=3)
2. skip `[2,4]` because `2 < 3`
3. pick `[3,5]` because `3 >= 3` (end=5)
4. pick `[6,7]` because `6 >= 5`

Result count = `3`

---

## Greedy Proof Mindset (Exchange Argument)

To justify greedy:

1. define local choice rule (for example earliest finishing interval)
2. show any optimal solution can be transformed to include that choice
3. remaining subproblem stays same shape

If you cannot prove this transformation, greedy may be incorrect.

---

## Common Greedy Families

- interval scheduling/merging
- minimum arrows / meeting room removals
- jump reachability
- activity selection
- Huffman-like merge-cost optimization with heaps

Many “sort then linear scan” problems are greedy at core.

---

## Problem 1: Jump Game

Problem description:
Given an array where `nums[i]` is the maximum jump length from index `i`, decide whether the last index is reachable.

What we are solving actually:
We do not need to commit to one exact jump path. The real question is whether the reachable frontier ever stops moving forward before we reach the end.

What we are doing actually:

1. Track the farthest index we can currently reach.
2. Walk left to right only while the current index is still reachable.
3. Greedily expand the frontier with `i + nums[i]`.
4. Return early once the last index becomes reachable.

```java
public boolean canJump(int[] nums) {
    int farthest = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > farthest) return false; // We cannot even stand on this index, so the path already failed.
        farthest = Math.max(farthest, i + nums[i]); // Keep the best reachable frontier seen so far.
        if (farthest >= nums.length - 1) return true; // Once the end is inside the frontier, we are done.
    }
    return true;
}
```

Debug steps:

- print `i` and `farthest` after each iteration to see where progress stalls
- test `[0]` and `[3,2,1,0,4]` to cover trivial success and classic failure
- verify the invariant that every index up to `farthest` is reachable from some earlier jump

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

1. Jump Game (LC 55)  
   [LeetCode](https://leetcode.com/problems/jump-game/)
2. Gas Station (LC 134)  
   [LeetCode](https://leetcode.com/problems/gas-station/)
3. Partition Labels (LC 763)  
   [LeetCode](https://leetcode.com/problems/partition-labels/)

---

## Key Takeaways

- This pattern is most effective when transitions are explicit and invariants are enforced at every step.
- Strong preconditions and boundary handling make these implementations production-safe.
- Reuse this template and adapt it per problem constraints.
