---
categories:
- DSA
- Java
date: 2026-03-28
seo_title: Dynamic Programming Pattern in Java - Interview Preparation Guide
seo_description: Master dynamic programming in Java with state definition, transitions,
  memoization, and tabulation patterns.
tags:
- dsa
- java
- dynamic-programming
- dp
- algorithms
title: Dynamic Programming Pattern in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/dynamic-programming-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: State Transitions for Optimal Substructure
---
Dynamic programming is the interview pattern for problems where brute force recomputes the same subproblems again and again.
The hardest part is not coding loops. It is defining the right state and proving the transition.

Strong candidates do not jump straight to a table.
They first explain what the subproblem means, why the recurrence is complete, and whether memoization or tabulation is the clearer implementation.

> [!NOTE] Interview lens
> A strong DP explanation usually has four parts:
> 1. what the state represents,
> 2. what transition combines smaller answers into the current one,
> 3. which base cases make the recurrence valid,
> 4. why memoization or tabulation avoids repeated work.

## Pattern Summary Table

| Pattern | When to use | Key idea | Example problem |
| --- | --- | --- | --- |
| 1D DP | answer at position `i` depends on a small number of earlier positions | roll forward a small state window | House Robber |
| 2D DP | answer depends on two varying dimensions or prefixes | table cell represents a pair of subproblem boundaries | Longest Common Subsequence |
| Top-down memoization | recurrence is easier to write recursively | cache solved subproblems to avoid recomputation | Climbing Stairs |

## Problem Statement

Given an optimization, counting, or decision problem with overlapping subproblems, compute the best answer without recomputing the same states exponentially many times.

Typical interview signals:

- brute force recursion branches heavily
- the same subproblem appears from multiple parent calls
- the answer is built from smaller prefix, suffix, or subset answers
- the prompt asks for max, min, count, or feasibility over many choices

## Pattern Recognition Signals

- Keywords in the problem:
  maximum, minimum, count ways, choose or skip, subsequence, partition, recurrence.
- Structural signals:
  subproblems overlap and the final answer has optimal substructure.
- Complexity signal:
  naive recursion would be exponential, but distinct states are far fewer.

## Visual Intuition

DP solves optimization/counting problems with overlapping subproblems.
The hardest part is state definition, not coding loops.

---

## DP Design Checklist

1. Define state clearly.
2. Write transition relation.
3. Set base cases.
4. Choose memoization or tabulation.
5. Optimize space if needed.

---

## Pattern 1: 1D DP (House Robber)

Problem description:
Choose houses to maximize money without robbing adjacent houses.

What we are doing actually:

1. At each house, decide between skipping it or taking it.
2. `prev1` stores the best answer up to the previous house.
3. `prev2` stores the best answer up to the house before that.

```java
public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int x : nums) {
        int cur = Math.max(prev1, prev2 + x); // Skip current house or rob it.
        prev2 = prev1; // Shift states forward.
        prev1 = cur;
    }
    return prev1;
}
```

Debug steps:

- print `x`, `prev2`, `prev1`, and `cur` each iteration
- verify the state shift order is correct
- test small arrays of size 1, 2, and 3

---

## Dry Run (House Robber)

Input: `[2,7,9,3,1]`

State:

- `prev1` = best up to previous house
- `prev2` = best up to house before previous

Steps:

1. x=2 -> cur=max(0,0+2)=2
2. x=7 -> cur=max(2,0+7)=7
3. x=9 -> cur=max(7,2+9)=11
4. x=3 -> cur=max(11,7+3)=11
5. x=1 -> cur=max(11,11+1)=12

Answer: `12`

---

## Pattern 2: 2D DP (LCS)

Problem description:
Find the length of the longest common subsequence between two strings.

What we are doing actually:

1. `dp[i][j]` represents the answer for prefixes `a[0..i-1]` and `b[0..j-1]`.
2. If characters match, extend the diagonal answer.
3. Otherwise take the better answer from top or left.

```java
public int longestCommonSubsequence(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) {
                dp[i][j] = 1 + dp[i - 1][j - 1]; // Matching character extends subsequence.
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // Skip one char from either string.
            }
        }
    }
    return dp[m][n];
}
```

Debug steps:

- print the DP table for a tiny pair like `"abc"` and `"ac"`
- verify row `0` and column `0` stay at zero
- inspect one match cell and one mismatch cell manually

---

## Pattern 3: Top-Down Memoization (Climbing Stairs)

Problem description:
Count how many distinct ways there are to climb `n` stairs when you can take 1 or 2 steps.

What we are doing actually:

1. Express the recurrence recursively.
2. Cache computed answers in `memo`.
3. Reuse cached values instead of recomputing the same subproblems.

```java
public int climbStairs(int n) {
    int[] memo = new int[n + 1];
    Arrays.fill(memo, -1);
    return solve(n, memo);
}

private int solve(int n, int[] memo) {
    if (n <= 2) return n;
    if (memo[n] != -1) return memo[n]; // Reuse cached result.
    memo[n] = solve(n - 1, memo) + solve(n - 2, memo); // Recurrence relation.
    return memo[n];
}
```

Debug steps:

- print `n` and whether the value came from memo or fresh computation
- verify base cases before memo lookup
- compare recursion count with and without memoization on a small example

---

## Common Mistakes

1. Wrong or incomplete state definition
2. Transition using uncomputed states
3. Incorrect base cases
4. Exponential recursion without memoization

---

## Top-Down vs Bottom-Up Heuristic

- use top-down when recurrence is easier to express recursively
- use bottom-up when dependency order is clear and iterative performance matters

For interview speed, start with top-down to prove recurrence, then convert to tabulation if needed.

---

## DP Debug Checklist

1. print first few DP states/tables
2. verify base row/column initialization
3. validate transition with a tiny handcrafted example
4. ensure answer cell/index matches problem definition

DP bugs are often indexing/base-case bugs, not formula bugs.

---

## Pattern Variations

- knapsack-style DP
- subsequence and string DP
- interval DP
- DP on trees, digits, and bitmasks in advanced follow-ups

## Pattern Composition (Advanced)

- DP + prefix sums for faster transitions
- DP + monotonic deque or convex-style optimization for range-limited transitions
- DP + graphs or topological order when states form a DAG

## Practice Problems

1. Climbing Stairs (LC 70)  
   [LeetCode](https://leetcode.com/problems/climbing-stairs/)
2. House Robber (LC 198)  
   [LeetCode](https://leetcode.com/problems/house-robber/)
3. Coin Change (LC 322)  
   [LeetCode](https://leetcode.com/problems/coin-change/)
4. Longest Increasing Subsequence (LC 300)  
   [LeetCode](https://leetcode.com/problems/longest-increasing-subsequence/)
5. Longest Common Subsequence (LC 1143)  
   [LeetCode](https://leetcode.com/problems/longest-common-subsequence/)
6. Edit Distance (LC 72)  
   [LeetCode](https://leetcode.com/problems/edit-distance/)

---

## Key Takeaways

- the state definition is the real design decision
- memoization proves the recurrence quickly, while tabulation often gives better iterative control
- most DP bugs are state-definition, base-case, or indexing mistakes
- optimize space only after the full state transition is already correct
