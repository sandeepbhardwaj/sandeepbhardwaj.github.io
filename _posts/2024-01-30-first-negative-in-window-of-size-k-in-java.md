---
title: "First Negative in Window of Size K in Java"
date: '2024-01-30'
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
seo_title: "First Negative in Window of Size K in Java"
seo_description: "Understand first negative in window of size k in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Arrays, Hashing, and Pointer Problems in Java
  show_overlay_excerpt: false
---
First Negative in Window of Size K is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: First Negative in Window of Size K

Problem description:
We are given a problem around **First Negative in Window of Size K** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. scan the input while keeping the main invariant explicit
2. use the right supporting structure only when it removes repeated work
3. lean on queue-driven traversal and pointer or search-space narrowing rather than nested brute-force checks
4. return the result only after boundary cases like duplicates or empty input are accounted for

## Why This Problem Matters

- array problems teach when indexing alone is enough and when hashing or sorting changes the cost model
- many interview and production debugging tasks hide simple boundary bugs inside otherwise small loops
- first negative in window of size k is a good example of trading brute force for a more intentional invariant

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * First negative integer in every window of size k
 * Given an array A[] of size N and a positive integer K, find the first negative integer for each and every
 * window(contiguous subarray) of size K.
 * <p>
 * Example 1:
 * <p>
 * Input : N = 5, A[] = {-8, 2, 3, -6, 10}, K = 2
 * Output : -8 0 -6 -6
 * Explanation :
 * First negative integer for each window of size k
 * {-8, 2} = -8
 * {2, 3} = 0 (does not contain a negative integer)
 * {3, -6} = -6
 * {-6, 10} = -6
 * <p>
 * Example 2:
 * Input : N = 8, A[] = {12, -1, -7, 8, -15, 30, 16, 28}, K = 3
 * Output : -1 -1 -7 -15 -15 0
 * <p>
 * Ref: https://practice.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k3345/1#
 */
public class IstNegativeInWindowOfSizeK {

	private static List<Integer> negativeInWindowOfSizeK(int[] nums, int k) {
		List<Integer> result = new ArrayList<>();

		int left = 0, right = 0;

		Queue<Integer> queue = new LinkedList<>();

		while (right < nums.length) {
			queue.add(nums[right]);

			//if window is smaller than k , increase window size
			if (right - left + 1 < k) {
				right++;
			} else if (right - left + 1 == k) { // window is equal to k
				for (int e : queue) {
					if (e < 0) { // find Ist -ve and break the loop
						result.add(e);
						break;
					}
				}

				queue.poll(); // remove first element added using left
				right++;
				left++;
			}
		}
		return result;
	}

	public static void main(String[] args) {
		//int[] nums = {-8, 2, 3, -6, 10};
		//int k=2
		int[] nums = {12, -1, -7, 8, -15, 30, 16, 28};
		int k = 3;
		System.out.println(negativeInWindowOfSizeK(nums, k));
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run one small input and keep track of the exact index, accumulator, or lookup structure after each step. First Negative in Window of Size K usually becomes easy once you can explain why each element is processed only once or why a second pass is still necessary.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- empty or single-element input
- duplicates that change lookup behavior
- already sorted or reverse-ordered input

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on queue-driven traversal and pointer or search-space narrowing. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print the running index and any lookup structure after each iteration
- re-run with duplicates and smallest valid input
- check whether the algorithm accidentally reuses the same element twice
- verify what happens before the first successful match

## Key Takeaways

- First Negative in Window of Size K becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
