---
title: "Combinations in Java"
date: '2024-02-10'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- backtracking
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Combinations in Java"
seo_description: "Understand combinations in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Backtracking and Search Problems in Java
  show_overlay_excerpt: false
---
Combinations is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Combinations

Problem description:
We are given a problem around **Combinations** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

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
- combinations becomes much easier once the partial answer is treated as state

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

import java.util.ArrayList;
import java.util.List;

/**
 * 77. Combinations
 * Given two integers n and k, return all possible combinations of k numbers out of the range [1, n].
 * You may return the answer in any order.
 * <p>
 * Example 1:
 * Input: n = 4, k = 2
 * Output:
 * [
 * [2,4],
 * [3,4],
 * [2,3],
 * [1,2],
 * [1,3],
 * [1,4],
 * ]
 * <p>
 * Example 2:
 * Input: n = 1, k = 1
 * Output: [[1]]
 */
public class Combinations {
	public static List<List<Integer>> combine(int n, int k) {
		List<List<Integer>> result = new ArrayList<>();
		backtrack(1, new ArrayList<>(), result, n, k);
		return result;
	}

	static void backtrack(int start, List<Integer> current, List<List<Integer>> result, int n, int k) {
		if (current.size() == k) {
			result.add(new ArrayList<Integer>(current));
		}

		for (int i = start; i <= n; i++) {
			current.add(i);
			backtrack(i + 1, current, result, n, k);
			current.remove(current.size() - 1);
		}
	}

	public static void main(String[] args) {
		List<List<Integer>> result = combine(4, 2);
		result.forEach(System.out::println);
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Combinations as a decision tree. At each recursion level, note the current partial answer, the next available choices, and what gets removed again during backtracking. That reveals why the recursion does not leak state across siblings.

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

- Combinations becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
