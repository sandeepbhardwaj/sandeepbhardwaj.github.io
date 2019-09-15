---
layout: post
title: Maximum Subarray - Kadane's Algorithm
author: Sandeep Bhardwaj
published: true
date: 2019-09-15 01:00:00 +5:30
category: Datastructure & Algorithms
tags: [Leetcode, Datastructure & Algorithms]
keywords: "Array"
summary: "Maximum Subarray - Kadane's Algorithm"
---

<h3>Maximum Subarray - Kadane's Algorithm</h3>


``` java
/**
 * 53. Maximum Subarray - Kadane's Algorithm
 * <p>
 * Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum
 * and return its sum.
 * <p>
 * Example:
 * <p>
 * Input: [-2,1,-3,4,-1,2,1,-5,4],
 * Output: 6
 * Explanation: [4,-1,2,1] has the largest sum = 6.
 * Follow up:
 * <p>
 * If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach,
 * which is more subtle.
 */
public class MaximumSubarray {
	public int maxSubArray(int[] nums) {
		int max_so_far = nums[0];
		int max_ending_here = nums[0];

		for (int i = 1; i < nums.length; i++) {
			max_ending_here = Math.max(max_ending_here + nums[i], nums[i]);

			max_so_far = Math.max(max_so_far, max_ending_here);

		}
		return max_so_far;
	}
}
```