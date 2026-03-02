---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-28
seo_title: Dynamic Programming Pattern in Java – Complete Guide
seo_description: Master dynamic programming in Java with state definition, transitions, memoization, and tabulation patterns.
tags:
- dsa
- java
- dynamic-programming
- dp
- algorithms
canonical_url: https://sandeepbhardwaj.github.io/dsa/java/dynamic-programming-pattern/
title: Dynamic Programming Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: /assets/images/dynamic-programming-banner.svg
  overlay_filter: 0.35
  caption: "State Transitions for Optimal Substructure"
---

# Dynamic Programming Pattern in Java — A Detailed Guide

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

```java
public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int x : nums) {
        int cur = Math.max(prev1, prev2 + x);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}
```

---

## Pattern 2: 2D DP (LCS)

```java
public int longestCommonSubsequence(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}
```

---

## Pattern 3: Top-Down Memoization (Climbing Stairs)

```java
public int climbStairs(int n) {
    int[] memo = new int[n + 1];
    Arrays.fill(memo, -1);
    return solve(n, memo);
}

private int solve(int n, int[] memo) {
    if (n <= 2) return n;
    if (memo[n] != -1) return memo[n];
    memo[n] = solve(n - 1, memo) + solve(n - 2, memo);
    return memo[n];
}
```

---

## Common Mistakes

1. Wrong or incomplete state definition
2. Transition using uncomputed states
3. Incorrect base cases
4. Exponential recursion without memoization

---

## Practice Set (Recommended Order)

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

- DP is about correct state modeling and transitions.
- Start with clear recurrence before coding.
- Space optimization is a refinement, not the first step.
