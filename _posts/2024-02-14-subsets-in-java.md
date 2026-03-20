---
title: "Subsets in Java"
date: '2024-02-14'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- backtracking
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Subsets in Java"
seo_description: "Understand subsets in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Backtracking and Search Problems in Java
  show_overlay_excerpt: false
---
Subsets is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Subsets

Problem description:
We are given a problem around **Subsets** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. treat each recursion level as one decision point
2. add one candidate choice to the partial answer
3. backtrack immediately after the recursive call so sibling branches stay clean
4. use recursion or subtree decomposition to keep the search tree understandable rather than magical

## Why This Problem Matters

- backtracking problems force you to make the search tree explicit instead of guessing recursively
- the discipline of choose-explore-unchoose is reusable across combinations, permutations, and partitioning tasks
- subsets becomes much easier once the partial answer is treated as state

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

import java.util.ArrayList;
import java.util.List;

/**
 * 78. Subsets
 * Given an integer array nums of unique elements, return all possible subsets (the power set).
 * <p>
 * The solution set must not contain duplicate subsets. Return the solution in any order.
 * <p>
 * Example 1:
 * Input: nums = [1,2,3]
 * Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
 * <p>
 * Example 2:
 * Input: nums = [0]
 * Output: [[],[0]]
 */
public class Subsets {

	public static void backtrack_(int index, List<Integer> current, int[] nums, List<List<Integer>> result) {

		if (index == nums.length) {
			// add current to result;
			result.add(new ArrayList<>(current));
			return;
		}

		//add current element to list
		current.add(nums[index]);

		//include the  next element
		backtrack_(index + 1, current, nums, result);

		//remove the last element
		current.remove(current.size() - 1);

		//back track with removed element
		backtrack_(index + 1, current, nums, result);
	}


	public static void backtrack(int start, List<Integer> current, int[] nums, List<List<Integer>> result) {
		// add current to result;
		result.add(new ArrayList<>(current));

		for (int i = start; i < nums.length; i++) {
			//add current element to list
			current.add(nums[i]);

			// Exclude the element using i+1
			backtrack(i + 1, current, nums, result);

			// backtrack to use the
			current.remove(current.size() - 1);
		}
	}

	public static List<List<Integer>> subsetsIteratively(int[] nums) {
		List<List<Integer>> res = new ArrayList<>();

		res.add(new ArrayList<>());
		for (int i = 0; i < nums.length; i++) {
			int n = res.size();
			for (int j = 0; j < n; j++) {
				List<Integer> temp = new ArrayList(res.get(j));
				temp.add(nums[i]);
				res.add(temp);
			}
		}
		return res;
	}

	public static List<List<Integer>> subsets(int[] nums) {
		List<List<Integer>> result = new ArrayList<>();

		backtrack(0, new ArrayList<>(), nums, result);
		return result;
	}


	public static void main(String[] args) {
		int[] nums = new int[]{1, 2, 3};

		//System.out.println(subsetsIteratively(nums));
		System.out.println(subsets(nums));
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Subsets as a decision tree. At each recursion level, note the current partial answer, the next available choices, and what gets removed again during backtracking. That reveals why the recursion does not leak state across siblings.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- empty partial answer at the root
- duplicate choices that need pruning
- base case reached with no more valid extensions

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on recursion or subtree decomposition. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- log the recursion depth and current partial answer
- confirm state is undone immediately after each recursive branch
- watch for duplicate branches that should be pruned
- verify the base case adds a copy, not a mutable reference

## Key Takeaways

- Subsets becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
