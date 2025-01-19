---
layout: post
title: Binary Search
author: Sandeep Bhardwaj
published: true
date: 2019-07-08 08:36:00 +5:30
category: Datastructure & Algorithms
tags: [Leetcode, Datastructure & Algorithms]
keywords: [Array, Binary Search]
summary: "Iterative binary search, Recursive binary search"
---

<h3>Binary Search Iterative and Recursive</h3>


``` java
/**
 * 704. Binary Search
 * <p>
 * Given a sorted (in ascending order) integer array nums of n elements and a target value, write a
 * function to search target in nums. If target exists, then return its index, otherwise return -1.
 * <p>
 * <p>
 * Example 1:
 * <p>
 * Input: nums = [-1,0,3,5,9,12], target = 9
 * Output: 4
 * Explanation: 9 exists in nums and its index is 4
 * <p>
 * Example 2:
 * <p>
 * Input: nums = [-1,0,3,5,9,12], target = 2
 * Output: -1
 * Explanation: 2 does not exist in nums so return -1
 */
public class BinarySearch {

	/**
	 * Iterative binary search
	 *
	 * @param nums
	 * @param target
	 * @return
	 */
	public int search(int[] nums, int target) {
		int low = 0;
		int high = nums.length - 1;

		while (low <= high) {
			int mid = (low + high) / 2;

			if (nums[mid] == target)
				return mid;

			if (nums[mid] > target) {
				high = mid - 1;
			} else {
				low = mid + 1;
			}
		}
		return -1;
	}

	/**
	 * Recursive binary search
	 *
	 * @param nums
	 * @param low
	 * @param high
	 * @param target
	 * @return index of search element if found else -1
	 */
	public int binarySearch(int[] nums, int low, int high, int target) {
		while (low <= high) {
			int mid = (low + high) / 2;

			if (nums[mid] == target)
				return mid;

			if (nums[mid] > target) {
				return binarySearch(nums, low, mid - 1, target);
			} else {
				return binarySearch(nums, mid + 1, high, target);
			}
		}
		return -1;
	}

}
```

