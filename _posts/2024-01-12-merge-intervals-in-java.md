---
title: "Merge Intervals in Java"
date: '2024-01-12'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- arrays
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Merge Intervals in Java"
seo_description: "Understand merge intervals in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Arrays, Hashing, and Pointer Problems in Java
  show_overlay_excerpt: false
---
Merge Intervals is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Merge Intervals

Problem description:
We are given a problem around **Merge Intervals** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. scan the input while keeping the main invariant explicit
2. use the right supporting structure only when it removes repeated work
3. lean on recursion or subtree decomposition and table-based state transitions rather than nested brute-force checks
4. return the result only after boundary cases like duplicates or empty input are accounted for

## Why This Problem Matters

- array problems teach when indexing alone is enough and when hashing or sorting changes the cost model
- many interview and production debugging tasks hide simple boundary bugs inside otherwise small loops
- merge intervals is a good example of trading brute force for a more intentional invariant

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

{% raw %}
```java

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 56. Merge Intervals
 * <p>
 * Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array
 * of the non-overlapping intervals that cover all the intervals in the input.
 * <p>
 * Example 1:
 * Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
 * Output: [[1,6],[8,10],[15,18]]
 * Explanation: Since intervals [1,3] and [2,6] overlaps, merge them into [1,6].
 * <p>
 * Example 2:
 * Input: intervals = [[1,4],[4,5]]
 * Output: [[1,5]]
 * Explanation: Intervals [1,4] and [4,5] are considered overlapping.
 */
public class MergeIntervals {
	public static int[][] merge(int[][] intervals) {
		// Sort by ascending starting point
		Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

		List<int[]> result = new ArrayList<>();
		int[] prev = null;

		for (int[] inter : intervals) {
			//if prev is null (Ist element) OR prev end is smaller then
			if (prev == null || prev[1] < inter[0]) {
				result.add(inter);
				prev = inter;
			} else {
				//find max of end
				prev[1] = Math.max(prev[1], inter[1]);
			}
		}

		return result.toArray(new int[result.size()][]);
	}

	public static void main(String[] args) {
		int[][] intervals = new int[][]{{1, 3}, {2, 6}, {8, 10}, {15, 18}};

		int[][] result = merge(intervals);

		for (int[] interval : result) {
			System.out.print("{" + interval[0] + "," + interval[1] + "}, ");
		}
	}
}
```
{% endraw %}

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run one small input and keep track of the exact index, accumulator, or lookup structure after each step. Merge Intervals usually becomes easy once you can explain why each element is processed only once or why a second pass is still necessary.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- empty or single-element input
- duplicates that change lookup behavior
- already sorted or reverse-ordered input

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on recursion or subtree decomposition and table-based state transitions. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print the running index and any lookup structure after each iteration
- re-run with duplicates and smallest valid input
- check whether the algorithm accidentally reuses the same element twice
- verify what happens before the first successful match

## Key Takeaways

- Merge Intervals becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
