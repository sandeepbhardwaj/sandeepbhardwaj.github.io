---
layout: post
title: Find Minimum in Rotated Sorted Array
author: Sandeep Bhardwaj
published: true
date: 2019-07-12 01:00:00 +5:30
category: Datastructure & Algorithms
tags: [Leetcode, Datastructure & Algorithms]
keywords: "Array, Sorted Array, Binary Search"
summary: "Find Minimum in Rotated Sorted Array"
---

<h3>Find Minimum in Rotated Sorted Array</h3>


``` java
/**
 * 153. Find Minimum in Rotated Sorted Array
 * <p>
 * Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand.
 * <p>
 * (i.e.,  [0,1,2,4,5,6,7] might become  [4,5,6,7,0,1,2]).
 * <p>
 * Find the minimum element.
 * <p>
 * You may assume no duplicate exists in the array.
 * <p>
 * Example 1:
 * <p>
 * Input: [3,4,5,1,2]
 * Output: 1
 * Example 2:
 * <p>
 * Input: [4,5,6,7,0,1,2]
 * Output: 0
 */
class FindMinimumInRotatedSortedArray {
	public int findMin(int[] nums) {
		int low = 0;
		int high = nums.length - 1;

		while (low < high) {
			int mid = (low + high) / 2;

			if (nums[mid] > nums[high]) {
				low = mid + 1;
			} else if (nums[mid] < nums[high]) {
				high = mid;
			}
		}
		return nums[low];
	}
}
```

