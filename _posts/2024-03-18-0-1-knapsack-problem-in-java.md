---
title: "0/1 Knapsack Problem in Java"
date: '2024-03-18'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- dynamic-programming
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "0/1 Knapsack Problem in Java"
seo_description: "Understand 0/1 Knapsack Problem in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Dynamic Programming Problems in Java
  show_overlay_excerpt: false
---
0/1 Knapsack Problem is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: 0/1 Knapsack Problem

Problem description:
We are given a problem around **0/1 Knapsack Problem** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. define the state in words before filling code or a table
2. write the transition from smaller states to the current state
3. use recursion or subtree decomposition and table-based state transitions so repeated subproblems are not recomputed blindly
4. verify base cases first because one wrong seed poisons the whole DP

## Why This Problem Matters

- dynamic programming is easier when state and transition are named before code is written
- most DP mistakes come from weak base cases or double-counting transitions
- 0/1 Knapsack Problem is useful because the recurrence becomes the real solution, not the loop syntax

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

import java.util.Arrays;

/**
 * Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in
 * the knapsack.
 * In other words, given two integer arrays val[0..n-1] and wt[0..n-1] which represent values and weights
 * associated with n items respectively.
 * Also given an integer W which represents knapsack capacity, find out the maximum value subset of val[] such that sum
 * of the weights of this subset is smaller than or equal to W.
 * You cannot break an item, either pick the complete item or don’t pick it (0-1 property).
 */
public class KnapsackProblem {

	/**
	 * @param wt
	 * @param val
	 * @param w
	 * @param n
	 * @return
	 */
	public static int knapsackRecursion(int[] wt, int[] val, int w, int n) {
		//base condition either weight is zero or there is no value
		if (n == 0 || w == 0)
			return 0;

		// Return the maximum of two cases:
		// (1) nth item included
		// (2) not included
		if (wt[n - 1] <= w)
			return Math.max(val[n - 1] + knapsackRecursion(wt, val, w - wt[n - 1], n - 1), knapsackRecursion(wt, val, w, n - 1));
		else // if(wt[n-1]>w)
			return knapsackRecursion(wt, val, w, n - 1);
	}

	/**
	 * Memoization Technique (an extension of recursive approach)
	 *
	 * @param wt
	 * @param val
	 * @param w
	 * @param n
	 * @param dp
	 * @return
	 */
	public static int knapsackRecursionMemoization(int[] wt, int[] val, int w, int n, int[][] dp) {
		//base condition either weight is zero or there is no value
		if (n == 0 || w == 0)
			return 0;

		if (dp[n][w] != -1) // already having value for n and w then return
			return dp[n][w];

		// Return the maximum of two cases:
		// (1) nth item included
		// (2) not included
		if (wt[n - 1] <= w)
			return dp[n][w] = Math.max(val[n - 1] + knapsackRecursionMemoization(wt, val, w - wt[n - 1], n - 1, dp), knapsackRecursionMemoization(wt, val, w, n - 1, dp));
		else // if(wt[n-1]>w)
			return dp[n][w] = knapsackRecursionMemoization(wt, val, w, n - 1, dp);
	}

	/**
	 * Top-down approach
	 *
	 * @param wt
	 * @param val
	 * @param w
	 * @param n
	 * @return
	 */
	public static int knapsack(int wt[], int val[], int w, int n) {
		int i, j;
		int dp[][] = new int[n + 1][w + 1];

		for (i = 0; i <= n; i++) {
			for (j = 0; j <= w; j++) {
				if (i == 0 || j == 0) {
					dp[i][j] = 0;
				} else if (wt[i - 1] <= j) {
					dp[i][j] = Math.max(val[i - 1] + dp[i - 1][j - wt[i - 1]], dp[i - 1][j]);
				} else {
					dp[i][j] = dp[i - 1][j];
				}
			}
		}
		return dp[n][w];
	}

	// Driver code
	public static void main(String[] args) {
		int val[] = new int[]{60, 100, 120};
		int wt[] = new int[]{10, 20, 30};
		int w = 50;
		int n = val.length;

		int result = knapsackRecursion(wt, val, w, n);
		System.out.println("Max total value in knapsack :" + result);

		// Declare the table dynamically
		int dp[][] = new int[n + 1][w + 1];

		// Loop to initially filled the table with -1
		Arrays.stream(dp).forEach(a -> Arrays.fill(a, -1));

		System.out.println("Max total value in knapsack :" + knapsackRecursionMemoization(wt, val, w, n, dp));

		System.out.println("Max total value in knapsack using top-down approach :" + knapsack(wt, val, w, n));
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run 0/1 Knapsack Problem by filling only the first few states or table cells by hand. If the first transitions are not obvious on paper, they will not become clearer in code.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- base state with amount or size zero
- state values that are unreachable
- table initialization that silently changes all later answers

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on recursion or subtree decomposition and table-based state transitions. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- write the base row or base column on paper first
- print a tiny DP table for a small example
- check whether each transition reads from already valid states
- verify unreachable states are not treated as real answers

## Key Takeaways

- 0/1 Knapsack Problem becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
