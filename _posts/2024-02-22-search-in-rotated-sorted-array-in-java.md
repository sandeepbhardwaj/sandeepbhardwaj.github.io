---
title: "Search in Rotated Sorted Array in Java"
date: '2024-02-22'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- binary-search
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Search in Rotated Sorted Array in Java"
seo_description: "Understand Search in Rotated Sorted Array in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Binary Search Variants in Java
  show_overlay_excerpt: false
---
Search in Rotated Sorted Array is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Search in Rotated Sorted Array

Problem description:
We are given a problem around **Search in Rotated Sorted Array** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. define the exact monotonic condition we are searching on
2. shrink the search space without losing the target condition
3. rely on pointer or search-space narrowing instead of ad-hoc midpoint guesses
4. stop only when the final boundary still satisfies the original problem statement

## Why This Problem Matters

- binary search is really about monotonicity, not about arrays alone
- many bugs come from unclear boundary choices rather than the midpoint formula itself
- Search in Rotated Sorted Array is useful because it forces a precise left-right invariant

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

/**
 * Suppose an array sorted in ascending order is rotated at some pivot unknown
 * to you beforehand.
 * <p>
 * (i.e., [0,1,2,4,5,6,7] might become [4,5,6,7,0,1,2]).
 * <p>
 * You are given a target value to search. If found in the array return its
 * index, otherwise return -1.
 * <p>
 * You may assume no duplicate exists in the array.
 * <p>
 * Your algorithm's runtime complexity must be in the order of O(log n).
 * <p>
 * Example 1:
 * <p>
 * Input: nums = [4,5,6,7,0,1,2], target = 0 Output: 4 Example 2:
 * <p>
 * Input: nums = [4,5,6,7,0,1,2], target = 3 Output: -1
 */
public class SearchInRotatedSortedArray {
	public static int search(int[] nums, int target) {
		int low = 0;
		int high = nums.length - 1;

		while (low <= high) {
			int mid = low + (high - low) / 2;

			if (nums[mid] == target) {
				return mid;
			}

			//if left part is sorter
			if (nums[low] <= nums[mid]) {
				//element exit in range
				if (nums[low] <= target && target <= nums[mid]) {
					high = mid - 1;
				} else {
					low = mid + 1;
				}

			} else {
				//element exit in range
				if (nums[mid + 1] <= target && target <= nums[high]) {
					low = mid + 1;
				} else {
					high = mid - 1;
				}
			}

		}

		return -1;
	}

	public static void main(String[] args) {
		int[] nums = new int[]{4, 5, 6, 7, 0, 1, 2};
		int result = search(nums, 3);
		System.out.println(result);
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Search in Rotated Sorted Array by writing `left`, `right`, and `mid` after each iteration. The key check is whether the chosen half still contains all valid answers after every update.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- target at the first or last valid index
- one-element search space
- duplicate values that break naive boundary updates

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on pointer or search-space narrowing. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print left, right, and mid on each iteration
- assert the target condition still lives in the chosen half
- test first and last index answers
- review the loop condition on one-element inputs

## Key Takeaways

- Search in Rotated Sorted Array becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
