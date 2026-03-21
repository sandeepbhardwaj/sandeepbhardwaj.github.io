---
title: "Sliding Window Maximum in Java"
date: '2024-02-04'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- arrays
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Sliding Window Maximum in Java"
seo_description: "Understand sliding window maximum in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Arrays, Hashing, and Pointer Problems in Java
  show_overlay_excerpt: false
---
Sliding Window Maximum is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Sliding Window Maximum

Problem description:
We are given a problem around **Sliding Window Maximum** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. scan the input while keeping the main invariant explicit
2. use the right supporting structure only when it removes repeated work
3. lean on priority-queue ordering, queue-driven traversal, pointer or search-space narrowing, and recursion or subtree decomposition rather than nested brute-force checks
4. return the result only after boundary cases like duplicates or empty input are accounted for

## Why This Problem Matters

- array problems teach when indexing alone is enough and when hashing or sorting changes the cost model
- many interview and production debugging tasks hide simple boundary bugs inside otherwise small loops
- sliding window maximum is a good example of trading brute force for a more intentional invariant

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

import java.util.*;

/**
 * 239. Sliding Window Maximum
 * <p>
 * Given an array arr[] of size N and an integer K. Find the maximum for each and every contiguous subarray of size K.
 * <p>
 * Example
 * Input 1: A = [1, 3, -1, -3, 5, 3, 6, 7] ,k = 3
 * Output: [3, 3, 5, 5, 6, 7]
 * <p>
 * Example 2:
 * Input: nums = [1], k = 1
 * Output: [1]
 * <p>
 * Example 3:
 * Input: nums = [1,-1], k = 1
 * Output: [1,-1]
 * <p>
 * Example 4:
 * Input: nums = [9,11], k = 2
 * Output: [11]
 * <p>
 * Example 5:
 * Input: nums = [4,-2], k = 2
 * Output: [4]
 */
public class SlidingWindowMaximum {
	public static int[] maxSlidingWindow(int[] nums, int k) {
		List<Integer> result = new ArrayList<>();

		int left = 0;
		int right = 0;
		// creating the max heap ,to get max element always
		PriorityQueue<Integer> queue = new PriorityQueue<>(Collections.reverseOrder());

		while (right < nums.length) {
			queue.add(nums[right]);

			if (right - left + 1 < k) {
				right++;
			} else if (right - left + 1 == k) {
				result.add(queue.peek());

				queue.remove(nums[left]);
				left++;
				right++;
			}
		}

		return result.stream().mapToInt(i -> i).toArray();
	}

	public static void main(String[] args) {
		int[] nums={1, -1};
		int k=1;
		int[] result=maxSlidingWindow(nums,k);

		for(int e:result)
			System.out.print(" "+e);
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run one small input and keep track of the exact index, accumulator, or lookup structure after each step. Sliding Window Maximum usually becomes easy once you can explain why each element is processed only once or why a second pass is still necessary.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- empty or single-element input
- duplicates that change lookup behavior
- already sorted or reverse-ordered input

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on priority-queue ordering, queue-driven traversal, pointer or search-space narrowing, and recursion or subtree decomposition. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print the running index and any lookup structure after each iteration
- re-run with duplicates and smallest valid input
- check whether the algorithm accidentally reuses the same element twice
- verify what happens before the first successful match

## Key Takeaways

- Sliding Window Maximum becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
