---
title: "Kth Largest Element in an Array in Java"
date: '2024-03-21'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- heap
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Kth Largest Element in an Array in Java"
seo_description: "Understand kth largest element in an array in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Heap and Priority Queue Problems in Java
  show_overlay_excerpt: false
---
Kth Largest Element in an Array is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Kth Largest Element in an Array

Problem description:
We are given a problem around **Kth Largest Element in an Array** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. decide what the heap must represent at every moment
2. push new candidates only when they can change the current answer
3. use priority-queue ordering, queue-driven traversal, and recursion or subtree decomposition to keep the heap size and meaning under control
4. return the final heap-derived answer only after all candidates are processed

## Why This Problem Matters

- heap problems teach how to preserve only the most valuable candidates instead of sorting everything
- the trick is usually deciding what the heap means at all times
- kth largest element in an array makes that top-k discipline visible

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

import java.util.PriorityQueue;

/**
 * 215. Kth Largest Element in an Array
 * <p>
 * Given an integer array nums and an integer k, return the kth largest element in the array.
 * <p>
 * Note that it is the kth largest element in the sorted order, not the kth distinct element.
 */
public class KthLargest {
	public static int findKthLargest(int[] nums, int k) {
		PriorityQueue<Integer> minHeap = new PriorityQueue<>();

		for (int num : nums) {
			minHeap.add(num);

			if (minHeap.size() > k) {
				minHeap.poll();
			}
		}
		return minHeap.peek();
	}

	public static int findKthSmallest(int[] nums, int k) {
		PriorityQueue<Integer> maxHeap = new PriorityQueue<Integer>((a, b) -> b.compareTo(a));

		for (int num : nums) {
			maxHeap.add(num);

			if (maxHeap.size() > k) {
				maxHeap.poll();
			}
		}
		return maxHeap.peek();
	}

	public static void main(String[] args) {
		int[] nums = new int[]{3, 2, 1, 5, 6, 4};
		int k = 2;
		System.out.println(findKthLargest(nums, k));
		System.out.println(findKthSmallest(nums, k));
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Kth Largest Element in an Array while writing the heap contents after each insertion or eviction. The answer should be explainable from the heap meaning alone, not from hidden side calculations.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- input smaller than k
- duplicate values in the candidate set
- heap meaning after the final insertion

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on priority-queue ordering, queue-driven traversal, and recursion or subtree decomposition. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print heap contents after every push/pop
- verify the heap meaning never changes mid-solution
- test duplicate values and `k=1`
- check whether the final heap still contains exactly the intended candidates

## Key Takeaways

- Kth Largest Element in an Array becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
