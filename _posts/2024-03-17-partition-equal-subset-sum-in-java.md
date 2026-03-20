---
title: "Partition Equal Subset Sum in Java"
date: '2024-03-17'
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
seo_title: "Partition Equal Subset Sum in Java"
seo_description: "Understand partition equal subset sum in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Dynamic Programming Problems in Java
  show_overlay_excerpt: false
---
Partition Equal Subset Sum is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Partition Equal Subset Sum

Problem description:
We are given a problem around **Partition Equal Subset Sum** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

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
- partition equal subset sum is useful because the recurrence becomes the real solution, not the loop syntax

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

/**
 * 416. Partition Equal Subset Sum
 * Given a non-empty array nums containing only positive integers, find if the array can be partitioned into two subsets
 * such that the sum of elements in both subsets is equal.
 * <p>
 * Example 1:
 * Input: nums = [1,5,11,5]
 * Output: true
 * Explanation: The array can be partitioned as [1, 5, 5] and [11].
 * <p>
 * Example 2:
 * Input: nums = [1,2,3,5]
 * Output: false
 * Explanation: The array cannot be partitioned into equal sum subsets.
 */
public class EqualSumPartition {
	public static boolean canPartition(int[] nums) {
		long sum = 0;
		for (int num : nums) {
			sum += num;
		}

		if (sum % 2 != 0)
			return false;

		return isSubsetSumDP(nums, nums.length, (int) sum / 2);
	}

	public static boolean isSubsetSumDP(int[] set, int n, int sum) {
		int i, j;
		boolean[][] dp = new boolean[n + 1][sum + 1];
		//i represent n and j represents sum
		for (i = 0; i <= n; i++) {
			for (j = 0; j <= sum; j++) {
				if (i == 0) { // n==0
					dp[i][j] = Boolean.FALSE;
				} else if (j == 0) { //sum==0
					dp[i][j] = Boolean.TRUE;
				} else if (set[i - 1] <= j) {
					dp[i][j] = dp[i - 1][j] || dp[i - 1][j - set[i - 1]];
				} else {
					dp[i][j] = dp[i - 1][j];
				}
			}
		}
		//last element of matrix
		return dp[n][sum];
	}

	public static void main(String[] args) {
		int[] nums = {1, 5, 11, 5};
		System.out.println("Is array can be partitioned into equal sum subset ?: " + canPartition(nums));
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Partition Equal Subset Sum by filling only the first few states or table cells by hand. If the first transitions are not obvious on paper, they will not become clearer in code.

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

- Partition Equal Subset Sum becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
