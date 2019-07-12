---
layout: post
title: Find First and Last Position of Element in Sorted Array
author: Sandeep Bhardwaj
published: true
date: 2019-07-13 01:00:00 +5:30
category: Datastructure & Algorithms
tags: [Leetcode, Datastructure & Algorithms]
keywords: "Array, Sorted Array, Binary Search"
summary: "Find First and Last Position of Element in Sorted Array"
---

<h3>Find First and Last Position of Element in Sorted Array</h3>


``` java
/**
 * 34. Find First and Last Position of Element in Sorted Array
 * <p>
 * Given an array of integers nums sorted in ascending order, find the starting and ending position of a given target value.
 * <p>
 * Your algorithm's runtime complexity must be in the order of O(log n).
 * <p>
 * If the target is not found in the array, return [-1, -1].
 * <p>
 * Example 1:
 * <p>
 * Input: nums = [5,7,7,8,8,10], target = 8
 * Output: [3,4]
 * Example 2:
 * <p>
 * Input: nums = [5,7,7,8,8,10], target = 6
 * Output: [-1,-1]
 */
class FirstAndLastPositionOfElementInSortedArray {
	public int[] searchRange(int[] nums, int target) {
		int start = elementIndex(nums, target, 0, nums.length - 1, true);

		if (start == -1) {
			return new int[]{-1, -1};
		}
		int end = elementIndex(nums, target, 0, nums.length - 1, false);

		return new int[]{start, end};
	}

	public int elementIndex(int[] nums, int target, int low, int high, boolean isSearchForStartIndex) {
		int index = -1;
		while (low <= high) {
			int mid = (low + high) / 2;
			if (nums[mid] == target) {
				index = mid;
				if (isSearchForStartIndex) {
					high = mid - 1;
				} else {
					low = mid + 1;
				}
			} else if (nums[mid] > target) {
				high = mid - 1;
			} else {
				low = mid + 1;
			}
		}
		return index;
	}
}
```

