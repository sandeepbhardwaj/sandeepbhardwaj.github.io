---
title: "Subarray Sum Equals K in Java"
date: '2024-02-06'
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
seo_title: "Subarray Sum Equals K in Java"
seo_description: "Understand subarray sum equals k in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Arrays, Hashing, and Pointer Problems in Java
  show_overlay_excerpt: false
---
Subarray Sum Equals K is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Subarray Sum Equals K

Problem description:
We are given a problem around **Subarray Sum Equals K** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. scan the input while keeping the main invariant explicit
2. use the right supporting structure only when it removes repeated work
3. lean on hash-based lookup rather than nested brute-force checks
4. return the result only after boundary cases like duplicates or empty input are accounted for

## Why This Problem Matters

- array problems teach when indexing alone is enough and when hashing or sorting changes the cost model
- many interview and production debugging tasks hide simple boundary bugs inside otherwise small loops
- subarray sum equals k is a good example of trading brute force for a more intentional invariant

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

import java.util.HashMap;
import java.util.Map;

/**
 * 560. Subarray Sum Equals K
 * <p>
 * Given an array of integers and an integer k, you need to find the total
 * number of continuous subarrays whose sum equals to k.
 * <p>
 * Example 1: Input:nums = [1,1,1], k = 2 Output: 2
 *
 * @author sandeep
 */
public class SubarraySumEqualsK {

	/**
	 * if the cumulative sum up to two indices, say ii and jj is at a difference of k i.e.
	 * if sum[i] - sum[j] = k
	 *
	 * @param nums
	 * @param k
	 * @return
	 */
	public static int subarraySum(int[] nums, int k) {
		int count = 0;

		// key as preSum and value as frequency
		Map<Integer, Integer> preSum = new HashMap<>();

		//for base case
		//check whether currentSum - k = 0, if 0 it means the sub array is starting from index 0
		preSum.put(0, 1);

		int currentSum = 0;
		for (int num : nums) {
			currentSum += num;

			//if currentSum-k found in map
			if (preSum.containsKey(currentSum - k)) {
				count += preSum.get(currentSum - k);
			}

			preSum.put(currentSum, preSum.getOrDefault(currentSum, 0) + 1);
		}

		return count;
	}

	/**
	 * consider every possible subarray of the given numsnums array, find the sum of the elements of each of those
	 * subarrays and check for the equality of the sum obtained with the given kk. Whenever the sum equals kk,
	 * we can increment the count used to store the required result.
	 * <p>
	 * Time complexity : O(n^2). We need to consider every subarray possible.
	 *
	 * @param nums
	 * @param k
	 * @return count
	 */
	public static int bruteForce(int[] nums, int k) {
		int count = 0;
		for (int i = 0; i < nums.length; i++) {
			int sum = 0;
			for (int j = i; j < nums.length; j++) {
				sum += nums[j];
				if (sum == k)
					count++;
			}
		}
		return count;
	}

	public static void main(String[] args) {
		//int[] nums = {1, 0, 1, 0, 1};
		//System.out.println(subarraySum(nums, 1));
		int[] nums = {4, 4, 4};
		System.out.println(subarraySum(nums, 4));
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run one small input and keep track of the exact index, accumulator, or lookup structure after each step. Subarray Sum Equals K usually becomes easy once you can explain why each element is processed only once or why a second pass is still necessary.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- empty or single-element input
- duplicates that change lookup behavior
- already sorted or reverse-ordered input

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on hash-based lookup. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print the running index and any lookup structure after each iteration
- re-run with duplicates and smallest valid input
- check whether the algorithm accidentally reuses the same element twice
- verify what happens before the first successful match

## Key Takeaways

- Subarray Sum Equals K becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
