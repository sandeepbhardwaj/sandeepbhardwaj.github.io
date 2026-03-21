---
title: "Two Sum in Java"
date: '2024-01-26'
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
seo_title: "Two Sum in Java"
seo_description: "Understand two sum in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Arrays, Hashing, and Pointer Problems in Java
  show_overlay_excerpt: false
---
Two Sum is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Two Sum

Problem description:
We are given a problem around **Two Sum** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. scan the input while keeping the main invariant explicit
2. use the right supporting structure only when it removes repeated work
3. lean on hash-based lookup, pointer or search-space narrowing, and recursion or subtree decomposition rather than nested brute-force checks
4. return the result only after boundary cases like duplicates or empty input are accounted for

## Why This Problem Matters

- array problems teach when indexing alone is enough and when hashing or sorting changes the cost model
- many interview and production debugging tasks hide simple boundary bugs inside otherwise small loops
- two sum is a good example of trading brute force for a more intentional invariant

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

import java.util.HashMap;
import java.util.Map;


public class TwoSum {

	/**
	 * 1. Two Sum
	 * Given an array of integers, return indices of the two numbers such that they add up to a specific target.
	 * <p>
	 * You may assume that each input would have exactly one solution, and you may not use the same element twice.
	 * <p>
	 * Example:
	 * <p>
	 * Given nums = [2, 7, 11, 15], target = 9,
	 * <p>
	 * Because nums[0] + nums[1] = 2 + 7 = 9,
	 * return [0, 1].
	 *
	 * @param nums
	 * @param target
	 * @return
	 */
	public int[] twoSum(int[] nums, int target) {
		// store target-num[i] as key and index as value
		Map<Integer, Integer> map = new HashMap<>();
		for (int i = 0; i < nums.length; i++) {

			//check if (target-num[i]) is already exit
			if (map.containsKey(nums[i])) {
				return new int[]{map.get(nums[i]), i};
			}

			// for num[0]=2 , 7 as key and 0 as value {7,0}
			map.put(target - nums[i], i);
		}
		return null;
	}

	/**
	 * 167. Two Sum II - Input array is sorted
	 * Given an array of integers numbers that is already sorted in non-decreasing order, find two numbers such that
	 * they add up to a specific target number.
	 * Return the indices of the two numbers (1-indexed) as an integer array answer of size 2,
	 * where 1 <= answer[0] < answer[1] <= numbers.length.
	 * The tests are generated such that there is exactly one solution. You may not use the same element twice.
	 * <p>
	 * Example 1:
	 * Input: numbers = [2,7,11,15], target = 9
	 * Output: [1,2]
	 * Explanation: The sum of 2 and 7 is 9. Therefore index1 = 1, index2 = 2.
	 * <p>
	 * Example 2:
	 * Input: numbers = [2,3,4], target = 6
	 * Output: [1,3]
	 * <p>
	 * Example 3:
	 * Input: numbers = [-1,0], target = -1
	 * Output: [1,2]
	 *
	 * @param numbers
	 * @param target
	 * @return
	 */
	public int[] twoSum_II(int[] numbers, int target) {
		int left = 0;
		int right = numbers.length - 1;

		while (numbers[left] + numbers[right] != target) {
			if (numbers[left] + numbers[right] > target)
				right--;
			else
				left++;
		}
		return new int[]{left + 1, right + 1};
	}

}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run one small input and keep track of the exact index, accumulator, or lookup structure after each step. Two Sum usually becomes easy once you can explain why each element is processed only once or why a second pass is still necessary.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- empty or single-element input
- duplicates that change lookup behavior
- already sorted or reverse-ordered input

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on hash-based lookup, pointer or search-space narrowing, and recursion or subtree decomposition. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print the running index and any lookup structure after each iteration
- re-run with duplicates and smallest valid input
- check whether the algorithm accidentally reuses the same element twice
- verify what happens before the first successful match

## Key Takeaways

- Two Sum becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
